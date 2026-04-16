-- =====================================================================
-- PREPARAR TABELA MENSALISTAS NO SUPABASE - VERSÃO CORRIGIDA
-- =====================================================================

-- ✅ DROPAR TABELA ANTIGA (se existir)
DROP TABLE IF EXISTS mensalistas CASCADE;

-- ✅ Criar tabela mensalistas do ZERO
CREATE TABLE mensalistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  placa VARCHAR(10) NOT NULL,
  modelo VARCHAR(100),
  cor VARCHAR(50),
  whatsapp VARCHAR(11),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
  data_cadastro TIMESTAMP NOT NULL DEFAULT now(),
  data_vencimento DATE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  
  CONSTRAINT placa_unica UNIQUE(placa),
  CONSTRAINT status_valido CHECK (status IN ('PENDENTE', 'ATIVO', 'INATIVO'))
);

-- ✅ Criar índices para performance
CREATE INDEX idx_mensalistas_status ON mensalistas(status);
CREATE INDEX idx_mensalistas_placa ON mensalistas(placa);
CREATE INDEX idx_mensalistas_data_cadastro ON mensalistas(data_cadastro DESC);

-- ✅ Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION atualizar_updated_at_mensalistas()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_mensalistas
  BEFORE UPDATE ON mensalistas
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at_mensalistas();

-- ✅ Desabilitar RLS para funcionar com auth
ALTER TABLE mensalistas DISABLE ROW LEVEL SECURITY;

-- ✅ Inserir 3 mensalistas de exemplo para teste
INSERT INTO mensalistas (id, nome, cpf, placa, modelo, cor, whatsapp, status, data_cadastro)
VALUES 
  (gen_random_uuid(), 'João Silva', '12345678901', 'ABC-1234', 'Toyota Corolla', 'Preto', '11987654321', 'ATIVO', now()),
  (gen_random_uuid(), 'Maria Santos', '98765432109', 'DEF-5678', 'Honda Civic', 'Branco', '11987654322', 'PENDENTE', now()),
  (gen_random_uuid(), 'Pedro Costa', '55544433322', 'GHI-9012', 'Volkswagen Gol', 'Vermelho', '11987654323', 'INATIVO', now());

-- ✅ Verificar dados inseridos
SELECT '✅ Tabela mensalistas criada com sucesso!' as status;
SELECT count(*) as "Total de Mensalistas" FROM mensalistas;
