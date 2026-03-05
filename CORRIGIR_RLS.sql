-- =====================================================================
-- CORRIGIR POLÍTICAS RLS - PERMITIR LEITURA PÚBLICA
-- =====================================================================

-- 1️⃣ DESABILITAR RLS temporariamente
ALTER TABLE public.politicas_acesso DISABLE ROW LEVEL SECURITY;

-- 2️⃣ REABILITAR RLS
ALTER TABLE public.politicas_acesso ENABLE ROW LEVEL SECURITY;

-- 3️⃣ DELETAR POLÍTICAS ANTIGAS
DROP POLICY IF EXISTS "read_all" ON public.politicas_acesso;
DROP POLICY IF EXISTS "insert_all" ON public.politicas_acesso;
DROP POLICY IF EXISTS "update_all" ON public.politicas_acesso;
DROP POLICY IF EXISTS "delete_all" ON public.politicas_acesso;

-- 4️⃣ CRIAR POLÍTICAS SIMPLES (público pode ler, autenticado pode inserir/atualizar/deletar)
CREATE POLICY "Permitir leitura pública" ON public.politicas_acesso
  FOR SELECT
  USING (true);

CREATE POLICY "Inserir apenas autenticados" ON public.politicas_acesso
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Atualizar apenas autenticados" ON public.politicas_acesso
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Deletar apenas autenticados" ON public.politicas_acesso
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ✅ Pronto!
SELECT COUNT(*) as total_registros FROM public.politicas_acesso;
