-- =====================================================================
-- LIMPAR E RECREAR USUÁRIOS DO SUPABASE AUTH
-- =====================================================================

-- ⚠️ DELETAR usuários existentes (se causarem problema)
DELETE FROM auth.users WHERE email = 'master@inteligente-park.com';
DELETE FROM auth.users WHERE email = 'admin@inteligente-park.com';
DELETE FROM auth.users WHERE email = 'supervisor@inteligente-park.com';
DELETE FROM auth.users WHERE email = 'operador@inteligente-park.com';

-- ✅ Criar novos usuários via insert direto (pode não funcionar em todos os Supabase)
-- Alternativa: Use a função auth.create_user() se disponível
-- ou recrie manualmente no Dashboard

SELECT 'Usuários deletados. Execute admin endpoints para criar novos ou recrie no Dashboard.' as status;
