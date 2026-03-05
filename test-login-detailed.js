// Teste detalhado de login com mais logging
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({path: path.join(process.cwd(), '.env.local')});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuração:');
console.log('URL:', supabaseUrl);
console.log('Key começa com:', supabaseKey?.substring(0, 30) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('\n🔍 Teste 1: Obter sessão atual');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('  Resultado:', sessionError ? '❌ Erro' : '✅ OK (sem sessão)');
    if (sessionError) console.log('  Erro:', sessionError.message);

    console.log('\n🔐 Teste 2: Tentar login');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'master@inteligente-park.com',
      password: 'Senha@123'
    });

    if (loginError) {
      console.log('  ❌ ERRO NO LOGIN');
      console.log('  Mensagem:', loginError.message);
      console.log('  Status:', loginError.status);
      console.log('  Code:', loginError.code);
      console.log('  Nome erro:', loginError.name);
      console.log('\nStackTrace completo:');
      console.log(loginError);
    } else {
      console.log('  ✅ Login bem-sucedido!');
      console.log('  User ID:', loginData.user?.id);
      console.log('  Email:', loginData.user?.email);
    }

  } catch (err) {
    console.error('❌ EXCEÇÃO:', err.message);
    console.error(err);
  }
})();
