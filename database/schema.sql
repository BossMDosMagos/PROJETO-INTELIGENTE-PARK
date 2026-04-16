-- ========================================
-- SISTEMA INTELIGENTE PARK - SCHEMA SQL
-- Supabase PostgreSQL
-- ========================================

-- ========================================
-- 1. TABELAS BASES
-- ========================================

-- Política de Acesso (Matriz RBAC)
CREATE TABLE IF NOT EXISTS politicas_acesso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nivel VARCHAR(20) UNIQUE NOT NULL CHECK (nivel IN ('MASTER', 'ADMIN', 'SUPERVISOR', 'OPERADOR')),
  
  -- Permissões Operacionais
  pode_registrar_entrada BOOLEAN DEFAULT false,
  pode_registrar_saida BOOLEAN DEFAULT false,
  pode_cancelar_ticket BOOLEAN DEFAULT false,
  pode_editar_valor_pago BOOLEAN DEFAULT false,
  pode_gerar_comprovante BOOLEAN DEFAULT false,
  
  -- Permissões Financeiras
  pode_fechar_caixa BOOLEAN DEFAULT false,
  pode_abrir_caixa BOOLEAN DEFAULT false,
  pode_ver_financeiro_unidade BOOLEAN DEFAULT false,
  pode_ver_financeiro_geral BOOLEAN DEFAULT false,
  pode_gerar_boletos BOOLEAN DEFAULT false,
  
  -- Permissões Administrativas
  pode_cadastrar_usuarios BOOLEAN DEFAULT false,
  pode_editar_usuarios BOOLEAN DEFAULT false,
  pode_deletar_usuarios BOOLEAN DEFAULT false,
  pode_editar_tarifa BOOLEAN DEFAULT false,
  pode_editar_unidade BOOLEAN DEFAULT false,
  pode_ver_auditoria BOOLEAN DEFAULT false,
  
  -- Permissões Mensalista
  pode_cadastrar_mensalista BOOLEAN DEFAULT false,
  pode_editar_mensalista BOOLEAN DEFAULT false,
  pode_deletar_mensalista BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Unidades (Pátios)
CREATE TABLE IF NOT EXISTS unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  nome VARCHAR(150) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  endereco_numero VARCHAR(20),
  endereco_complemento VARCHAR(150),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(9),
  
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(150),
  responsavel VARCHAR(100),
  
  capacidade_total INTEGER NOT NULL DEFAULT 50,
  vagas_disponiveis INTEGER DEFAULT 50,
  
  horario_abertura TIME,
  horario_fechamento TIME,
  
  aceita_online BOOLEAN DEFAULT true,
  aceita_mensalistas BOOLEAN DEFAULT true,
  
  status VARCHAR(20) DEFAULT 'ATIVA' CHECK (status IN ('ATIVA', 'INATIVA', 'SUSPENSA')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Perfis de Usuários
CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  
  nome_completo VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  rg VARCHAR(20),
  
  nivel_acesso VARCHAR(20) NOT NULL CHECK (nivel_acesso IN ('MASTER', 'ADMIN', 'SUPERVISOR', 'OPERADOR')),
  id_unidade_principal UUID REFERENCES unidades(id),
  unidades_permissao UUID[] DEFAULT '{}',
  
  telefone VARCHAR(20),
  email VARCHAR(150),
  
  data_nascimento DATE,
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(9),
  
  ativo BOOLEAN DEFAULT true,
  data_admissao DATE,
  data_demissao DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tarifas
CREATE TABLE IF NOT EXISTS tarifas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_unidade UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  
  primeira_hora_minutos INTEGER DEFAULT 60,
  valor_primeira_hora DECIMAL(10, 2) NOT NULL,
  
  valor_hora_adicional DECIMAL(10, 2),
  valor_meia_hora_adicional DECIMAL(10, 2),
  
  valor_maximo_diario DECIMAL(10, 2),
  
  valor_mensalista DECIMAL(10, 2),
  percentual_desconto_mensalista INTEGER DEFAULT 30,
  
  data_vigencia_inicio DATE DEFAULT CURRENT_DATE,
  data_vigencia_fim DATE,
  
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES perfis(id),
  
  CONSTRAINT unique_unidade_tarifa UNIQUE(id_unidade, ativo)
);

-- ========================================
-- 2. TABELAS DE OPERAÇÃO
-- ========================================

-- Mensalistas
CREATE TABLE IF NOT EXISTS mensalistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_unidade UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  rg VARCHAR(20),
  
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(150),
  
  endereco VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(150),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(9),
  
  placa VARCHAR(8) NOT NULL,
  modelo VARCHAR(50),
  cor VARCHAR(50),
  marca VARCHAR(50),
  ano INTEGER,
  renavam VARCHAR(20),
  
  status VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'ATIVO', 'SUSPENSO', 'CANCELADO')),
  data_ativacao DATE,
  data_vencimento DATE,
  duracao_vigencia_dias INTEGER DEFAULT 30,
  
  valor_mensalidade DECIMAL(10, 2),
  data_proxima_cobranca DATE,
  
  data_cancelamento TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT unique_mensalista_unidade UNIQUE(id_unidade, placa)
);

-- Tickets (Registros de Entrada/Saída)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_unidade UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  
  placa VARCHAR(8) NOT NULL,
  placa_normalizada VARCHAR(8),
  modelo VARCHAR(50),
  cor VARCHAR(50),
  marca VARCHAR(50),
  
  data_entrada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_saida TIMESTAMP WITH TIME ZONE,
  duracao_minutos INTEGER,
  
  id_mensalista UUID REFERENCES mensalistas(id) ON DELETE SET NULL,
  eh_mensalista BOOLEAN DEFAULT false,
  
  valor_tarifa DECIMAL(10, 2),
  desconto DECIMAL(10, 2) DEFAULT 0,
  valor_pago DECIMAL(10, 2),
  forma_pagamento VARCHAR(20) CHECK (forma_pagamento IN ('DINHEIRO', 'DEBITO', 'CREDITO', 'PIX', NULL)),
  
  status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'PAGO', 'CANCELADO', 'CORTESIA')),
  motivo_cancelamento VARCHAR(255),
  
  operador_entrada_id UUID REFERENCES perfis(id),
  operador_saida_id UUID REFERENCES perfis(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- 3. AUDITORIA
-- ========================================

CREATE TABLE IF NOT EXISTS auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_unidade UUID REFERENCES unidades(id) ON DELETE SET NULL,
  
  tabela_afetada VARCHAR(50) NOT NULL,
  operacao VARCHAR(20) NOT NULL CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE')),
  id_registro UUID NOT NULL,
  
  dados_antes JSONB,
  dados_depois JSONB,
  
  usuario_id UUID,
  usuario_nome VARCHAR(150),
  
  descricao TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- 4. SINCRONIZAÇÃO OFFLINE
-- ========================================

CREATE TABLE IF NOT EXISTS sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL,
  unidade_id UUID REFERENCES unidades(id),
  
  sync_id UUID,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SYNCED', 'FAILED')),
  
  operacoes_count INTEGER DEFAULT 0,
  operacoes_sincronizadas INTEGER DEFAULT 0,
  
  erro_mensagem TEXT,
  retry_count INTEGER DEFAULT 0,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- 5. ÍNDICES
-- ========================================

-- Tickets
CREATE INDEX idx_tickets_unidade_data ON tickets(id_unidade, data_entrada DESC);
CREATE INDEX idx_tickets_placa ON tickets(placa_normalizada);
CREATE INDEX idx_tickets_status ON tickets(status, data_entrada DESC);
CREATE INDEX idx_tickets_operador ON tickets(operador_entrada_id);

-- Mensalistas
CREATE INDEX idx_mensalistas_unidade_status ON mensalistas(id_unidade, status);
CREATE INDEX idx_mensalistas_placa ON mensalistas(id_unidade, placa);

-- Auditoria
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id, created_at DESC);
CREATE INDEX idx_auditoria_unidade ON auditoria(id_unidade, created_at DESC);

-- Perfis
CREATE INDEX idx_perfis_unidade ON perfis(id_unidade_principal);
CREATE INDEX idx_perfis_nivel ON perfis(nivel_acesso);

-- ========================================
-- 6. DADOS INICIAIS (POLÍTICAS)
-- ========================================

INSERT INTO politicas_acesso (nivel, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_editar_valor_pago, pode_gerar_comprovante, pode_fechar_caixa, pode_abrir_caixa, pode_ver_financeiro_unidade, pode_ver_financeiro_geral, pode_gerar_boletos, pode_cadastrar_usuarios, pode_editar_usuarios, pode_deletar_usuarios, pode_editar_tarifa, pode_editar_unidade, pode_ver_auditoria, pode_cadastrar_mensalista, pode_editar_mensalista, pode_deletar_mensalista)
VALUES 
  ('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
  ('ADMIN', true, true, true, true, true, true, true, true, false, true, true, true, false, true, true, true, true, true, true),
  ('SUPERVISOR', true, true, false, false, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false),
  ('OPERADOR', true, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false)
ON CONFLICT (nivel) DO NOTHING;

-- ========================================
-- 7. TRIGGERS E FUNÇÕES
-- ========================================

-- Atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_unidades_updated_at BEFORE UPDATE ON unidades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tarifas_updated_at BEFORE UPDATE ON tarifas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mensalistas_updated_at BEFORE UPDATE ON mensalistas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_perfis_updated_at BEFORE UPDATE ON perfis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Normalizar placa
CREATE OR REPLACE FUNCTION normalizar_placa()
RETURNS TRIGGER AS $$
BEGIN
  NEW.placa_normalizada = UPPER(REGEXP_REPLACE(NEW.placa, '[^A-Z0-9]', '', 'g'));
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER normalizar_placa_tickets BEFORE INSERT OR UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION normalizar_placa();

-- Calcular duração de ticket
CREATE OR REPLACE FUNCTION calcular_duracao_ticket()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.data_saida IS NOT NULL THEN
    NEW.duracao_minutos = EXTRACT(EPOCH FROM (NEW.data_saida - NEW.data_entrada)) / 60;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calcular_duracao_tickets BEFORE INSERT OR UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION calcular_duracao_ticket();

-- ========================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS nas tabelas
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensalistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarifas ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Políticas para Unidades
CREATE POLICY "users_see_own_units" ON unidades
  FOR SELECT
  USING (
    (SELECT nivel_acesso FROM perfis WHERE user_id = auth.uid()) = 'MASTER'
    OR id = (SELECT id_unidade_principal FROM perfis WHERE user_id = auth.uid())
    OR id = ANY((SELECT unidades_permissao FROM perfis WHERE user_id = auth.uid()))
  );

-- Políticas para Tickets
CREATE POLICY "users_see_own_unit_tickets" ON tickets
  FOR SELECT
  USING (
    (SELECT nivel_acesso FROM perfis WHERE user_id = auth.uid()) = 'MASTER'
    OR id_unidade = (SELECT id_unidade_principal FROM perfis WHERE user_id = auth.uid())
    OR id_unidade = ANY((SELECT unidades_permissao FROM perfis WHERE user_id = auth.uid()))
  );

CREATE POLICY "users_create_tickets" ON tickets
  FOR INSERT
  WITH CHECK (
    (SELECT pode_registrar_entrada FROM politicas_acesso 
     JOIN perfis ON perfis.nivel_acesso = politicas_acesso.nivel
     WHERE perfis.user_id = auth.uid()) = true
  );

-- Políticas para Mensalistas
CREATE POLICY "users_see_own_unit_mensalistas" ON mensalistas
  FOR SELECT
  USING (
    (SELECT nivel_acesso FROM perfis WHERE user_id = auth.uid()) = 'MASTER'
    OR id_unidade = (SELECT id_unidade_principal FROM perfis WHERE user_id = auth.uid())
    OR id_unidade = ANY((SELECT unidades_permissao FROM perfis WHERE user_id = auth.uid()))
  );

-- Políticas para Auditoria
CREATE POLICY "admins_see_auditoria" ON auditoria
  FOR SELECT
  USING (
    (SELECT nivel_acesso FROM perfis WHERE user_id = auth.uid()) IN ('MASTER', 'ADMIN')
    AND (
      (SELECT nivel_acesso FROM perfis WHERE user_id = auth.uid()) = 'MASTER'
      OR id_unidade = (SELECT id_unidade_principal FROM perfis WHERE user_id = auth.uid())
    )
  );

-- ========================================
-- 9. VIEWS ÚTEIS
-- ========================================

-- Resumo de caixa por unidade
CREATE OR REPLACE VIEW v_resumo_caixa AS
SELECT 
  t.id_unidade,
  u.nome as unidade_nome,
  DATE(t.data_entrada) as data,
  COUNT(*) as total_tickets,
  COUNT(CASE WHEN t.status = 'PAGO' THEN 1 END) as tickets_pagos,
  COALESCE(SUM(CASE WHEN t.status = 'PAGO' THEN t.valor_pago ELSE 0 END), 0) as total_faturado,
  COUNT(DISTINCT CASE WHEN t.eh_mensalista = true THEN t.id END) as mensalistas_passagem,
  COUNT(CASE WHEN t.status = 'CANCELADO' THEN 1 END) as tickets_cancelados
FROM tickets t
JOIN unidades u ON u.id = t.id_unidade
WHERE t.deleted_at IS NULL
GROUP BY t.id_unidade, u.nome, DATE(t.data_entrada)
ORDER BY DATE(t.data_entrada) DESC;

-- Mensalistas vencimento próximo
CREATE OR REPLACE VIEW v_mensalistas_vencimento_proximo AS
SELECT 
  m.id,
  m.nome,
  m.placa,
  m.id_unidade,
  u.nome as unidade_nome,
  m.data_vencimento,
  (m.data_vencimento - CURRENT_DATE) as dias_para_vencer,
  m.valor_mensalidade,
  m.telefone,
  m.whatsapp
FROM mensalistas m
JOIN unidades u ON u.id = m.id_unidade
WHERE m.status = 'ATIVO'
  AND m.data_vencimento <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY m.data_vencimento ASC;
