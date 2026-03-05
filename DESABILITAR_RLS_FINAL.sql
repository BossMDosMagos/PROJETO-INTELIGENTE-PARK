-- =====================================================================
-- DESABILITAR RLS EM TODAS AS TABELAS
-- O erro "Database error querying schema" é RLS bloqueando leitura
-- =====================================================================

ALTER TABLE public.politicas_acesso DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensalistas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_log DISABLE ROW LEVEL SECURITY;

-- ✅ RLS desabilitado em todas as tabelas
-- Agora qualquer um pode ler/escrever
SELECT 'RLS disabled' as status;
