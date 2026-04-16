-- Criar tabela de pagamentos de mensalistas
CREATE TABLE IF NOT EXISTS pagamentos_mensalistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mensalista_id UUID NOT NULL REFERENCES mensalistas(id) ON DELETE CASCADE,
  valor DECIMAL(10, 2) NOT NULL CHECK (valor > 0),
  metodo VARCHAR(50) NOT NULL DEFAULT 'PIX',
  data_pagamento DATE NOT NULL DEFAULT CURRENT_DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mensalista_pagamento FOREIGN KEY (mensalista_id) REFERENCES mensalistas(id) ON DELETE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_mensalista_id ON pagamentos_mensalistas(mensalista_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data ON pagamentos_mensalistas(data_pagamento DESC);
CREATE INDEX IF NOT EXISTS idx_pagamentos_mensalista_data ON pagamentos_mensalistas(mensalista_id, data_pagamento DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION atualizar_updated_at_pagamentos()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_atualizar_updated_at_pagamentos ON pagamentos_mensalistas;
CREATE TRIGGER trigger_atualizar_updated_at_pagamentos
BEFORE UPDATE ON pagamentos_mensalistas
FOR EACH ROW
EXECUTE FUNCTION atualizar_updated_at_pagamentos();

-- Inserir alguns dados de exemplo
INSERT INTO pagamentos_mensalistas (mensalista_id, valor, metodo, data_pagamento, observacoes)
SELECT 
  (SELECT id FROM mensalistas WHERE nome = 'João Silva' LIMIT 1),
  150.00,
  'PIX',
  CURRENT_DATE - INTERVAL '5 days',
  'Pagamento referente a mensalidade de março'
WHERE EXISTS (SELECT 1 FROM mensalistas WHERE nome = 'João Silva')
ON CONFLICT DO NOTHING;

INSERT INTO pagamentos_mensalistas (mensalista_id, valor, metodo, data_pagamento, observacoes)
SELECT 
  (SELECT id FROM mensalistas WHERE nome = 'João Silva' LIMIT 1),
  150.00,
  'DINHEIRO',
  CURRENT_DATE - INTERVAL '35 days',
  'Pagamento referente a mensalidade de fevereiro'
WHERE EXISTS (SELECT 1 FROM mensalistas WHERE nome = 'João Silva')
ON CONFLICT DO NOTHING;

-- Verificar os dados
SELECT 'Pagamentos registrados:', COUNT(*) FROM pagamentos_mensalistas;
