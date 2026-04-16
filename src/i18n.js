let currentLang = localStorage.getItem('lang') || 'pt';

const dict = {
  pt: {
    dashboard: 'Painel',
    faturamento: 'Faturamento',
    sangria: 'Sangria',
    ocupacao: 'Ocupação'
  },
  en: {
    dashboard: 'Dashboard',
    faturamento: 'Revenue',
    sangria: 'Withdrawal',
    ocupacao: 'Occupancy'
  }
};

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
}

export function getLang() {
  return currentLang;
}

export function t(key) {
  return dict[currentLang]?.[key] || key;
}
