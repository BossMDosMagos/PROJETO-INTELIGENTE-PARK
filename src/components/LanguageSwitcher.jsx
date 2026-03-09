import React, { useState, useEffect } from 'react';
import { setLang, getLang } from '../i18n';

export default function LanguageSwitcher() {
  const [lang, setLocal] = useState(getLang());
  useEffect(() => {
    const id = setInterval(() => setLocal(getLang()), 300);
    return () => clearInterval(id);
  }, []);
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
