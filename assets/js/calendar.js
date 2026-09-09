/*
  Coyle Hall calendar — fetches events client-side from the Google Calendar
  API (a public, referrer-restricted, read-only key) and renders either the
  full Events → Calendar tab (list + month grid) or the homepage "Up next"
  widget, depending on which mount points exist on the page.

  Config comes from data attributes on #coyle-calendar-root /
  #coyle-calendar-widget, set server-side from site.Params.calendar.
*/
(function () {
  "use strict";

  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

  function apiUrl(calendarId, apiKey, timeMin, timeMax) {
    var base = "https://www.googleapis.com/calendar/v3/calendars/" +
      encodeURIComponent(calendarId) + "/events";
    var params = new URLSearchParams({
      key: apiKey,
      singleEvents: "true",
      orderBy: "startTime",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: "100"
    });
    return base + "?" + params.toString();
  }

  function normalize(raw) {
    var items = (raw && raw.items) || [];
    return items.map(function (item) {
      var startRaw = item.start && (item.start.dateTime || item.start.date);
      var allDay = !!(item.start && item.start.date && !item.start.dateTime);
      var start = new Date(startRaw);
      return {
        id: item.id,
        title: item.summary || "Untitled event",
        loc: (item.location || "").trim(),
        date: startRaw ? startRaw.slice(0, 10) : "",
        allDay: allDay,
        time: allDay ? "All day" : formatTime(start),
        htmlLink: item.htmlLink || "#"
      };
    }).filter(function (ev) { return ev.date; });
  }

  function formatTime(d) {
    if (isNaN(d.getTime())) return "";
    var h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    return h + (m ? ":" + String(m).padStart(2, "0") : "") + " " + ampm;
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function fetchEvents(calendarId, apiKey, timeMin, timeMax) {
    return fetch(apiUrl(calendarId, apiKey, timeMin, timeMax))
      .then(function (r) {
        if (!r.ok) throw new Error("Calendar request failed (" + r.status + ")");
        return r.json();
      })
      .then(normalize);
  }

  function fmtDate(iso) {
    var d = new Date(iso + "T00:00:00");
    return { dow: DOW[d.getDay()], dom: d.getDate(), month: MONTHS[d.getMonth()], year: d.getFullYear() };
  }

  /* ── Full page: list view ─────────────────────────────────────── */
  function renderList(container, events) {
    var TODAY = todayISO();
    container.innerHTML = "";
    if (!events.length) {
      container.innerHTML = '<p class="cal-loading">No upcoming events on the calendar right now.</p>';
      return;
    }
    var byMonth = {};
    var order = [];
    events.forEach(function (ev) {
      var f = fmtDate(ev.date);
      var key = f.month + " " + f.year;
      if (!byMonth[key]) { byMonth[key] = []; order.push(key); }
      byMonth[key].push(ev);
    });
    order.forEach(function (key) {
      var heading = document.createElement("div");
      heading.className = "cal-month-heading";
      heading.textContent = key;
      container.appendChild(heading);

      var list = document.createElement("div");
      list.className = "cal-event-list";
      byMonth[key].forEach(function (ev) {
        list.appendChild(eventRow(ev, TODAY));
      });
      container.appendChild(list);
    });
  }

  function eventRow(ev, TODAY) {
    var f = fmtDate(ev.date);
    var a = document.createElement("a");
    a.href = ev.htmlLink;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "cal-event-row" + (ev.date === TODAY ? " is-today" : "");
    a.innerHTML =
      '<div class="cal-date-chip"><span class="dow">' + f.dow + '</span><span class="dom">' + f.dom + '</span></div>' +
      '<div class="cal-event-main">' +
        '<div class="cal-event-title"></div>' +
        '<div class="cal-event-meta"><span></span></div>' +
      '</div>' +
      '<div class="cal-event-time"></div>';
    a.querySelector(".cal-event-title").textContent = ev.title;
    a.querySelector(".cal-event-meta span").textContent = ev.loc;
    a.querySelector(".cal-event-time").textContent = ev.time;
    return a;
  }

  /* ── Full page: grid (month) view ─────────────────────────────── */
  function renderGrid(root, calendarId, apiKey, year, month) {
    var toolbar = root.querySelector(".cal-toolbar h3");
    var body = root.querySelector("#cal-grid-body");
    toolbar.textContent = MONTHS[month] + " " + year;
    body.innerHTML = '<p class="cal-loading">Loading…</p>';

    var monthStart = new Date(year, month, 1);
    var monthEnd = new Date(year, month + 1, 1);

    fetchEvents(calendarId, apiKey, monthStart, monthEnd).then(function (events) {
      var TODAY = todayISO();
      var startOffset = monthStart.getDay();
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var daysInPrev = new Date(year, month, 0).getDate();

      // Pad both ends with the neighbouring months' own dates, so the last row
      // trails off into 1, 2, 3 of next month rather than counting past 31.
      var cells = [];
      for (var i = startOffset - 1; i >= 0; i--) cells.push({ n: daysInPrev - i, muted: true });
      for (var d = 1; d <= daysInMonth; d++) cells.push({ n: d, muted: false });
      for (var next = 1; cells.length % 7 !== 0; next++) cells.push({ n: next, muted: true });

      var byDay = {};
      events.forEach(function (ev) {
        var day = parseInt(ev.date.slice(8, 10), 10);
        (byDay[day] = byDay[day] || []).push(ev);
      });

      body.innerHTML = "";
      cells.forEach(function (cell) {
        var iso = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(cell.n).padStart(2, "0");
        var div = document.createElement("div");
        div.className = "cal-day" + (cell.muted ? " is-muted" : "") + (!cell.muted && iso === TODAY ? " is-today" : "");
        var inner = '<span class="cal-num">' + cell.n + "</span>";
        if (!cell.muted && byDay[cell.n]) {
          var evs = byDay[cell.n];
          var shown = evs.slice(0, 2);
          shown.forEach(function (ev) {
            inner += '<span class="cal-pip">' + escapeHtml(ev.title) + "</span>";
          });
          if (evs.length > shown.length) inner += '<span class="cal-more-pip">+' + (evs.length - shown.length) + " more</span>";
        }
        div.innerHTML = inner;
        body.appendChild(div);
      });
    }).catch(function (err) {
      body.innerHTML = '<p class="cal-error">' + escapeHtml(err.message) + "</p>";
    });
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  /* ── Homepage widget ───────────────────────────────────────────── */
  function renderWidget(root, events) {
    var strip = root.querySelector(".cal-strip");
    strip.innerHTML = "";
    if (!events.length) {
      strip.innerHTML = '<p class="cal-loading" style="color:#fff;opacity:.8;">No upcoming events.</p>';
      return;
    }
    events.slice(0, 8).forEach(function (ev) {
      var f = fmtDate(ev.date);
      var a = document.createElement("a");
      a.href = ev.htmlLink;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "cal-widget-card";
      // The location row (pin + text) is only rendered when the event
      // actually has a location — an empty pin reads as missing data.
      a.innerHTML =
        '<span class="cal-widget-date"></span>' +
        '<span class="cal-widget-title"></span>' +
        (ev.loc
          ? '<span class="cal-widget-loc"><svg viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg><span></span></span>'
          : "");
      a.querySelector(".cal-widget-date").textContent = f.dow + " · " + f.month.slice(0, 3) + " " + f.dom;
      a.querySelector(".cal-widget-title").textContent = ev.title;
      if (ev.loc) a.querySelector(".cal-widget-loc span").textContent = ev.loc;
      strip.appendChild(a);
    });
    wireStripNav(root);
  }

  function wireStripNav(root) {
    var strip = root.querySelector(".cal-strip");
    var prev = root.querySelector(".cal-arrow--prev");
    var next = root.querySelector(".cal-arrow--next");
    if (!prev || !next) return;
    function cardStep() {
      var card = strip.querySelector(".cal-widget-card");
      var gap = parseFloat(getComputedStyle(strip).columnGap) || 16;
      return card ? card.getBoundingClientRect().width + gap : 240;
    }
    function update() {
      var max = strip.scrollWidth - strip.clientWidth;
      prev.classList.toggle("is-hidden", strip.scrollLeft <= 2);
      next.classList.toggle("is-hidden", strip.scrollLeft >= max - 2);
    }
    prev.addEventListener("click", function () { strip.scrollBy({ left: -cardStep(), behavior: "smooth" }); });
    next.addEventListener("click", function () { strip.scrollBy({ left: cardStep(), behavior: "smooth" }); });
    strip.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    update();
  }

  /* ── View toggle (full page) ──────────────────────────────────── */
  function wireViewSwitch(root) {
    var switchEl = root.querySelector(".cal-view-switch");
    if (!switchEl) return;
    switchEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      switchEl.querySelectorAll("button").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      var view = btn.dataset.view;
      root.querySelector("#cal-panel-list").classList.toggle("is-active", view === "list");
      root.querySelector("#cal-panel-grid").classList.toggle("is-active", view === "grid");
    });
  }

  function wireMonthNav(root, calendarId, apiKey) {
    var state = { date: new Date() };
    state.date.setDate(1);
    var prevBtn = root.querySelector(".cal-nav [data-nav='prev']");
    var nextBtn = root.querySelector(".cal-nav [data-nav='next']");
    function render() { renderGrid(root, calendarId, apiKey, state.date.getFullYear(), state.date.getMonth()); }
    prevBtn.addEventListener("click", function () { state.date.setMonth(state.date.getMonth() - 1); render(); });
    nextBtn.addEventListener("click", function () { state.date.setMonth(state.date.getMonth() + 1); render(); });
    render();
  }

  /* ── Init ─────────────────────────────────────────────────────── */
  function initFullPage() {
    var root = document.getElementById("coyle-calendar-root");
    if (!root) return;
    var calendarId = root.dataset.calendarId;
    var apiKey = root.dataset.apiKey;
    if (!calendarId || !apiKey) {
      root.innerHTML = '<p class="cal-loading">The hall calendar isn’t hooked up yet — check back soon.</p>';
      return;
    }
    wireViewSwitch(root);

    var listEl = root.querySelector("#cal-panel-list .cal-event-list-wrap");
    listEl.innerHTML = '<p class="cal-loading">Loading…</p>';
    var now = new Date();
    var horizon = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    fetchEvents(calendarId, apiKey, now, horizon)
      .then(function (events) { renderList(listEl, events); })
      .catch(function (err) { listEl.innerHTML = '<p class="cal-error">' + escapeHtml(err.message) + "</p>"; });

    wireMonthNav(root, calendarId, apiKey);
  }

  function initWidget() {
    var root = document.getElementById("coyle-calendar-widget");
    if (!root) return;
    var calendarId = root.dataset.calendarId;
    var apiKey = root.dataset.apiKey;
    if (!calendarId || !apiKey) return;

    var now = new Date();
    var horizon = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    fetchEvents(calendarId, apiKey, now, horizon)
      .then(function (events) { renderWidget(root, events); })
      .catch(function () {
        root.querySelector(".cal-strip").innerHTML =
          '<p class="cal-loading" style="color:#fff;opacity:.8;">Couldn’t load events right now.</p>';
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFullPage();
    initWidget();
  });
})();
