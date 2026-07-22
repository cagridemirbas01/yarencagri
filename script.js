(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");
  const countdown = document.getElementById("countdown");

  /* Menü: mobil aç/kapa */
  if (nav && toggle && menu) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }

  /* Menü: kaydırınca daha koyu arka plan */
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Geri sayım — tarih: data-target="2026-08-08T19:00:00" */
  if (!countdown) return;

  const targetAttr = countdown.getAttribute("data-target");
  const target = targetAttr ? new Date(targetAttr).getTime() : NaN;
  if (Number.isNaN(target)) return;

  const daysEl = countdown.querySelector('[data-unit="days"]');
  const hoursEl = countdown.querySelector('[data-unit="hours"]');
  const minutesEl = countdown.querySelector('[data-unit="minutes"]');
  const secondsEl = countdown.querySelector('[data-unit="seconds"]');

  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const diff = target - Date.now();

    if (diff <= 0) {
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      countdown.classList.add("is-done");
      return false;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
    return true;
  };

  if (tick()) {
    setInterval(tick, 1000);
  }
})();
