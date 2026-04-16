-- =====================================================================
-- DIAGNÓSTICO: VERIFICAR SE RLS REALMENTE FOI DESABILITADO
-- =====================================================================

-- Ver status de RLS em cada tabela
SELECT 
    c.relname as tabela,
    CASE WHEN c.relrowsecurity = true THEN '🔴 ATIVO' ELSE '✅ INATIVO' END as rls_status
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' 
AND c.relkind = 'r'
AND c.relname IN ('politicas_acesso', 'unidades', 'perfis', 'tickets', 'mensalistas', 'tarifas', 'auditoria', 'sync_log')
ORDER BY c.relname;

-- Ver quais políticas ainda existem
SELECT policyname, tablename, schemaname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
