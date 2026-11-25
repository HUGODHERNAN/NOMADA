/**
 * Lógica principal de Nómada | Tours en Arequipa:
 * - Catálogo filtrable con estado accesible (aria-pressed)
 * - Programación en 3 vistas (Agenda / Semanal / Mensual) con límites de navegación claros
 * - Modal de itinerario con focus trap, restauración de foco y soporte de teclado
 * - Acordeón FAQ accesible (aria-expanded) y menú móvil
 */
(function () {
  'use strict';

  const data = window.NOMADA_DATA;
  if (!data) return;

  const { WA_PHONE, TOURS, DEPARTURES } = data;

  const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const DAYS_MON_INITIAL = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const DAYS_MON_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const LEVEL_BADGE_MAP = {
    principiantes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    moderado: 'bg-cobalt-light text-cobalt border-cobalt/20',
    avanzado: 'bg-summit-light text-summit border-summit/25'
  };

  const LEVEL_DOT_MAP = {
    principiantes: 'bg-emerald-500',
    moderado: 'bg-cobalt',
    avanzado: 'bg-summit'
  };

  const STATUS_BADGE_MAP = {
    urgent: 'bg-summit-light text-summit border-summit/30',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    ok: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  function parseISO(isoStr) {
    const [y, m, d] = isoStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function formatISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getMondayOfWeek(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  }

  function addDays(date, n) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + n);
    return d;
  }

  function getLevelBadgeClass(level) {
    return LEVEL_BADGE_MAP[level] || LEVEL_BADGE_MAP.avanzado;
  }

  function getLevelDotClass(level) {
    return LEVEL_DOT_MAP[level] || LEVEL_DOT_MAP.avanzado;
  }

  function getStatusBadgeClass(statusType) {
    return STATUS_BADGE_MAP[statusType] || STATUS_BADGE_MAP.ok;
  }

  function buildWhatsAppUrl(dep) {
    const msg = `Hola Nómada, quiero reservar mi cupo para ${dep.route} (${dep.modality}) el ${dep.endDateLabel} 2026 (${dep.price}).`;
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  function activateFallbackImage(img) {
    if (!img || img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = 'true';
    img.classList.add('hidden');
    if (img.nextElementSibling) {
      img.nextElementSibling.classList.remove('hidden');
    }
  }

  function bindImageFallbacks(root) {
    root.querySelectorAll('img[data-fallback-svg]').forEach(img => {
      if (img.complete && img.naturalWidth === 0) {
        activateFallbackImage(img);
      } else {
        img.addEventListener('error', () => activateFallbackImage(img), { once: true });
      }
    });
  }

  // -----------------------------------------------------------------
  // 1. RENDERIZADO DEL CATÁLOGO DE RUTAS
  // -----------------------------------------------------------------
  const routesGrid = document.getElementById('routes-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  function renderTours(filter = 'todos') {
    const filtered = filter === 'todos' ? TOURS : TOURS.filter(t => t.level === filter);
    routesGrid.innerHTML = '';

    filtered.forEach(tour => {
      const waText = encodeURIComponent(`Hola Nómada, quiero información y reservar el tour al ${tour.name} (${tour.price}).`);
      const waUrl = `https://wa.me/${WA_PHONE}?text=${waText}`;

      const mediaHeader = tour.image
        ? `
          <div class="relative h-44 bg-[#38BDF8] border-b border-slate-200 overflow-hidden">
            <img
              src="${tour.image}"
              alt="${tour.imageAlt}"
              loading="lazy"
              data-fallback-svg
              class="w-full h-full object-cover object-center block"
            >
            <svg viewBox="0 0 400 220" class="hidden w-full h-full block" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="400" height="220" fill="#38BDF8"/>
              <path d="M-10 220 L105 125 L200 48 L225 60 L240 55 L310 125 L410 220 Z" fill="#476685"/>
              <path d="M200 48 L225 60 L240 55 L280 96 L252 104 L235 92 L218 110 L198 96 L176 112 L152 96 L128 106 Z" fill="#FFFFFF"/>
            </svg>
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span class="px-2.5 py-1 rounded-md text-xs font-bold border bg-white ${getLevelBadgeClass(tour.level)}">
                ${tour.levelLabel}
              </span>
              <span class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-white border border-slate-200 text-night">
                ${tour.altitude}
              </span>
            </div>
          </div>
        `
        : `
          <div class="h-44 bg-[#F8FAFC] border-b border-slate-200 p-4 flex flex-col justify-between">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-1 rounded-md text-xs font-bold border ${getLevelBadgeClass(tour.level)}">
                ${tour.levelLabel}
              </span>
              <span class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-white border border-slate-200 text-night">
                ${tour.altitude}
              </span>
            </div>
            <svg viewBox="0 0 300 100" class="w-full h-24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="0" y1="25" x2="300" y2="25" stroke="#CBD5E1" stroke-dasharray="3 3"/>
              <path d="${tour.svgPath}" fill="#1220A6"/>
              <path d="${tour.snowPath}" fill="#FFFFFF"/>
            </svg>
          </div>
        `;

      const card = document.createElement('article');
      card.className = 'rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors';
      card.innerHTML = `
        <div>
          ${mediaHeader}
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
              <span>${tour.duration}</span>
              <span class="text-cobalt font-semibold">"${tour.tagline}"</span>
            </div>
            <h3 class="font-extrabold text-xl text-night">${tour.name}</h3>
            <p class="text-xs font-medium text-slate-500 mt-0.5">${tour.subtitle}</p>
            <p class="text-sm text-slate-600 mt-2.5 leading-relaxed">${tour.summary}</p>
          </div>
        </div>

        <div class="px-4 sm:px-5 pb-4 sm:pb-5 pt-3.5 border-t border-slate-100">
          <div class="flex items-baseline justify-between mb-3.5">
            <div>
              <span class="font-extrabold text-2xl text-night">${tour.price}</span>
              <span class="text-xs text-slate-500 ml-1">/ persona</span>
            </div>
            <span class="text-xs font-medium text-slate-500">${tour.priceNote}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" data-open-tour="${tour.id}"
              class="min-h-[44px] py-2.5 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-night text-sm font-semibold transition-colors">
              Itinerario
            </button>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer"
              class="min-h-[44px] py-2.5 px-3 rounded-lg bg-summit hover:bg-summit-hover text-white text-sm font-semibold inline-flex items-center justify-center transition-colors">
              Reservar
            </a>
          </div>
        </div>
      `;
      routesGrid.appendChild(card);
    });

    bindImageFallbacks(routesGrid);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        b.className = 'filter-btn min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors bg-white text-slate-700 border-slate-200 hover:border-slate-300';
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.className = 'filter-btn min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors bg-cobalt text-white border-cobalt';
      renderTours(btn.dataset.filter);
    });
  });

  // -----------------------------------------------------------------
  // 2. PROGRAMACIÓN MENSUAL: VISTAS AGENDA / SEMANAL / MENSUAL
  // -----------------------------------------------------------------
  const sortedDepartures = [...DEPARTURES].sort((a, b) => a.date.localeCompare(b.date));

  // Meses disponibles derivados de los datos (evita navegación cíclica o vacía)
  const AVAILABLE_MONTHS = [];
  const seenMonthKeys = new Set();
  sortedDepartures.forEach(dep => {
    const d = parseISO(dep.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!seenMonthKeys.has(key)) {
      seenMonthKeys.add(key);
      AVAILABLE_MONTHS.push({ year: d.getFullYear(), month: d.getMonth() });
    }
  });

  const MIN_WEEK_START = getMondayOfWeek(parseISO(sortedDepartures[0].date));
  const MAX_WEEK_START = getMondayOfWeek(parseISO(sortedDepartures[sortedDepartures.length - 1].date));

  const calState = {
    view: window.innerWidth < 768 ? 'agenda' : 'mensual',
    agendaMonth: 'all',
    weekStart: new Date(MIN_WEEK_START.getTime()),
    selectedWeekDay: null,
    monthCursor: 0,
    selectedMonthDay: sortedDepartures[0].date
  };

  const viewButtons = document.querySelectorAll('.cal-view-btn');
  const viewPanels = {
    agenda: document.getElementById('view-agenda'),
    semanal: document.getElementById('view-semanal'),
    mensual: document.getElementById('view-mensual')
  };

  function createDepartureCardHTML(dep) {
    const d = parseISO(dep.date);
    const dayName = DAYS_SHORT[d.getDay()];
    const dayNum = String(d.getDate()).padStart(2, '0');
    const monthShort = MONTHS_SHORT[d.getMonth()];

    return `
      <article class="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:border-slate-300 transition-colors">
        <div class="flex items-start gap-3 min-w-0">
          <div class="w-14 shrink-0 rounded-lg border border-slate-200 bg-[#F8FAFC] text-center py-1.5 px-1">
            <span class="block text-[10px] font-bold uppercase text-cobalt leading-none">${dayName}</span>
            <span class="block font-extrabold text-xl text-night leading-tight my-0.5">${dayNum}</span>
            <span class="block text-[10px] font-semibold uppercase text-slate-500 leading-none">${monthShort}</span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5 mb-1">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold border ${getLevelBadgeClass(dep.level)}">${dep.levelLabel}</span>
              <span class="px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadgeClass(dep.statusType)}">${dep.status}</span>
            </div>
            <h4 class="font-extrabold text-base text-night leading-snug">${dep.route} <span class="font-mono text-xs font-semibold text-slate-500">· ${dep.altitude}</span></h4>
            <p class="text-xs text-slate-500 mt-0.5">
              ${dep.modality} · Salida ${dep.time} · <span class="font-medium text-slate-700">${dep.endDateLabel}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          <div class="sm:text-right">
            <span class="block font-extrabold text-lg text-night leading-none">${dep.price}</span>
            <span class="text-[11px] text-slate-500">por persona</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" data-open-tour="${dep.tourId}"
              class="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-night text-xs font-semibold transition-colors">
              Itinerario
            </button>
            <a href="${buildWhatsAppUrl(dep)}" target="_blank" rel="noopener noreferrer"
              class="min-h-[44px] px-4 py-2 rounded-lg bg-summit hover:bg-summit-hover text-white text-xs font-semibold inline-flex items-center justify-center transition-colors">
              Reservar
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function setCalendarView(viewName) {
    calState.view = viewName;

    viewButtons.forEach(btn => {
      const isActive = btn.dataset.view === viewName;
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.className = isActive
        ? 'cal-view-btn min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors bg-cobalt text-white'
        : 'cal-view-btn min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-semibold transition-colors bg-white text-slate-600 hover:bg-slate-50';
    });

    Object.keys(viewPanels).forEach(key => {
      viewPanels[key].classList.toggle('hidden', key !== viewName);
    });

    if (viewName === 'agenda') renderAgendaView();
    if (viewName === 'semanal') renderWeeklyView();
    if (viewName === 'mensual') renderMonthlyView();
  }

  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => setCalendarView(btn.dataset.view));
  });

  // --- A) VISTA AGENDA ---
  const agendaListEl = document.getElementById('agenda-list');
  const agendaMonthBtns = document.querySelectorAll('.agenda-month-btn');

  function renderAgendaView() {
    const filtered = sortedDepartures.filter(dep => {
      if (calState.agendaMonth === 'all') return true;
      return parseISO(dep.date).getMonth() === Number(calState.agendaMonth);
    });

    if (!filtered.length) {
      agendaListEl.innerHTML = '<div class="bg-white rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">No hay salidas programadas para este filtro.</div>';
      return;
    }

    const groups = new Map();
    filtered.forEach(dep => {
      const mon = getMondayOfWeek(parseISO(dep.date));
      const sun = addDays(mon, 6);
      const key = formatISO(mon);
      if (!groups.has(key)) {
        const sameMonth = mon.getMonth() === sun.getMonth();
        const label = sameMonth
          ? `Semana del ${mon.getDate()} al ${sun.getDate()} de ${MONTHS_ES[mon.getMonth()]} ${mon.getFullYear()}`
          : `Semana del ${mon.getDate()} ${MONTHS_SHORT[mon.getMonth()]} al ${sun.getDate()} ${MONTHS_SHORT[sun.getMonth()]} ${sun.getFullYear()}`;
        groups.set(key, { label, items: [] });
      }
      groups.get(key).items.push(dep);
    });

    let html = '';
    groups.forEach(group => {
      html += `
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2 px-1">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">${group.label}</h3>
            <span class="text-xs font-semibold text-cobalt shrink-0">${group.items.length} ${group.items.length === 1 ? 'salida' : 'salidas'}</span>
          </div>
          <div class="space-y-2.5">
            ${group.items.map(createDepartureCardHTML).join('')}
          </div>
        </div>
      `;
    });
    agendaListEl.innerHTML = html;
  }

  agendaMonthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calState.agendaMonth = btn.dataset.agendaMonth;
      agendaMonthBtns.forEach(b => {
        b.setAttribute('aria-pressed', 'false');
        b.className = 'agenda-month-btn min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold border bg-white text-slate-700 border-slate-200 hover:border-slate-300 transition-colors';
      });
      btn.setAttribute('aria-pressed', 'true');
      btn.className = 'agenda-month-btn min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold border bg-cobalt text-white border-cobalt transition-colors';
      renderAgendaView();
    });
  });

  // --- B) VISTA SEMANAL ---
  const weekRangeLabel = document.getElementById('week-range-label');
  const weekCountLabel = document.getElementById('week-count-label');
  const weekMobileStrip = document.getElementById('week-mobile-strip');
  const weekMobileFilterBar = document.getElementById('week-mobile-filter-bar');
  const weekSelectedDayText = document.getElementById('week-selected-day-text');
  const weekClearDayBtn = document.getElementById('week-clear-day-btn');
  const weekMobileList = document.getElementById('week-mobile-list');
  const weekDesktopGrid = document.getElementById('week-desktop-grid');
  const weekPrevBtn = document.getElementById('week-prev-btn');
  const weekNextBtn = document.getElementById('week-next-btn');

  function renderWeeklyView() {
    const start = calState.weekStart;
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    const end = days[6];

    const isAtMinWeek = formatISO(start) <= formatISO(MIN_WEEK_START);
    const isAtMaxWeek = formatISO(start) >= formatISO(MAX_WEEK_START);
    weekPrevBtn.disabled = isAtMinWeek;
    weekNextBtn.disabled = isAtMaxWeek;

    const sameMonth = start.getMonth() === end.getMonth();
    weekRangeLabel.textContent = sameMonth
      ? `${start.getDate()} – ${end.getDate()} ${MONTHS_SHORT[start.getMonth()]} ${start.getFullYear()}`
      : `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;

    const weekIsoSet = new Set(days.map(formatISO));
    const weekDepartures = sortedDepartures.filter(dep => weekIsoSet.has(dep.date));
    weekCountLabel.textContent = `${weekDepartures.length} ${weekDepartures.length === 1 ? 'salida programada' : 'salidas programadas'} esta semana`;

    if (calState.selectedWeekDay && !weekIsoSet.has(calState.selectedWeekDay)) {
      calState.selectedWeekDay = null;
    }

    weekMobileStrip.innerHTML = days.map((d, idx) => {
      const iso = formatISO(d);
      const dayDeps = weekDepartures.filter(dep => dep.date === iso);
      const isSelected = calState.selectedWeekDay === iso;
      const hasDeps = dayDeps.length > 0;
      const dayLabel = `${DAYS_FULL[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}: ${
        hasDeps ? `${dayDeps.length} ${dayDeps.length === 1 ? 'salida' : 'salidas'}` : 'sin salidas'
      }`;

      const dotsHTML = dayDeps.slice(0, 3).map(dep =>
        `<span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : getLevelDotClass(dep.level)}"></span>`
      ).join('');

      return `
        <button type="button" data-week-day="${iso}"
          aria-label="${dayLabel}"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          class="min-h-[52px] flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg border transition-colors ${
            isSelected
              ? 'bg-cobalt text-white border-cobalt'
              : hasDeps
                ? 'bg-[#F8FAFC] text-night border-slate-200 hover:border-cobalt'
                : 'bg-white text-slate-400 border-transparent'
          }">
          <span class="text-[10px] font-bold uppercase">${DAYS_MON_INITIAL[idx]}</span>
          <span class="text-sm font-extrabold mt-0.5">${d.getDate()}</span>
          <span class="flex items-center justify-center gap-0.5 h-2 mt-1">${dotsHTML}</span>
        </button>
      `;
    }).join('');

    if (calState.selectedWeekDay) {
      const sd = parseISO(calState.selectedWeekDay);
      weekSelectedDayText.textContent = `Mostrando: ${DAYS_SHORT[sd.getDay()]} ${sd.getDate()} ${MONTHS_SHORT[sd.getMonth()]}`;
      weekMobileFilterBar.classList.remove('hidden');
    } else {
      weekMobileFilterBar.classList.add('hidden');
    }

    const mobileListItems = calState.selectedWeekDay
      ? weekDepartures.filter(dep => dep.date === calState.selectedWeekDay)
      : weekDepartures;

    if (mobileListItems.length) {
      weekMobileList.innerHTML = mobileListItems.map(createDepartureCardHTML).join('');
    } else {
      weekMobileList.innerHTML = `
        <div class="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <p class="text-sm font-semibold text-night">Sin salidas programadas para este ${calState.selectedWeekDay ? 'día' : 'rango'}.</p>
          <p class="text-xs text-slate-500 mt-1">Usa las flechas para revisar la siguiente semana o consúltanos por una salida privada.</p>
        </div>
      `;
    }

    weekDesktopGrid.innerHTML = days.map((d, idx) => {
      const iso = formatISO(d);
      const dayDeps = weekDepartures.filter(dep => dep.date === iso);
      const isWeekend = idx >= 5;

      const cardsHTML = dayDeps.length
        ? dayDeps.map(dep => `
            <div class="p-2.5 rounded-lg border border-slate-200 bg-[#F8FAFC] space-y-1.5">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full shrink-0 ${getLevelDotClass(dep.level)}"></span>
                <span class="text-[11px] font-bold text-night truncate">${dep.route}</span>
              </div>
              <p class="text-[11px] text-slate-500">${dep.modality} · ${dep.price}</p>
              <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(dep.statusType)}">${dep.status}</span>
              <div class="grid grid-cols-2 gap-1 pt-1">
                <button type="button" data-open-tour="${dep.tourId}" class="min-h-[34px] py-1 px-1.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-night hover:bg-slate-100">Info</button>
                <a href="${buildWhatsAppUrl(dep)}" target="_blank" rel="noopener noreferrer" class="min-h-[34px] py-1 px-1.5 rounded bg-summit hover:bg-summit-hover text-white text-[10px] font-semibold inline-flex items-center justify-center">Reservar</a>
              </div>
            </div>
          `).join('')
        : '<p class="text-[11px] text-slate-400 text-center py-6">Sin salidas</p>';

      return `
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col min-h-[210px]">
          <div class="px-2.5 py-2 border-b border-slate-200 text-center ${isWeekend ? 'bg-cobalt-light' : 'bg-slate-50'}">
            <span class="block text-[10px] font-bold uppercase ${isWeekend ? 'text-cobalt' : 'text-slate-500'}">${DAYS_MON_FULL[idx]}</span>
            <span class="block font-extrabold text-base text-night">${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}</span>
          </div>
          <div class="p-2 space-y-2 flex-1">
            ${cardsHTML}
          </div>
        </div>
      `;
    }).join('');
  }

  weekClearDayBtn.addEventListener('click', () => {
    calState.selectedWeekDay = null;
    renderWeeklyView();
  });

  weekPrevBtn.addEventListener('click', () => {
    const prev = addDays(calState.weekStart, -7);
    if (formatISO(prev) < formatISO(MIN_WEEK_START)) return;
    calState.weekStart = prev;
    calState.selectedWeekDay = null;
    renderWeeklyView();
  });

  weekNextBtn.addEventListener('click', () => {
    const next = addDays(calState.weekStart, 7);
    if (formatISO(next) > formatISO(MAX_WEEK_START)) return;
    calState.weekStart = next;
    calState.selectedWeekDay = null;
    renderWeeklyView();
  });

  // --- C) VISTA MENSUAL ---
  const monthTitleLabel = document.getElementById('month-title-label');
  const monthGridEl = document.getElementById('month-grid');
  const monthDayDetailEl = document.getElementById('month-day-detail');
  const monthPrevBtn = document.getElementById('month-prev-btn');
  const monthNextBtn = document.getElementById('month-next-btn');

  function renderMonthlyView() {
    const currentMonthObj = AVAILABLE_MONTHS[calState.monthCursor];
    const year = currentMonthObj.year;
    const month = currentMonthObj.month;

    monthTitleLabel.textContent = `${MONTHS_ES[month]} ${year}`;
    monthPrevBtn.disabled = calState.monthCursor <= 0;
    monthNextBtn.disabled = calState.monthCursor >= AVAILABLE_MONTHS.length - 1;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthDeps = sortedDepartures.filter(dep => dep.date.startsWith(monthPrefix));
    if (!calState.selectedMonthDay || !calState.selectedMonthDay.startsWith(monthPrefix)) {
      calState.selectedMonthDay = monthDeps.length ? monthDeps[0].date : null;
    }

    let cellsHTML = '';
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > daysInMonth) {
        cellsHTML += '<div class="bg-[#F8FAFC] min-h-[52px] sm:min-h-[84px]" aria-hidden="true"></div>';
        continue;
      }

      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dateObj = new Date(year, month, dayNum);
      const dayDeps = monthDeps.filter(dep => dep.date === iso);
      const hasDeps = dayDeps.length > 0;
      const isSelected = calState.selectedMonthDay === iso;

      const dayAriaLabel = `${DAYS_FULL[dateObj.getDay()]} ${dayNum} de ${MONTHS_ES[month]}: ${
        hasDeps ? `${dayDeps.length} ${dayDeps.length === 1 ? 'salida programada' : 'salidas programadas'}` : 'sin salidas grupales'
      }`;

      const mobileDots = dayDeps.slice(0, 3).map(dep =>
        `<span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : getLevelDotClass(dep.level)}"></span>`
      ).join('');

      const desktopPills = dayDeps.slice(0, 2).map(dep =>
        `<span class="hidden sm:flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded truncate ${
          isSelected ? 'bg-white/20 text-white' : 'bg-[#F8FAFC] text-night border border-slate-200'
        }">
          <span class="w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : getLevelDotClass(dep.level)}"></span>
          <span class="truncate">${dep.route.replace('Volcán ', '').replace('Nevado ', '')}</span>
        </span>`
      ).join('');

      cellsHTML += `
        <button type="button" data-month-day="${iso}"
          aria-label="${dayAriaLabel}"
          aria-pressed="${isSelected ? 'true' : 'false'}"
          class="min-h-[52px] sm:min-h-[84px] p-1 sm:p-2 text-left flex flex-col justify-between transition-colors ${
            isSelected
              ? 'bg-cobalt text-white'
              : hasDeps
                ? 'bg-white hover:bg-cobalt-light/50 text-night'
                : 'bg-white text-slate-400 hover:bg-slate-50'
          }">
          <div class="flex items-center justify-between w-full">
            <span class="text-xs sm:text-sm font-bold ${hasDeps && !isSelected ? 'text-night' : ''}">${dayNum}</span>
            ${hasDeps ? `<span class="hidden sm:inline text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-cobalt'}">${dayDeps.length}</span>` : ''}
          </div>
          <div class="w-full space-y-1">
            <div class="flex sm:hidden items-center justify-center gap-1 pt-1">${mobileDots}</div>
            ${desktopPills}
          </div>
        </button>
      `;
    }
    monthGridEl.innerHTML = cellsHTML;

    renderMonthDayDetail();
  }

  function renderMonthDayDetail() {
    if (!calState.selectedMonthDay) {
      monthDayDetailEl.innerHTML = '<p class="text-sm text-slate-500 text-center py-2">Selecciona un día con indicador en el calendario para ver las salidas disponibles.</p>';
      return;
    }

    const d = parseISO(calState.selectedMonthDay);
    const dayDeps = sortedDepartures.filter(dep => dep.date === calState.selectedMonthDay);
    const dateTitle = `${DAYS_SHORT[d.getDay()]} ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;

    if (!dayDeps.length) {
      monthDayDetailEl.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">${dateTitle}</p>
            <p class="text-sm font-semibold text-night mt-0.5">No hay salidas grupales fijas este día.</p>
            <p class="text-xs text-slate-500 mt-0.5">¿Deseas una salida privada en esta fecha? Escríbenos por WhatsApp.</p>
          </div>
          <a href="https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hola Nómada, quiero consultar por una salida privada para el ' + dateTitle + '.')}"
             target="_blank" rel="noopener noreferrer"
             class="min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-cobalt hover:bg-cobalt-dark text-white text-xs font-semibold shrink-0 transition-colors">
            Consultar fecha privada
          </a>
        </div>
      `;
      return;
    }

    monthDayDetailEl.innerHTML = `
      <div class="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-cobalt">Salidas seleccionadas</span>
          <h3 class="font-extrabold text-base sm:text-lg text-night">${dateTitle}</h3>
        </div>
        <span class="px-2.5 py-1 rounded-md bg-cobalt-light text-cobalt text-xs font-bold">
          ${dayDeps.length} ${dayDeps.length === 1 ? 'ruta' : 'rutas'}
        </span>
      </div>
      <div class="space-y-3">
        ${dayDeps.map(createDepartureCardHTML).join('')}
      </div>
    `;
  }

  monthPrevBtn.addEventListener('click', () => {
    if (calState.monthCursor <= 0) return;
    calState.monthCursor -= 1;
    calState.selectedMonthDay = null;
    renderMonthlyView();
  });

  monthNextBtn.addEventListener('click', () => {
    if (calState.monthCursor >= AVAILABLE_MONTHS.length - 1) return;
    calState.monthCursor += 1;
    calState.selectedMonthDay = null;
    renderMonthlyView();
  });

  // -----------------------------------------------------------------
  // 3. MODAL INTERACTIVO DE ITINERARIOS (FOCUS TRAP + RESTAURAR FOCO)
  // -----------------------------------------------------------------
  const modal = document.getElementById('itinerary-modal');
  const modalDialog = document.getElementById('modal-dialog');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const floatingWa = document.getElementById('floating-wa');
  const backgroundLandmarks = [
    document.querySelector('header.site-header'),
    document.querySelector('main'),
    document.querySelector('footer'),
    floatingWa
  ].filter(Boolean);

  let lastFocusedElement = null;

  function getModalFocusableElements() {
    return Array.from(
      modalDialog.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.offsetParent !== null);
  }

  function openTourModal(tourId) {
    const tour = TOURS.find(t => t.id === tourId);
    if (!tour) return;

    lastFocusedElement = document.activeElement;
    toggleMobileMenu(true);

    const levelBadge = document.getElementById('modal-level');
    levelBadge.textContent = tour.levelLabel;
    levelBadge.className = `px-2.5 py-0.5 rounded-md text-xs font-bold border ${getLevelBadgeClass(tour.level)}`;

    document.getElementById('modal-altitude').textContent = tour.altitude;
    document.getElementById('modal-duration').textContent = tour.duration;
    document.getElementById('modal-title').textContent = `${tour.name} — ${tour.subtitle}`;
    document.getElementById('modal-tagline').textContent = `"${tour.tagline}" · ${tour.summary}`;
    document.getElementById('modal-price').textContent = tour.price;
    document.getElementById('modal-price-note').textContent = `(${tour.priceNote})`;

    document.getElementById('modal-itinerary').innerHTML = tour.itinerary.map(step => `
      <li class="relative pl-5">
        <span class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cobalt border-2 border-white" aria-hidden="true"></span>
        <p class="text-xs font-bold uppercase tracking-wide text-cobalt">${step.time}</p>
        <p class="text-sm text-slate-700 mt-0.5 leading-relaxed">${step.desc}</p>
      </li>
    `).join('');

    document.getElementById('modal-includes').innerHTML = tour.includes.map(item => `
      <li class="flex items-start gap-2">
        <svg class="w-4 h-4 text-cobalt shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${item}</span>
      </li>
    `).join('');

    document.getElementById('modal-bring').innerHTML = tour.bring.map(item => `
      <li class="flex items-start gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-summit shrink-0 mt-2" aria-hidden="true"></span>
        <span>${item}</span>
      </li>
    `).join('');

    const waText = encodeURIComponent(`Hola Nómada, revisé el itinerario del ${tour.name} (${tour.price}) y quiero reservar mi cupo.`);
    document.getElementById('modal-wa-link').href = `https://wa.me/${WA_PHONE}?text=${waText}`;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (floatingWa) floatingWa.classList.add('hidden');
    backgroundLandmarks.forEach(el => el.setAttribute('aria-hidden', 'true'));

    modalCloseBtn.focus();
  }

  function closeTourModal() {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (floatingWa) floatingWa.classList.remove('hidden');
    backgroundLandmarks.forEach(el => el.removeAttribute('aria-hidden'));

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function' && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  modalCloseBtn.addEventListener('click', closeTourModal);
  modalBackdrop.addEventListener('click', closeTourModal);

  document.addEventListener('keydown', (e) => {
    const modalOpen = !modal.classList.contains('hidden');

    if (e.key === 'Escape') {
      if (modalOpen) {
        closeTourModal();
        return;
      }
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu(true);
        mobileMenuBtn.focus();
      }
      return;
    }

    if (e.key === 'Tab' && modalOpen) {
      const focusable = getModalFocusableElements();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Delegación de eventos para botones dinámicos (itinerarios, días semanal/mensual)
  document.addEventListener('click', (e) => {
    const tourBtn = e.target.closest('[data-open-tour]');
    if (tourBtn) {
      openTourModal(tourBtn.dataset.openTour);
      return;
    }

    const weekDayBtn = e.target.closest('[data-week-day]');
    if (weekDayBtn) {
      const iso = weekDayBtn.dataset.weekDay;
      calState.selectedWeekDay = calState.selectedWeekDay === iso ? null : iso;
      renderWeeklyView();
      return;
    }

    const monthDayBtn = e.target.closest('[data-month-day]');
    if (monthDayBtn) {
      calState.selectedMonthDay = monthDayBtn.dataset.monthDay;
      renderMonthlyView();
    }
  });

  // -----------------------------------------------------------------
  // 4. ACORDEÓN FAQ Y MENÚ MÓVIL ACCESIBLES
  // -----------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      faqItems.forEach(other => {
        other.setAttribute('data-open', 'false');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });
      const nextState = !isOpen;
      item.setAttribute('data-open', nextState ? 'true' : 'false');
      trigger.setAttribute('aria-expanded', nextState ? 'true' : 'false');
    });
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  function toggleMobileMenu(forceClose = false) {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (forceClose || !isHidden) {
      mobileMenu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
    } else {
      mobileMenu.classList.remove('hidden');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileMenuBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
    }
  }

  mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(false));
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // -----------------------------------------------------------------
  // INICIALIZACIÓN
  // -----------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  bindImageFallbacks(document);
  renderTours('todos');
  setCalendarView(window.innerWidth < 768 ? 'agenda' : 'mensual');
})();
