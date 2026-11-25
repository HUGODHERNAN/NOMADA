/**
 * Datos centralizados de rutas de montaña y salidas programadas de Nómada.
 * Se expone en window.NOMADA_DATA para compatibilidad directa tanto en servidor HTTP como en file://.
 */
(function () {
  'use strict';

  const WA_PHONE = '51929970235';

  const TOURS = [
    {
      id: 'pichu-pichu',
      name: 'Volcán Pichu Pichu',
      subtitle: 'Cumbre Monte Blanco',
      altitude: '5,515 msnm',
      duration: 'Full-Day',
      level: 'principiantes',
      levelLabel: 'Principiantes',
      price: 'S/ 110',
      priceNote: 'Todo incluido',
      tagline: 'Tu primera cumbre',
      summary:
        'Ruta ideal para iniciar en la alta montaña arequipeña. Ascenso progresivo con vistas a la Laguna de Salinas y al Misti.',
      svgPath: 'M10 95 L78 46 L128 64 L182 26 L236 62 L290 95 Z',
      snowPath: 'M182 26 L166 38 L176 41 L182 36 L190 41 L198 37 Z',
      itinerary: [
        { time: '04:00 AM', desc: 'Recojo en Plaza de Armas de Arequipa y salida hacia la reserva.' },
        { time: '06:30 AM', desc: 'Llegada a la base (4,800 msnm) y desayuno ligero energético.' },
        { time: '07:00 AM', desc: 'Inicio de ascenso guiado con pausas de aclimatación.' },
        { time: '10:30 AM', desc: 'Cumbre Monte Blanco (5,515 msnm) y sesión de fotos.' },
        { time: '11:30 AM', desc: 'Descenso controlado hacia el transporte privado.' },
        { time: '03:30 PM', desc: 'Retorno aproximado al centro de Arequipa.' }
      ],
      includes: [
        'Transporte privado ida y vuelta',
        'Guía profesional de montaña',
        'Bastones de trekking',
        'Desayuno ligero y mate de coca',
        'Botiquín y balón de oxígeno',
        'Fotografía de cumbre'
      ],
      bring: [
        'Botas o zapatillas de trekking con cocada',
        'Casaca cortaviento y polar',
        'Guantes térmicos y gorro',
        '2 litros de agua y snacks',
        'Bloqueador solar y lentes UV'
      ]
    },
    {
      id: 'misti',
      name: 'Volcán Misti',
      subtitle: 'Expedición Clásica con Campamento',
      altitude: '5,822 msnm',
      duration: '2D/1N',
      level: 'moderado',
      levelLabel: 'Moderado',
      price: 'S/ 240',
      priceNote: 'Campamento incluido',
      tagline: 'El ícono de Arequipa',
      summary:
        'Conquista el volcán guardián de la Ciudad Blanca. Noche en Campo Base Nido de Águilas y amanecer en la Cruz del Misti.',
      image: 'assets/img/misti.webp',
      imageAlt: 'Volcán Misti nevado bajo cielo celeste en Arequipa - Nómada Tours',
      svgPath: 'M15 95 L150 20 L285 95 Z',
      snowPath: 'M150 20 L127 33 L141 37 L150 31 L161 38 L173 33 Z',
      itinerary: [
        { time: 'Día 1 · 07:30 AM', desc: 'Salida en 4x4 desde Arequipa hasta los 3,400 msnm.' },
        { time: 'Día 1 · 10:00 AM', desc: 'Inicio de trekking al Campo Base Nido de Águilas (4,650 msnm).' },
        { time: 'Día 1 · 05:00 PM', desc: 'Cena caliente, charla técnica y descanso en carpas 4 estaciones.' },
        { time: 'Día 2 · 02:00 AM', desc: 'Desayuno caliente y ataque a cumbre con linternas frontales.' },
        { time: 'Día 2 · 08:00 AM', desc: 'Cumbre Cruz del Misti (5,822 msnm) y vista del cráter.' },
        { time: 'Día 2 · 04:00 PM', desc: 'Descenso por arenal y retorno a la ciudad de Arequipa.' }
      ],
      includes: [
        'Transporte 4x4 ida y vuelta',
        'Guías certificados de alta montaña',
        'Carpa 4 estaciones y colchoneta aislante',
        'Cena caliente y desayuno de cumbre',
        'Bastones de trekking',
        'Botiquín y oxígeno medicinal'
      ],
      bring: [
        'Bolsa de dormir (-10°C aprox.)',
        'Ropa térmica en 3 capas',
        'Linterna frontal con pilas extra',
        '4 litros de agua en total',
        'Mochila de 45 a 60 litros'
      ]
    },
    {
      id: 'misti-express',
      name: 'Volcán Misti Express',
      subtitle: 'Ascenso Directo en 1 Día',
      altitude: '5,822 msnm',
      duration: 'Full-Day 1D',
      level: 'avanzado',
      levelLabel: 'Avanzado',
      price: 'S/ 190',
      priceNote: 'Ataque nocturno',
      tagline: 'Cumbre en 1 jornada',
      summary:
        'Para deportistas aclimatados con poco tiempo. Salida de madrugada en 4x4 y ataque directo a la cima en una sola jornada.',
      svgPath: 'M15 95 L150 20 L285 95 Z',
      snowPath: 'M150 20 L127 33 L141 37 L150 31 L161 38 L173 33 Z',
      itinerary: [
        { time: '12:30 AM', desc: 'Recojo en el centro de Arequipa y traslado en 4x4 hasta 3,800 msnm.' },
        { time: '02:30 AM', desc: 'Inicio de ascenso nocturno continuo con linternas frontales.' },
        { time: '08:30 AM', desc: 'Cumbre Cruz del Misti (5,822 msnm) y vista panorámica del cráter.' },
        { time: '09:30 AM', desc: 'Descenso rápido por el arenal hacia el vehículo 4x4.' },
        { time: '02:30 PM', desc: 'Retorno aproximado a la Plaza de Armas de Arequipa.' }
      ],
      includes: [
        'Transporte 4x4 ida y vuelta',
        'Guía especialista en ascenso rápido',
        'Bastones de trekking',
        'Snack energético y mate caliente',
        'Botiquín y oxígeno medicinal'
      ],
      bring: [
        'Buena aclimatación y resistencia física',
        'Linterna frontal con baterías nuevas',
        'Casaca cortaviento y ropa térmica',
        '3 litros de agua e hidratantes',
        'Botas de trekking con buen agarre'
      ]
    },
    {
      id: 'chachani',
      name: 'Volcán Chachani',
      subtitle: 'Expedición Seis Mil',
      altitude: '6,057 msnm',
      duration: '2D/1N',
      level: 'avanzado',
      levelLabel: 'Avanzado / 6000m',
      price: 'S/ 260',
      priceNote: 'Equipo técnico incluido',
      tagline: 'Tu primer 6,000 metros',
      summary:
        'Uno de los seis mil más emblemáticos de los Andes. Expedición de altura por encima de las nubes con soporte total.',
      svgPath: 'M5 95 L68 50 L118 62 L162 22 L208 42 L250 32 L295 95 Z',
      snowPath: 'M162 22 L145 35 L157 38 L162 32 L172 37 L180 31 Z',
      itinerary: [
        { time: 'Día 1 · 08:00 AM', desc: 'Salida en 4x4 por Pampa Cañahuas hasta los 5,000 msnm.' },
        { time: 'Día 1 · 11:30 AM', desc: 'Caminata corta al Campo Base (5,200 msnm), cena y aclimatación.' },
        { time: 'Día 2 · 02:00 AM', desc: 'Ascenso técnico con bastones y crampones (según condiciones).' },
        { time: 'Día 2 · 08:30 AM', desc: 'Cumbre del Volcán Chachani (6,057 msnm) y fotos.' },
        { time: 'Día 2 · 04:30 PM', desc: 'Descenso al vehículo 4x4 y llegada a Arequipa.' }
      ],
      includes: [
        'Transporte 4x4 hasta los 5,000 msnm',
        'Guías especialistas en alta montaña',
        'Carpa de altura, colchoneta y crampones',
        'Cena, desayuno y bebidas calientes',
        'Botiquín de altura y oxígeno medicinal'
      ],
      bring: [
        'Botas rígidas o semi-rígidas de montaña',
        'Casaca de pluma y cortaviento',
        'Bolsa de dormir (-15°C)',
        'Guantes térmicos y lentes UV',
        'Linterna frontal y 4L de agua'
      ]
    },
    {
      id: 'mismi',
      name: 'Nevado Mismi',
      subtitle: 'Valle del Colca / Tuti',
      altitude: '5,597 msnm',
      duration: 'Full-Day',
      level: 'moderado',
      levelLabel: 'Moderado',
      price: 'S/ 160',
      priceNote: 'Salida especial',
      tagline: 'El origen del Amazonas',
      summary:
        'Asciende a la montaña donde nace el río más caudaloso del planeta. Paisajes glaciares y vistas del Colca.',
      svgPath: 'M8 95 L92 48 L145 58 L195 24 L245 55 L292 95 Z',
      snowPath: 'M195 24 L177 37 L189 40 L195 34 L204 40 L213 36 Z',
      itinerary: [
        { time: '11:00 PM (Noche ant.)', desc: 'Salida desde Arequipa rumbo al Valle del Colca / Tuti.' },
        { time: '05:00 AM', desc: 'Desayuno energético e inicio de trekking hacia el nevado.' },
        { time: '09:30 AM', desc: 'Cumbre del Nevado Mismi (5,597 msnm) y mirador del origen del Amazonas.' },
        { time: '01:00 PM', desc: 'Descenso y almuerzo reparador en ruta.' },
        { time: '06:30 PM', desc: 'Retorno aproximado a la ciudad de Arequipa.' }
      ],
      includes: [
        'Transporte privado ida y vuelta',
        'Guía de montaña y asistencia en ruta',
        'Bastones de trekking',
        'Desayuno y almuerzo de ruta',
        'Botiquín y oxígeno medicinal'
      ],
      bring: [
        'Botas o zapatillas impermeables',
        'Ropa abrigadora en 3 capas',
        'Linterna frontal para el amanecer',
        '2.5 litros de agua y frutos secos',
        'Bloqueador solar y lentes de sol'
      ]
    },
    {
      id: 'coropuna',
      name: 'Nevado Coropuna',
      subtitle: 'Laguna Pallarcocha',
      altitude: '6,425 msnm',
      duration: '2D/1N',
      level: 'avanzado',
      levelLabel: 'Avanzado / 6000m',
      price: 'S/ 350',
      priceNote: 'Expedición glaciar',
      tagline: 'El volcán más alto del Perú',
      summary:
        'Expedición glaciar encordada a la cima volcánica más alta del país. Ideal para montañistas con experiencia.',
      svgPath: 'M5 95 L58 55 L112 36 L152 44 L196 18 L244 46 L295 95 Z',
      snowPath: 'M196 18 L175 31 L188 35 L196 29 L207 35 L218 31 Z',
      itinerary: [
        { time: 'Día 1 · 06:00 AM', desc: 'Salida en 4x4 desde Arequipa hacia Laguna Pallarcocha.' },
        { time: 'Día 1 · 01:00 PM', desc: 'Instalación de Campo Base (5,200 msnm) y chequeo de equipo técnico.' },
        { time: 'Día 2 · 01:00 AM', desc: 'Inicio de ascenso glaciar encordado con crampones y piolet.' },
        { time: 'Día 2 · 08:30 AM', desc: 'Cumbre del Nevado Coropuna (6,425 msnm).' },
        { time: 'Día 2 · 07:30 PM', desc: 'Descenso completo y retorno a la ciudad de Arequipa.' }
      ],
      includes: [
        'Transporte 4x4 especializado',
        'Guías certificados de alta montaña',
        'Equipo técnico: crampones, piolet, arnés, casco y cuerdas',
        'Carpas de expedición y alimentación completa',
        'Botiquín de altura y oxígeno medicinal'
      ],
      bring: [
        'Botas técnicas de alta montaña',
        'Bolsa de dormir (-15°C o superior)',
        'Vestimenta térmica extrema (pluma + Gore-Tex)',
        'Lentes categoría 4 y guantes térmicos',
        'Linterna frontal y snacks de ataque'
      ]
    }
  ];

  const DEPARTURES = [
    {
      id: 'dep-01',
      date: '2026-11-28',
      endDateLabel: '28 – 29 Nov',
      tourId: 'misti',
      route: 'Volcán Misti',
      altitude: '5,822 msnm',
      modality: '2D/1N',
      time: '07:30 AM',
      level: 'moderado',
      levelLabel: 'Moderado',
      price: 'S/ 240',
      status: 'Cupos limitados',
      statusType: 'urgent'
    },
    {
      id: 'dep-02',
      date: '2026-11-29',
      endDateLabel: '29 Nov',
      tourId: 'pichu-pichu',
      route: 'Volcán Pichu Pichu',
      altitude: '5,515 msnm',
      modality: 'Full-Day',
      time: '04:00 AM',
      level: 'principiantes',
      levelLabel: 'Principiantes',
      price: 'S/ 110',
      status: 'Últimos 3 cupos',
      statusType: 'urgent'
    },
    {
      id: 'dep-03',
      date: '2026-11-29',
      endDateLabel: '29 Nov',
      tourId: 'mismi',
      route: 'Nevado Mismi',
      altitude: '5,597 msnm',
      modality: 'Full-Day',
      time: 'Sáb 11:00 PM (cumbre Dom)',
      level: 'moderado',
      levelLabel: 'Moderado',
      price: 'S/ 160',
      status: 'Cupos limitados',
      statusType: 'warning'
    },
    {
      id: 'dep-04',
      date: '2026-12-05',
      endDateLabel: '05 – 06 Dic',
      tourId: 'chachani',
      route: 'Volcán Chachani',
      altitude: '6,057 msnm',
      modality: '2D/1N',
      time: '08:00 AM',
      level: 'avanzado',
      levelLabel: 'Avanzado / 6000m',
      price: 'S/ 260',
      status: 'Últimos 4 cupos',
      statusType: 'urgent'
    },
    {
      id: 'dep-05',
      date: '2026-12-06',
      endDateLabel: '06 Dic',
      tourId: 'misti-express',
      route: 'Volcán Misti Express',
      altitude: '5,822 msnm',
      modality: 'Full-Day 1D',
      time: '12:30 AM',
      level: 'avanzado',
      levelLabel: 'Avanzado',
      price: 'S/ 190',
      status: 'Disponible',
      statusType: 'ok'
    },
    {
      id: 'dep-06',
      date: '2026-12-08',
      endDateLabel: '08 Dic · Feriado',
      tourId: 'pichu-pichu',
      route: 'Volcán Pichu Pichu',
      altitude: '5,515 msnm',
      modality: 'Full-Day',
      time: '04:00 AM',
      level: 'principiantes',
      levelLabel: 'Principiantes',
      price: 'S/ 110',
      status: 'Cupos limitados',
      statusType: 'warning'
    },
    {
      id: 'dep-07',
      date: '2026-12-12',
      endDateLabel: '12 – 13 Dic',
      tourId: 'misti',
      route: 'Volcán Misti',
      altitude: '5,822 msnm',
      modality: '2D/1N',
      time: '07:30 AM',
      level: 'moderado',
      levelLabel: 'Moderado',
      price: 'S/ 240',
      status: 'Disponible',
      statusType: 'ok'
    },
    {
      id: 'dep-08',
      date: '2026-12-13',
      endDateLabel: '13 Dic',
      tourId: 'mismi',
      route: 'Nevado Mismi',
      altitude: '5,597 msnm',
      modality: 'Full-Day',
      time: 'Sáb 11:00 PM (cumbre Dom)',
      level: 'moderado',
      levelLabel: 'Moderado',
      price: 'S/ 160',
      status: 'Disponible',
      statusType: 'ok'
    },
    {
      id: 'dep-09',
      date: '2026-12-19',
      endDateLabel: '19 – 20 Dic',
      tourId: 'coropuna',
      route: 'Nevado Coropuna',
      altitude: '6,425 msnm',
      modality: '2D/1N',
      time: '06:00 AM',
      level: 'avanzado',
      levelLabel: 'Avanzado / 6000m',
      price: 'S/ 350',
      status: 'Últimos 2 cupos',
      statusType: 'urgent'
    },
    {
      id: 'dep-10',
      date: '2026-12-20',
      endDateLabel: '20 Dic',
      tourId: 'pichu-pichu',
      route: 'Volcán Pichu Pichu',
      altitude: '5,515 msnm',
      modality: 'Full-Day',
      time: '04:00 AM',
      level: 'principiantes',
      levelLabel: 'Principiantes',
      price: 'S/ 110',
      status: 'Disponible',
      statusType: 'ok'
    },
    {
      id: 'dep-11',
      date: '2026-12-26',
      endDateLabel: '26 – 27 Dic',
      tourId: 'misti',
      route: 'Volcán Misti',
      altitude: '5,822 msnm',
      modality: '2D/1N',
      time: '07:30 AM',
      level: 'moderado',
      levelLabel: 'Moderado',
      price: 'S/ 240',
      status: 'Disponible',
      statusType: 'ok'
    },
    {
      id: 'dep-12',
      date: '2026-12-27',
      endDateLabel: '27 Dic',
      tourId: 'pichu-pichu',
      route: 'Volcán Pichu Pichu',
      altitude: '5,515 msnm',
      modality: 'Full-Day',
      time: '04:00 AM',
      level: 'principiantes',
      levelLabel: 'Principiantes',
      price: 'S/ 110',
      status: 'Disponible',
      statusType: 'ok'
    }
  ];

  window.NOMADA_DATA = {
    WA_PHONE,
    TOURS,
    DEPARTURES
  };
})();
