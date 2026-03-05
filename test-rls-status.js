// Teste direto: Tentar ler dados das tabelas (sem fazer login)
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({path: path.join(process.cwd(), '.env.local')});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('🔍 Teste 1: Ler politicas_acesso (sem autenticação)');
    const { data, error } = await supabase
      .from('politicas_acesso')
      .select('*');

    if (error) {
      console.error('❌ Erro:', error.message);
      console.error('Details:', error);
    } else {
      console.log('✅ Sucesso! Registros encontrados:', data.length);
      console.log(data);
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
})();
