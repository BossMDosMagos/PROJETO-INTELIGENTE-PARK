-- Criação da tabela de configurações globais
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Inserir configuração padrão se não existir (ID 1 fixo)
INSERT INTO configuracoes (id, nome_empresa)
VALUES (1, 'Command Park')
ON CONFLICT (id) DO NOTHING;

-- Política de segurança (RLS)
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (para página de cadastro)
CREATE POLICY "Leitura pública de configurações" 
ON configuracoes FOR SELECT 
TO anon, authenticated 
USING (true);

-- Permitir atualização apenas para autenticados (admin)
CREATE POLICY "Atualização restrita de configurações" 
ON configuracoes FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);
