(function () {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");
  const countdown = document.getElementById("countdown");
  const weatherEl = document.getElementById("weather");

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

  /* Geri sayım */
  if (countdown) {
    const targetAttr = countdown.getAttribute("data-target");
    const target = targetAttr ? new Date(targetAttr).getTime() : NaN;

    if (!Number.isNaN(target)) {
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
    }
  }

  /* Hava durumu — Open-Meteo (ücretsiz, API anahtarı yok) */
  if (!weatherEl) return;

  const lat = weatherEl.getAttribute("data-lat") || "41.093";
  const lon = weatherEl.getAttribute("data-lon") || "28.802";
  const eventDate = weatherEl.getAttribute("data-date") || "2026-08-08";

  const weatherLabel = (code) => {
    if (code === 0) return "Açık";
    if (code === 1) return "Çoğunlukla açık";
    if (code === 2) return "Parçalı bulutlu";
    if (code === 3) return "Kapalı";
    if (code === 45 || code === 48) return "Sisli";
    if (code >= 51 && code <= 57) return "Çisenti";
    if (code >= 61 && code <= 67) return "Yağmurlu";
    if (code >= 71 && code <= 77) return "Karlı";
    if (code >= 80 && code <= 82) return "Sağanak";
    if (code >= 95) return "Gök gürültülü";
    return "Değişken";
  };

  const round = (n) => Math.round(Number(n));

  const renderFallback = (current) => {
    const tip =
      "Ağustos akşamları İstanbul’da genelde ılık geçer. İnce bir ceket yanınızda olsun.";

    if (current) {
      weatherEl.innerHTML = `
        <div class="weather__card">
          <p class="weather__eyebrow">Şu an bölgede</p>
          <p class="weather__temp">${round(current.temperature_2m)}°</p>
          <p class="weather__desc">${weatherLabel(current.weather_code)}</p>
        </div>
        <p class="weather__note">
          Nişan günü (8 Ağustos) tahmini, tarihe yaklaşık 1–2 hafta kala burada
          görünecek. ${tip}
        </p>
      `;
      return;
    }

    weatherEl.innerHTML = `
      <p class="weather__note weather__note--solo">${tip}</p>
    `;
  };

  const renderEventDay = (daily, current) => {
    const max = round(daily.temperature_2m_max[0]);
    const min = round(daily.temperature_2m_min[0]);
    const code = daily.weather_code[0];
    const rain = daily.precipitation_probability_max
      ? daily.precipitation_probability_max[0]
      : null;

    weatherEl.innerHTML = `
      <div class="weather__card">
        <p class="weather__eyebrow">8 Ağustos 2026 · Başakşehir</p>
        <p class="weather__temp">${min}° – ${max}°</p>
        <p class="weather__desc">${weatherLabel(code)}</p>
        ${
          rain != null
            ? `<p class="weather__meta">Yağış ihtimali %${rain}</p>`
            : ""
        }
      </div>
      ${
        current
          ? `<p class="weather__note">Şu an bölgede: ${round(
              current.temperature_2m
            )}° · ${weatherLabel(current.weather_code)}</p>`
          : ""
      }
    `;
  };

  const loadWeather = async () => {
    try {
      const currentUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weather_code&timezone=Europe%2FIstanbul`;

      const dailyUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
        `&timezone=Europe%2FIstanbul&start_date=${eventDate}&end_date=${eventDate}`;

      const [currentRes, dailyRes] = await Promise.all([
        fetch(currentUrl),
        fetch(dailyUrl),
      ]);

      const currentData = currentRes.ok ? await currentRes.json() : null;
      const dailyData = dailyRes.ok ? await dailyRes.json() : null;

      const current = currentData && currentData.current;
      const hasDaily =
        dailyData &&
        dailyData.daily &&
        dailyData.daily.time &&
        dailyData.daily.time.length > 0 &&
        dailyData.daily.temperature_2m_max &&
        dailyData.daily.temperature_2m_max[0] != null;

      if (hasDaily) {
        renderEventDay(dailyData.daily, current);
      } else {
        renderFallback(current);
      }
    } catch (err) {
      weatherEl.innerHTML = `
        <p class="weather__note weather__note--solo">
          Hava bilgisi şu an alınamadı. Ağustos akşamları İstanbul’da genelde
          ılık geçer; ince bir ceket yeterli olur.
        </p>
      `;
    }
  };

  loadWeather();
})();
