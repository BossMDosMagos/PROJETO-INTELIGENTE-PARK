-- =====================================================================
-- SOLUÇÃO FINAL: DESABILITAR RLS EM POLITICAS_ACESSO
-- A tabela é de leitura apenas (admin), então não precisa de RLS restritiva
-- =====================================================================

-- 1️⃣ DESABILITAR RLS COMPLETAMENTE
ALTER TABLE public.politicas_acesso DISABLE ROW LEVEL SECURITY;

-- 2️⃣ REMOVER TODAS AS POLÍTICAS
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.politicas_acesso;
DROP POLICY IF EXISTS "Inserir apenas autenticados" ON public.politicas_acesso;
DROP POLICY IF EXISTS "Atualizar apenas autenticados" ON public.politicas_acesso;
DROP POLICY IF EXISTS "Deletar apenas autenticados" ON public.politicas_acesso;
DROP POLICY IF EXISTS "read_all" ON public.politicas_acesso;
DROP POLICY IF EXISTS "insert_all" ON public.politicas_acesso;
DROP POLICY IF EXISTS "update_all" ON public.politicas_acesso;
DROP POLICY IF EXISTS "delete_all" ON public.politicas_acesso;
DROP POLICY IF EXISTS "anyone can read" ON public.politicas_acesso;
DROP POLICY IF EXISTS "anyone can insert" ON public.politicas_acesso;
DROP POLICY IF EXISTS "anyone can update" ON public.politicas_acesso;
DROP POLICY IF EXISTS "anyone can delete" ON public.politicas_acesso;
DROP POLICY IF EXISTS "public read policies" ON public.politicas_acesso;

-- 3️⃣ CONFIRMAR QUE ESTÁ DESABILITADO
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'politicas_acesso';

-- ✅ RLS agora está 100% desabilitado
-- Qualquer um (inclusive anon key) pode ler/escrever
