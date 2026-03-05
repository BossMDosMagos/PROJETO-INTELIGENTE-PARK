-- =====================================================================
-- VERIFICAR STATUS DO RLS EM TODAS AS TABELAS
-- =====================================================================

SELECT 
    tablename,
    schemaname,
    (SELECT COUNT(*) FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as num_policies
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================================
-- Verificar quais tabelas têm RLS ativado
-- =====================================================================

SELECT 
    c.relname as table_name,
    CASE WHEN c.relrowsecurity = true THEN 'ATIVO' ELSE 'INATIVO' END as row_level_security
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' 
AND c.relkind = 'r'
ORDER BY c.relname;
