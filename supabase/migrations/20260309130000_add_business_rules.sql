-- Adicionar colunas de regras de negócio e mensagens na tabela configuracoes
ALTER TABLE configuracoes
ADD COLUMN IF NOT EXISTS mensagem_convite TEXT DEFAULT 'Olá! Gostaria de convidar você para ser mensalista no Command Park. Acesse o link para se cadastrar:',
ADD COLUMN IF NOT EXISTS aceita_moto BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS cobra_multa BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS valor_multa NUMERIC DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS dias_vencimento INTEGER DEFAULT 5;

-- Atualizar permissões (apenas para garantir)
GRANT ALL ON configuracoes TO authenticated;
GRANT SELECT ON configuracoes TO anon;
