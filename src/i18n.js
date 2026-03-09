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

export function t(key) {
  return dict[currentLang]?.[key] || key;
}

export function LanguageSwitcher() {
  const lang = currentLang;
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => setLang('pt')}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: `1px solid rgba(255,255,255,0.2)`,
          background: lang === 'pt' ? 'rgba(255,255,255,0.15)' : 'transparent',
          color: 'white'
        }}
      >
        PT
      </button>
      <button
        onClick={() => setLang('en')}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: `1px solid rgba(255,255,255,0.2)`,
          background: lang === 'en' ? 'rgba(255,255,255,0.15)' : 'transparent',
          color: 'white'
        }}
      >
        EN
      </button>
    </div>
  );
}
