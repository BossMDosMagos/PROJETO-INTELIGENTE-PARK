-- Adiciona colunas de coordenadas e endereço detalhado na tabela de pátios
-- Execute este script no SQL Editor do Supabase

ALTER TABLE patios 
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision,
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS numero text;

-- Garante que latitude e longitude aceitem null (já é o padrão, mas reforçando)
ALTER TABLE patios 
ALTER COLUMN latitude DROP NOT NULL,
ALTER COLUMN longitude DROP NOT NULL;

-- Comentário nas colunas
COMMENT ON COLUMN patios.latitude IS 'Latitude geográfica (GPS) com alta precisão';
COMMENT ON COLUMN patios.longitude IS 'Longitude geográfica (GPS) com alta precisão';
