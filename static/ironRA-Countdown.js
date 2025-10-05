document.addEventListener("DOMContentLoaded", function () {
  // Set your target date here (YYYY-MM-DD HH:MM:SS)
  var targetDate = new Date("2025-12-06T00:00:00").getTime();

  var countdownD = document.getElementById("ironra-countdown-days");
  var countdownH = document.getElementById("ironra-countdown-hours");
  var countdownM = document.getElementById("ironra-countdown-mins");
  var countdownS = document.getElementById("ironra-countdown-secs");

  function updateCountdown() {
    var now = new Date().getTime();
    var distance = targetDate - now;

    if (distance < 0) {
      countdownD.textContent = "0";
      countdownH.textContent = "0";
      countdownM.textContent = "0";
      countdownS.textContent = "0";
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownD.textContent = days;
    countdownH.textContent = hours;
    countdownM.textContent = minutes;
    countdownS.textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
