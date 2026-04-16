-- =====================================================================
-- SOLUÇÃO NUCLEAR: REMOVER TODAS AS POLÍTICAS RLS E DESABILITAR RLS
-- =====================================================================

-- 1️⃣ Remover TODAS as políticas RLS existentes
DROP POLICY IF EXISTS policy_politicas_acesso ON public.politicas_acesso CASCADE;
DROP POLICY IF EXISTS policy_unidades ON public.unidades CASCADE;
DROP POLICY IF EXISTS policy_perfis ON public.perfis CASCADE;
DROP POLICY IF EXISTS policy_tickets ON public.tickets CASCADE;
DROP POLICY IF EXISTS policy_mensalistas ON public.mensalistas CASCADE;
DROP POLICY IF EXISTS policy_tarifas ON public.tarifas CASCADE;
DROP POLICY IF EXISTS policy_auditoria ON public.auditoria CASCADE;
DROP POLICY IF EXISTS policy_sync_log ON public.sync_log CASCADE;

-- 2️⃣ Desabilitar RLS em TODAS as tabelas
ALTER TABLE public.politicas_acesso DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensalistas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarifas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_log DISABLE ROW LEVEL SECURITY;

-- 3️⃣ Fazer commit das mudanças
COMMIT;

-- ✅ PRONTO!
SELECT 'RLS completamente desabilitado e todas as políticas removidas' as status;
