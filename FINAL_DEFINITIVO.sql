-- =====================================================================
-- SOLUÇÃO FINAL: LIMPAR TUDO E INSERIR CORRETO
-- =====================================================================

-- 1️⃣ DESABILITAR RLS PRIMEIRO
ALTER TABLE public.politicas_acesso DISABLE ROW LEVEL SECURITY;

-- 2️⃣ DELETAR TODOS OS REGISTROS
TRUNCATE TABLE public.politicas_acesso;

-- 3️⃣ INSERIR OS 4 NÍVEIS
INSERT INTO public.politicas_acesso 
(nivel_acesso, pode_criar_unidade, pode_editar_unidade, pode_deletar_unidade, pode_ver_financeiro_geral, pode_ver_financeiro_unidade, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_gerenciar_mensalistas, pode_gerar_relatorios, pode_fechar_caixa, pode_ver_auditoria, pode_editar_tarifa, pode_exportar_dados, pode_importar_dados, pode_gerenciar_usuarios, pode_acessar_operador, pode_acessar_admin)
VALUES 
('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('ADMIN', false, true, false, false, true, true, true, true, true, true, true, false, true, true, false, false, true, false),
('SUPERVISOR', false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, false),
('OPERADOR', false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, true, false);

-- 4️⃣ HABILITAR RLS
ALTER TABLE public.politicas_acesso ENABLE ROW LEVEL SECURITY;

-- 5️⃣ CRIAR POLICIES SUPER PERMISSIVAS (sobrescrever as antigas)
DROP POLICY IF EXISTS "anyone can read" ON public.politicas_acesso;
DROP POLICY IF EXISTS "anyone can insert" ON public.politicas_acesso;
DROP POLICY IF EXISTS "anyone can update" ON public.politicas_acesso;
DROP POLICY IF EXISTS "anyone can delete" ON public.politicas_acesso;
DROP POLICY IF EXISTS "public read policies" ON public.politicas_acesso;

CREATE POLICY "read_all" ON public.politicas_acesso FOR SELECT USING (true);
CREATE POLICY "insert_all" ON public.politicas_acesso FOR INSERT WITH CHECK (true);
CREATE POLICY "update_all" ON public.politicas_acesso FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "delete_all" ON public.politicas_acesso FOR DELETE USING (true);

-- 6️⃣ CONFIRMAR RESULTADO
SELECT COUNT(*) as total, STRING_AGG(nivel_acesso, ', ' ORDER BY nivel_acesso) as niveis 
FROM public.politicas_acesso;
