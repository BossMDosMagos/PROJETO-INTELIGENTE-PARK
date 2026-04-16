-- =====================================================================
-- CORRIGIR PERMISSÃO DO OPERADOR - PODE FECHAR CAIXA
-- =====================================================================

UPDATE public.politicas_acesso
SET pode_fechar_caixa = true
WHERE nivel_acesso = 'OPERADOR';

-- ✅ Verificação
SELECT nivel_acesso, pode_fechar_caixa 
FROM public.politicas_acesso 
WHERE nivel_acesso = 'OPERADOR';
