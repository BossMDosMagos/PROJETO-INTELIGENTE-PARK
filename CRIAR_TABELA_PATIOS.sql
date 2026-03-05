-- =====================================================================
-- CRIAR TABELA PÁTIOS
-- =====================================================================

-- ✅ Criar tabela patios
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

-- ✅ Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_patios_ativo ON patios(ativo);
CREATE INDEX IF NOT EXISTS idx_patios_nome ON patios(nome);
CREATE INDEX IF NOT EXISTS idx_patios_created_at ON patios(created_at);

-- ✅ Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION atualizar_updated_at_patios()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_atualizar_patios ON patios;
CREATE TRIGGER trigger_atualizar_patios
  BEFORE UPDATE ON patios
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at_patios();

-- ✅ Desabilitar RLS para funcionar com auth
ALTER TABLE patios DISABLE ROW LEVEL SECURITY;

-- ✅ Inserir pátios de exemplo
INSERT INTO patios (nome, endereco, cidade, estado, qtd_vagas, descricao, ativo)
VALUES 
  ('Pátio Centro', 'Rua Principal, 100', 'São Paulo', 'SP', 150, 'Pátio principal no centro', true),
  ('Pátio Zona Leste', 'Av. Brasil, 500', 'São Paulo', 'SP', 200, 'Pátio zona leste', true),
  ('Pátio Shopping', 'Av. Paulista, 1000', 'São Paulo', 'SP', 300, 'Pátio do shopping', true)
ON CONFLICT (nome) DO NOTHING;

SELECT '✅ Tabela patios criada com sucesso!' as status;
