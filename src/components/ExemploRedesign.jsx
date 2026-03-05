import React, { useState } from 'react';
import DESIGN from '../design-system';
import { Button } from './Button';
import HeaderRedesenhado from './HeaderRedesenhado';
import { StatusSincronizacao, StatusCard, SincronizacaoAlert } from './StatusSincronizacao';
import { CheckCircle, AlertTriangle, Users, TrendingUp, Car } from 'lucide-react';

/**
 * EXEMPLO DE IMPLEMENTAÇÃO DO NOVO DESIGN
 * Esta é uma tela de exemplo mostrando como o novo design system funciona
 * Use este arquivo como referência para integrar o novo design no App.jsx
 */

export function ExemploRedesign() {
  const [mostrarCaixa, setMostrarCaixa] = useState(false);

  // Dados mock
  const usuarioAutenticado = {
    operador: 'joao',
    nomeCompleto: 'João Silva',
    nivelAcesso: 'MASTER'
  };

  const pendenciasMensalistas = 3;
  const temDadosPendentes = false;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DESIGN.colors.neutral[50] }}>
      {/* Header Novo */}
      <HeaderRedesenhado
        usuarioAutenticado={usuarioAutenticado}
        pendenciasMensalistas={pendenciasMensalistas}
        temDadosPendentes={temDadosPendentes}
        statusSincronizacao="sincronizado"
        saldoCaixa={1250.00}
        mostrarCaixa={mostrarCaixa}
        onToggleCaixa={() => setMostrarCaixa(!mostrarCaixa)}
        onNotificacoes={() => alert('Abrir notificações')}
        onLogout={() => alert('Fazer logout')}
        onMenuToggle={() => {}}
        isMobile={false}
      />

      {/* Conteúdo Principal */}
      <main 
        className="max-w-7xl mx-auto p-6"
        style={{ gap: DESIGN.spacing.lg }}
      >
        {/* Alert de Sincronização (exemplo) */}
        <SincronizacaoAlert
          tipo="warning"
          mensagem="Sistema sincronizando com servidor... 2 de 5 operações pendentes."
          labelAcao="Ver detalhes"
          acao={() => alert('Detalhes')}
        />

        {/* Grid de Status Cards - 4 colunas em desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            titulo="Veículos no Pátio"
            status="info"
            valor="12"
            detalhes="Lotação: 60%"
            icon={Car}
          />

          <StatusCard
            titulo="Sincronização"
            status="success"
            valor="100%"
            detalhes="Nenhuma operação pendente"
            icon={CheckCircle}
          />

          <StatusCard
            titulo="Operadores Online"
            status="success"
            valor="4"
            detalhes="Todos disponíveis"
            icon={Users}
          />

          <StatusCard
            titulo="Faturamento do Dia"
            status="success"
            valor="R$ 1.250,00"
            detalhes="+15% vs. dia anterior"
            icon={TrendingUp}
          />
        </div>

        {/* Seção Principal com Entrada rápida */}
        <div
          className="rounded-lg p-6 border"
          style={{
            backgroundColor: DESIGN.colors.white,
            borderColor: DESIGN.colors.neutral[200],
            boxShadow: DESIGN.shadow.base
          }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: DESIGN.colors.primary[900] }}
          >
            Registrar Entrada de Veículo
          </h2>

          <div className="space-y-4">
            {/* Grid de inputs - exemplo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: DESIGN.colors.neutral[700] }}
                >
                  Placa
                </label>
                <input
                  type="text"
                  placeholder="ABC-1234"
                  style={{
                    width: '100%',
                    padding: `${DESIGN.spacing.sm} ${DESIGN.spacing.md}`,
                    fontSize: DESIGN.typography.sizes.base,
                    border: `2px solid ${DESIGN.colors.neutral[300]}`,
                    borderRadius: DESIGN.border.radius.md,
                    fontFamily: DESIGN.typography.family.base,
                    transition: DESIGN.transition.base
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = DESIGN.colors.primary[400];
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${DESIGN.colors.primary[400]}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = DESIGN.colors.neutral[300];
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: DESIGN.colors.neutral[700] }}
                >
                  Modelo
                </label>
                <input
                  type="text"
                  placeholder="Toyota Corolla"
                  style={{
                    width: '100%',
                    padding: `${DESIGN.spacing.sm} ${DESIGN.spacing.md}`,
                    fontSize: DESIGN.typography.sizes.base,
                    border: `2px solid ${DESIGN.colors.neutral[300]}`,
                    borderRadius: DESIGN.border.radius.md,
                    fontFamily: DESIGN.typography.family.base
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-2"
                  style={{ color: DESIGN.colors.neutral[700] }}
                >
                  Cor
                </label>
                <input
                  type="text"
                  placeholder="Preto"
                  style={{
                    width: '100%',
                    padding: `${DESIGN.spacing.sm} ${DESIGN.spacing.md}`,
                    fontSize: DESIGN.typography.sizes.base,
                    border: `2px solid ${DESIGN.colors.neutral[300]}`,
                    borderRadius: DESIGN.border.radius.md,
                    fontFamily: DESIGN.typography.family.base
                  }}
                />
              </div>
            </div>

            {/* Grid de Botões */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={Car}
              >
                Registrar Entrada
              </Button>

              <Button
                variant="secondary"
                size="lg"
                fullWidth
              >
                Registrar Saída
              </Button>

              <Button
                variant="outline"
                size="lg"
                fullWidth
              >
                Consultar
              </Button>
            </div>
          </div>
        </div>

        {/* Demonstração de variações de butões */}
        <div
          className="rounded-lg p-6 border"
          style={{
            backgroundColor: DESIGN.colors.white,
            borderColor: DESIGN.colors.neutral[200],
            boxShadow: DESIGN.shadow.base
          }}
        >
          <h3 
            className="text-lg font-bold mb-4"
            style={{ color: DESIGN.colors.primary[900] }}
          >
            Variações de Botões
          </h3>

          <div className="space-y-4">
            {/* Linha 1: Tamanhos */}
            <div>
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: DESIGN.colors.neutral[700] }}
              >
                Tamanhos (Primary)
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button size="sm">Pequeno</Button>
                <Button size="md">Médio</Button>
                <Button size="lg">Grande</Button>
                <Button size="xl">Extra Grande</Button>
              </div>
            </div>

            {/* Linha 2: Variantes */}
            <div>
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: DESIGN.colors.neutral[700] }}
              >
                Variações
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Linha 3: Estados */}
            <div>
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: DESIGN.colors.neutral[700] }}
              >
                Estados
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button disabled>Disabled</Button>
                <Button loading>Carregando...</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Cards responsivo - exemplo de layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: DESIGN.colors.white,
                borderColor: DESIGN.colors.neutral[200],
                boxShadow: DESIGN.shadow.xs
              }}
            >
              <p 
                className="text-sm font-semibold mb-2"
                style={{ color: DESIGN.colors.neutral[700] }}
              >
                ABC-{String(1000 + item).slice(1)}
              </p>
              <p 
                style={{ color: DESIGN.colors.neutral[600] }}
              >
                Toyota Corolla • Preto
              </p>
              <p 
                className="text-xs mt-3"
                style={{ color: DESIGN.colors.primary[400] }}
              >
                00:45:23 no pátio
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ExemploRedesign;
