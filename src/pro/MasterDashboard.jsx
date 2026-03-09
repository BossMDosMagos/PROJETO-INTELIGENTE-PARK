import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LayoutDashboard, Car, TrendingUp, AlertCircle, Search } from 'lucide-react';

// Fixar ícones padrão do Leaflet
try {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  });
} catch {}

// Componente para controlar o mapa (FlyTo)
function MapController({ selectedUnit }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedUnit) {
      map.flyTo([selectedUnit.lat, selectedUnit.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedUnit, map]);

  return null;
}

// Componente para Ajuste de Zoom (FitBounds)
function FitBoundsController({ units }) {
  const map = useMap();
  useEffect(() => {
    if (units.length > 0) {
      // Filtrar unidades com coordenadas válidas (diferentes do placeholder se possível, ou todas)
      const validUnits = units.filter(u => u.lat && u.lng);
      if (validUnits.length > 0) {
        const bounds = L.latLngBounds(validUnits.map(u => [u.lat, u.lng]));
        map.fitBounds(bounds, { padding: [100, 100], maxZoom: 16 });
      }
    }
  }, [units, map]);
  return null;
}

export default function MasterDashboard({ unidades = [], ocupacao = {}, bi = {} }) {
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mappedUnidades, setMappedUnidades] = useState(unidades);

  // Geocodificação Automática
  useEffect(() => {
    const processUnits = async () => {
      const processed = await Promise.all(unidades.map(async (u) => {
        // Verifica se é placeholder ou sem coordenada
        const isPlaceholder = u.lat === -23.55 && u.lng === -46.63;
        
        // Se já tem lat/lng válidos salvos no banco, usa eles
        if (!isPlaceholder && u.lat && u.lng) {
          return u;
        }

        // Se tem latitude/longitude explícitas vindas do banco (campos novos), usa elas
        if (u.latitude && u.longitude) {
          return {
            ...u,
            lat: parseFloat(u.latitude),
            lng: parseFloat(u.longitude)
          };
        }

        // Tenta geocodificar se tiver endereço
        let query = '';
        if (u.cep && u.cep.length === 8) {
          query = u.cep;
        } else if (u.endereco && u.cidade) {
          query = `${u.endereco}, ${u.numero || ''}, ${u.cidade}, ${u.estado}`;
        } else {
          return u; // Sem dados suficientes
        }

        try {
          // Delay aleatório para evitar rate limit do Nominatim (se muitos itens)
          await new Promise(r => setTimeout(r, Math.random() * 1000));
          
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
          const data = await res.json();
          if (data && data.length > 0) {
            return {
              ...u,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            };
          }
        } catch (err) {
          console.error('Erro de geocodificação para', u.nome, err);
        }
        return u;
      }));
      setMappedUnidades(processed);
    };

    if (unidades.length > 0) {
      processUnits();
    }
  }, [unidades]);

  const selectedUnit = mappedUnidades.find(u => u.id === selectedId);
  
  const filteredUnidades = mappedUnidades.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressColor = (pct) => {
    if (pct < 50) return 'bg-emerald-500';
    if (pct < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      zIndex: 50 // Abaixo do ProLayout header se necessário, mas aqui queremos FullScreen
    }}>
      
      {/* Sidebar de Controle */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '350px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0 0 0',
        boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ padding: '0 24px 24px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutDashboard color="#3B82F6" />
            Monitoramento
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            {mappedUnidades.length} Unidades Ativas
          </p>

          <div style={{ 
            marginTop: '20px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Search size={18} color="#94A3B8" style={{ marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Buscar unidade..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          {filteredUnidades.map(u => (
            <div 
              key={u.id}
              onClick={() => setSelectedId(u.id)}
              style={{
                padding: '16px',
                marginBottom: '12px',
                borderRadius: '16px',
                background: selectedId === u.id ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)' : 'rgba(255,255,255,0.03)',
                border: selectedId === u.id ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: 'white', fontSize: '1.1rem' }}>{u.nome}</strong>
                <span style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '2px 8px', 
                  borderRadius: '6px', 
                  fontSize: '0.8rem',
                  color: '#94A3B8'
                }}>
                  {u.cidade ? u.cidade : 'Brasil'}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '12px' }}>
                <Car size={14} />
                <span>{u.ocupacao || 0}% Ocupação</span>
              </div>

              {/* Progress Bar Container */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                {/* Progress Bar Fill */}
                <div className={getProgressColor(u.ocupacao || 0)} style={{ 
                  width: `${u.ocupacao || 0}%`, 
                  height: '100%',
                  transition: 'width 1s ease-in-out'
                }} />
              </div>

              {selectedId === u.id && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: '#94A3B8' }}>Veículos Pátio</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.round((u.ocupacao / 100) * (u.qtd_vagas || 100))}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: '#94A3B8' }}>Saídas Hoje</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>--</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', gridColumn: 'span 2', marginTop: '4px' }}>
                    <span style={{ color: '#94A3B8' }}>Arrecadação Hoje</span>
                    <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1rem' }}>R$ {(u.faturamento || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mapa Full Screen */}
      <MapContainer
        center={[-23.550520, -46.633308]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false} // Custom positioning if needed, or default is fine (usually top-left)
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark map style
        />
        
        <MapController selectedUnit={selectedUnit} />
        <FitBoundsController units={mappedUnidades} />

        {mappedUnidades.map(u => (
          <Marker 
            key={u.id} 
            position={[u.lat, u.lng]}
            eventHandlers={{
              click: () => setSelectedId(u.id),
            }}
          >
            <Popup>
              <div style={{ minWidth: '200px', color: '#0F172A' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{u.nome}</h3>
                <p style={{ margin: 0, color: '#64748B' }}>Ocupação: <strong>{u.ocupacao}%</strong></p>
                <p style={{ margin: 0, color: '#64748B' }}>Faturamento: <strong>R$ {u.faturamento}</strong></p>
                {u.endereco && <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>{u.endereco}, {u.numero}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
