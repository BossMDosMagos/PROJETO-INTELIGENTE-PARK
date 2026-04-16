-- Adicionar colunas para cadastro completo de mensalistas
ALTER TABLE mensalistas
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS renavam TEXT,
ADD COLUMN IF NOT EXISTS tipo_veiculo TEXT DEFAULT 'Passeio',
ADD COLUMN IF NOT EXISTS dia_vencimento TEXT DEFAULT '05',
ADD COLUMN IF NOT EXISTS patio_id UUID REFERENCES patios(id);

-- Atualizar permissões (apenas para garantir)
GRANT ALL ON mensalistas TO authenticated;
GRANT SELECT, INSERT ON mensalistas TO anon;
