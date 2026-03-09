import React, { useState } from 'react';
import { DollarSign, Lock, Unlock, TrendingDown, FileText } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CaixaPro({ 
  isOpen, 
  balance, 
  onOpen, 
  onClose, 
  onBleed, 
  history = [] 
}) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [view, setView] = useState('main'); // 'main', 'open', 'close', 'bleed'

  const handleOpen = () => {
    onOpen(parseFloat(amount));
    setAmount('');
    setView('main');
  };

  const handleBleed = () => {
    onBleed(parseFloat(amount), reason);
    setAmount('');
    setReason('');
    setView('main');
  };

  const handleClose = () => {
    onClose();
    setView('main');
  };

  const glassStyle = {
    background: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    color: '#fff'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    marginBottom: '16px'
  };

  const buttonStyle = (variant = 'primary') => ({
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    background: variant === 'primary' ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' :
                variant === 'danger' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' :
                'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    marginBottom: '8px'
  });

  if (!isOpen) {
    return (
      <div style={glassStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Lock size={48} color="#94A3B8" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Caixa Fechado</h2>
          <p style={{ color: '#94A3B8' }}>Inicie o turno abrindo o caixa</p>
        </div>
        
        {view === 'open' ? (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Fundo de Troco (R$)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              style={inputStyle}
            />
            <button onClick={handleOpen} style={buttonStyle('primary')}>Confirmar Abertura</button>
            <button onClick={() => setView('main')} style={buttonStyle('secondary')}>Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setView('open')} style={buttonStyle('primary')}>
            Abrir Caixa
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Left Column: Actions & Status */}
      <div style={glassStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#94A3B8' }}>Saldo em Caixa</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10B981' }}>
              R$ {balance.toFixed(2)}
            </div>
          </div>
          <Unlock size={32} color="#10B981" />
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          <button onClick={() => setView('bleed')} style={buttonStyle('secondary')}>
            <TrendingDown size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Sangria / Retirada
          </button>
          <button onClick={() => setView('close')} style={buttonStyle('danger')}>
            <Lock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Fechar Caixa
          </button>
        </div>

        {view === 'bleed' && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Nova Sangria</h3>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              placeholder="Valor (R$)"
              style={inputStyle}
            />
            <input 
              type="text" 
              value={reason} 
              onChange={e => setReason(e.target.value)}
              placeholder="Motivo (ex: Pagamento Fornecedor)"
              style={inputStyle}
            />
            <button onClick={handleBleed} style={buttonStyle('danger')}>Confirmar Retirada</button>
            <button onClick={() => setView('main')} style={buttonStyle('secondary')}>Cancelar</button>
          </div>
        )}

        {view === 'close' && (
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '12px', fontWeight: 'bold' }}>Fechar Caixa?</h3>
            <p style={{ marginBottom: '16px', color: '#94A3B8' }}>Isso irá gerar o relatório final e encerrar o turno atual.</p>
            <button onClick={handleClose} style={buttonStyle('danger')}>Confirmar Fechamento</button>
            <button onClick={() => setView('main')} style={buttonStyle('secondary')}>Cancelar</button>
          </div>
        )}
      </div>

      {/* Right Column: History & Charts */}
      <div style={glassStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontWeight: 'bold' }}>Movimentações Recentes</h3>
          <FileText size={20} color="#94A3B8" />
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {history.length === 0 ? (
            <p style={{ color: '#64748B', textAlign: 'center', padding: '20px' }}>Nenhuma movimentação</p>
          ) : (
            history.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{item.description || 'Entrada'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{new Date(item.date).toLocaleTimeString()}</div>
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: item.type === 'in' ? '#10B981' : '#EF4444' 
                }}>
                  {item.type === 'in' ? '+' : '-'} R$ {Math.abs(item.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
