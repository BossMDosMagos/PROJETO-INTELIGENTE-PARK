// Teste de login Supabase
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({path: path.join(process.cwd(), '.env.local')});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testando Login Supabase...');
console.log('URL:', supabaseUrl);
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('1️⃣ Tentando login com: master@inteligente-park.com');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'master@inteligente-park.com',
      password: 'Senha@123'
    });

    if (error) {
      console.error('❌ Erro no login:', error.message);
      console.error('Details:', error);
      process.exit(1);
    }

    console.log('✅ Login bem-sucedido!');
    console.log('');
    console.log('👤 Usuário:');
    console.log('  - ID:', data.user.id);
    console.log('  - Email:', data.user.email);
    console.log('  - Provider:', data.user.app_metadata?.provider);
    console.log('');
    console.log('🔑 Token de sessão:');
    console.log('  - Tipo:', data.session.token_type);
    console.log('  - Acesso Token (primeiros 50 chars):', data.session.access_token.substring(0, 50) + '...');
    
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
})();
