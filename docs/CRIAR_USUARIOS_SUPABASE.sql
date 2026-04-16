/**
 * INSTRUÇÕES PARA CRIAR USUÁRIOS DE TESTE NO SUPABASE
 * 
 * OPÇÃO 1: Via Supabase Dashboard (Recomendado para primeira vez)
 * ================================================================
 * 
 * 1. Acesse seu projeto Supabase: https://supabase.com/dashboard
 * 2. Vá para Authentication → Users
 * 3. Clique em "Add user" → "Email with password"
 * 4. Crie cada usuário abaixo:
 * 
 * MASTER (Full Access):
 *   Email: master@inteligente-park.com
 *   Senha: Senha@123 (mude em produção!)
 * 
 * ADMIN (Administrador):
 *   Email: admin@inteligente-park.com
 *   Senha: Senha@123 (mude em produção!)
 * 
 * SUPERVISOR (Supervisor):
 *   Email: supervisor@inteligente-park.com
 *   Senha: Senha@123 (mude em produção!)
 * 
 * OPERADOR (Operador):
 *   Email: operador@inteligente-park.com
 *   Senha: Senha@123 (mude em produção!)
 * 
 * 
 * OPÇÃO 2: Via SQL (SQL Editor no Supabase)
 * ==========================================
 * 
 * Após criar os usuários com email/senha, execute este SQL para
 * criar os perfis associados.
 * 
 * Execute no SQL Editor do seu projeto Supabase:
 */

-- Obter os UUIDs dos usuários (executar primeiro sem as inserções abaixo)
-- SELECT id, email FROM auth.users';

-- Depois substituir os UUIDs abaixo pelos reais e executar:

-- Inserir perfil MASTER
INSERT INTO public.perfis (
  usuario_id,
  nome_completo,
  telefone,
  unidade_id,
  nivel_acesso
) VALUES (
  'UUID_DO_MASTER_AQUI',
  'Master Administrator',
  '+55 11 9999-9999',
  NULL,
  'MASTER'
) ON CONFLICT (usuario_id) DO UPDATE SET
  nivel_acesso = 'MASTER';

-- Inserir perfil ADMIN
INSERT INTO public.perfis (
  usuario_id,
  nome_completo,
  telefone,
  unidade_id,
  nivel_acesso
) VALUES (
  'UUID_DO_ADMIN_AQUI',
  'Administrador PQ',
  '+55 11 9998-8888',
  NULL,
  'ADMIN'
) ON CONFLICT (usuario_id) DO UPDATE SET
  nivel_acesso = 'ADMIN';

-- Inserir perfil SUPERVISOR
INSERT INTO public.perfis (
  usuario_id,
  nome_completo,
  telefone,
  unidade_id,
  nivel_acesso
) VALUES (
  'UUID_DO_SUPERVISOR_AQUI',
  'Supervisor Turno',
  '+55 11 9997-7777',
  NULL,
  'SUPERVISOR'
) ON CONFLICT (usuario_id) DO UPDATE SET
  nivel_acesso = 'SUPERVISOR';

-- Inserir perfil OPERADOR
INSERT INTO public.perfis (
  usuario_id,
  nome_completo,
  telefone,
  unidade_id,
  nivel_acesso
) VALUES (
  'UUID_DO_OPERADOR_AQUI',
  'Operador João',
  '+55 11 9996-6666',
  NULL,
  'OPERADOR'
) ON CONFLICT (usuario_id) DO UPDATE SET
  nivel_acesso = 'OPERADOR';


/**
 * COMO OBTER OS UUIDs DOS USUÁRIOS
 * ================================
 * 
 * No Supabase SQL Editor, execute:
 */
SELECT id, email FROM auth.users;

/**
 * Copie os UUIDs (a coluna 'id') e substitua nos INSERTs acima.
 * Depois execute os INSERTs.
 */

/**
 * TESTAR AUTENTICAÇÃO
 * ===================
 * 
 * Após criar os usuários, na aplicação:
 * 1. Acesse http://localhost:3001/login
 * 2. Teste com cada credencial:
 *    - master@inteligente-park.com / Senha@123
 *    - admin@inteligente-park.com / Senha@123
 *    - supervisor@inteligente-park.com / Senha@123
 *    - operador@inteligente-park.com / Senha@123
 * 
 * Se login for bem-sucedido, você verá a mensagem de sucesso
 * e será redirecionado para a home.
 */
