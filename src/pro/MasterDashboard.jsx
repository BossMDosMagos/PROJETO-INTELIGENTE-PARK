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
    processUnits();
  }, [unidades]);

  const selectedUnit = mappedUnidades.find(u => u.id === selectedId);

  // Métricas Consolidadas
  const totalFaturamento = bi.faturamento || 0;
  const ocupacaoMedia = bi.ocupacaoGlobal || 0;
  const alertasAtivos = mappedUnidades.filter(u => u.ocupacao > 90).length;

  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 p-4 relative z-10 pointer-events-none">
      {/* Sidebar Flutuante */}
      <div className="w-96 bg-[#0F172A]/60 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
        {/* Header da Lista */}
        <div className="p-4 border-b border-slate-800 bg-[#0F172A]/80">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-cyan-400" />
            Visão Geral da Rede
          </h2>
          
          {/* Cards de Métricas (Mini) */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Faturamento Hoje</div>
              <div className="text-lg font-mono font-bold text-emerald-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFaturamento)}
              </div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Ocupação Média</div>
              <div className="text-lg font-mono font-bold text-cyan-400">{ocupacaoMedia}%</div>
            </div>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar unidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500 placeholder-slate-600 text-sm"
            />
          </div>
        </div>

        {/* Lista de Unidades */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {mappedUnidades
            .filter(u => u.nome.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(u => (
            <div
              key={u.id}
              onClick={() => setSelectedId(u.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                selectedId === u.id 
                  ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-sm ${selectedId === u.id ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'}`}>
                  {u.nome}
                </h3>
                {u.ocupacao > 90 && (
                  <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Ocupação</span>
                  <span className={`font-mono font-bold ${
                    u.ocupacao > 90 ? 'text-red-400' : u.ocupacao > 70 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {u.ocupacao}%
                  </span>
                </div>
                
                {/* Barra de Progresso */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      u.ocupacao > 90 ? 'bg-red-500' : u.ocupacao > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${u.ocupacao}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Car className="w-3 h-3" />
                    <span>{Math.round((u.ocupacao / 100) * (u.qtd_vagas || 100))}/{u.qtd_vagas || 100}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(u.faturamento || 0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controller Invisível para FlyTo e FitBounds */}
      <div className="hidden">
        {/* O mapa real está no ProLayout, este componente só renderiza a lista lateral sobreposta */}
      </div>
    </div>
  );
}
