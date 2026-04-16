const https = require('https');

const SUPABASE_URL = 'https://pumbsmawfbzaczklxeog.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJzbWF3ZmJ6YWN6a2x4ZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTIzODgsImV4cCI6MjA4ODIyODM4OH0.aNx8DCffzuxc7S6yEACCDuS2byuQf8SQzzSfJPA3RQI';

const sqlStatements = `

-- ========================================
-- 1. TABELA PÁTIOS
-- ========================================
CREATE TABLE IF NOT EXISTS patios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  telefone VARCHAR(20),
  email VARCHAR(100),
  qtd_vagas INTEGER DEFAULT 0,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT nome_patio_unico UNIQUE(nome)
);

CREATE INDEX IF NOT EXISTS idx_patios_ativo ON patios(ativo);
CREATE INDEX IF NOT EXISTS idx_patios_nome ON patios(nome);

-- ========================================
-- 2. TABELA CONFIGURAÇÕES
-- ========================================
CREATE TABLE IF NOT EXISTS configuracoes (
  id BIGINT PRIMARY KEY DEFAULT 1,
  nome_empresa TEXT,
  cnpj TEXT,
  endereco TEXT,
  telefone TEXT,
  logo_url TEXT,
  valor_hora NUMERIC DEFAULT 15.00,
  tolerancia_minutos INTEGER DEFAULT 15,
  valor_caixa_inicial NUMERIC DEFAULT 0,
  mensagem_convite TEXT DEFAULT 'Olá! Gostaria de convidar você para ser mensalista no Command Park.',
  aceita_moto BOOLEAN DEFAULT TRUE,
  cobra_multa BOOLEAN DEFAULT FALSE,
  valor_multa NUMERIC DEFAULT 0.00,
  dias_vencimento INTEGER DEFAULT 5,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

INSERT INTO configuracoes (id, nome_empresa)
VALUES (1, 'Command Park')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. TABELA POLÍTICAS DE ACESSO
-- ========================================
CREATE TABLE IF NOT EXISTS politicas_acesso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nivel VARCHAR(20) UNIQUE NOT NULL CHECK (nivel IN ('MASTER', 'ADMIN', 'SUPERVISOR', 'OPERADOR')),
  pode_registrar_entrada BOOLEAN DEFAULT false,
  pode_registrar_saida BOOLEAN DEFAULT false,
  pode_cancelar_ticket BOOLEAN DEFAULT false,
  pode_editar_valor_pago BOOLEAN DEFAULT false,
  pode_gerar_comprovante BOOLEAN DEFAULT false,
  pode_fechar_caixa BOOLEAN DEFAULT false,
  pode_abrir_caixa BOOLEAN DEFAULT false,
  pode_ver_financeiro_unidade BOOLEAN DEFAULT false,
  pode_ver_financeiro_geral BOOLEAN DEFAULT false,
  pode_gerar_boletos BOOLEAN DEFAULT false,
  pode_cadastrar_usuarios BOOLEAN DEFAULT false,
  pode_editar_usuarios BOOLEAN DEFAULT false,
  pode_deletar_usuarios BOOLEAN DEFAULT false,
  pode_editar_tarifa BOOLEAN DEFAULT false,
  pode_editar_unidade BOOLEAN DEFAULT false,
  pode_ver_auditoria BOOLEAN DEFAULT false,
  pode_cadastrar_mensalista BOOLEAN DEFAULT false,
  pode_editar_mensalista BOOLEAN DEFAULT false,
  pode_deletar_mensalista BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================
-- 4. TABELA UNIDADES
-- ========================================
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

-- ========================================
-- 5. TABELA PERFIS
-- ========================================
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

-- ========================================
-- 6. TABELA TARIFAS
-- ========================================
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
-- 7. TABELA MENSALISTAS
-- ========================================
CREATE TABLE IF NOT EXISTS mensalistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_unidade UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  nome VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  rg VARCHAR(20),
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  email TEXT,
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
  renavam TEXT,
  tipo_veiculo TEXT DEFAULT 'Passeio',
  dia_vencimento TEXT DEFAULT '05',
  patio_id UUID REFERENCES patios(id),
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

-- ========================================
-- 8. TABELA TICKETS
-- ========================================
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
-- 9. TABELA AUDITORIA
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
-- 10. TABELA SYNC_LOG
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
-- 11. ÍNDICES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_tickets_unidade_data ON tickets(id_unidade, data_entrada DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_placa ON tickets(placa_normalizada);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status, data_entrada DESC);
CREATE INDEX IF NOT EXISTS idx_mensalistas_unidade_status ON mensalistas(id_unidade, status);
CREATE INDEX IF NOT EXISTS idx_mensalistas_placa ON mensalistas(id_unidade, placa);

-- ========================================
-- 12. TRIGGERS
-- ========================================
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

-- ========================================
-- 13. DADOS INICIAIS
-- ========================================
INSERT INTO politicas_acesso (nivel, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_editar_valor_pago, pode_gerar_comprovante, pode_fechar_caixa, pode_abrir_caixa, pode_ver_financeiro_unidade, pode_ver_financeiro_geral, pode_gerar_boletos, pode_cadastrar_usuarios, pode_editar_usuarios, pode_deletar_usuarios, pode_editar_tarifa, pode_editar_unidade, pode_ver_auditoria, pode_cadastrar_mensalista, pode_editar_mensalista, pode_deletar_mensalista)
VALUES 
  ('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
  ('ADMIN', true, true, true, true, true, true, true, true, false, true, true, true, false, true, true, true, true, true, false),
  ('SUPERVISOR', true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, true, true, false),
  ('OPERADOR', true, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false)
ON CONFLICT (nivel) DO NOTHING;

INSERT INTO patios (nome, endereco, cidade, estado, qtd_vagas, descricao, ativo)
VALUES ('Pátio Principal', 'Centro', 'São Paulo', 'SP', 100, 'Pátio principal', true)
ON CONFLICT (nome) DO NOTHING;
`;

function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'pumbsmawfbzaczklxeog.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/pg_execute_query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function applyMigrations() {
  console.log('🚀 Aplicando migrations no Supabase...');
  
  const statements = sqlStatements.split(';').filter(s => s.trim());
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt) continue;
    
    try {
      console.log(`📝 Executando: ${stmt.substring(0, 60)}...`);
      await execSQL(stmt);
      console.log(`✅ OK`);
    } catch (err) {
      console.log(`⚠️  Erro (pode ser normal se já existir): ${err.message}`);
    }
  }
  
  console.log('✅ Migrations aplicadas!');
}

applyMigrations().catch(console.error);
