-- =====================================================================
-- CRIAR USUÁRIOS DE TESTE DIRETAMENTE NO BANCO AUTH
-- =====================================================================

-- 1️⃣ CRIAR USUÁRIO MASTER
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'master@inteligente-park.com',
  crypt('Senha@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"nivel_acesso":"MASTER"}',
  false
);

-- 2️⃣ CRIAR USUÁRIO ADMIN
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@inteligente-park.com',
  crypt('Senha@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"nivel_acesso":"ADMIN"}',
  false
);

-- 3️⃣ CRIAR USUÁRIO SUPERVISOR
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'supervisor@inteligente-park.com',
  crypt('Senha@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"nivel_acesso":"SUPERVISOR"}',
  false
);

-- 4️⃣ CRIAR USUÁRIO OPERADOR
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_sent_at, confirmation_token, recovery_sent_at, recovery_token, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'operador@inteligente-park.com',
  crypt('Senha@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"nivel_acesso":"OPERADOR"}',
  false
);

-- 5️⃣ CONFIRMAR CRIAÇÃO
SELECT COUNT(*) as total_usuarios, STRING_AGG(email, ', ' ORDER BY email) as emails 
FROM auth.users 
WHERE email LIKE '%@inteligente-park.com%';
