-- =====================================================================
-- VERIFICAR QUAL REGISTRO EXISTE E INSERIR OS QUE FALTAM
-- =====================================================================

-- 1️⃣ Ver qual registro está lá
select nivel_acesso from public.politicas_acesso;

-- 2️⃣ Inserir os que faltam (usando ON CONFLICT para evitar duplicatas)
insert into public.politicas_acesso 
(nivel_acesso, pode_criar_unidade, pode_editar_unidade, pode_deletar_unidade, pode_ver_financeiro_geral, pode_ver_financeiro_unidade, pode_registrar_entrada, pode_registrar_saida, pode_cancelar_ticket, pode_gerenciar_mensalistas, pode_gerar_relatorios, pode_fechar_caixa, pode_ver_auditoria, pode_editar_tarifa, pode_exportar_dados, pode_importar_dados, pode_gerenciar_usuarios, pode_acessar_operador, pode_acessar_admin)
values 
('MASTER', true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true),
('ADMIN', false, true, false, false, true, true, true, true, true, true, true, false, true, true, false, false, true, false),
('SUPERVISOR', false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, false),
('OPERADOR', false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, true, false)
on conflict (nivel_acesso) do nothing;

-- 3️⃣ Confirmar contagem final
select count(*) as total_registros, string_agg(nivel_acesso, ', ' order by nivel_acesso) as niveis from public.politicas_acesso;
