document.addEventListener("DOMContentLoaded", function () {
  // Set your target date here (YYYY-MM-DD HH:MM:SS)
  var targetDate = new Date("2025-08-22T09:00:00").getTime();

  var countdownD = document.getElementById("countdown-days");
  var countdownH = document.getElementById("countdown-hours");
  var countdownM = document.getElementById("countdown-mins");
  var countdownS = document.getElementById("countdown-secs");
  var countdownSection = document.getElementById("countdown-section");
  var countdownDivider = document.getElementById("countdown-divider");

  function updateCountdown() {
    var now = new Date().getTime();
    var distance = targetDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance < 0 || (days === 0 && hours === 0 && minutes === 0 && seconds === 0)) {
      countdownD.textContent = "0";
      countdownH.textContent = "0";
      countdownM.textContent = "0";
      countdownS.textContent = "0";
      if (countdownSection) countdownSection.style.display = "none";
      if (countdownDivider) countdownDivider.style.display = "none";
      return;
    } else {
      if (countdownSection) countdownSection.style.display = "";
      if (countdownDivider) countdownDivider.style.display = "";
    }

    countdownD.textContent = days;
    countdownH.textContent = hours;
    countdownM.textContent = minutes;
    countdownS.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
