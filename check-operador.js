// Verificar dados do OPERADOR na tabela politicas_acesso
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Ler ambiente
dotenv.config({path: path.join(process.cwd(), '.env.local')});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl);
console.log('Key presente:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    // Buscar todos os registros de politicas_acesso
    const { data, error } = await supabase
      .from('politicas_acesso')
      .select('*');
    
    if (error) {
      console.error('❌ Erro ao buscar:', error.message);
      process.exit(1);
    }

    console.log('\n✅ Registros em politicas_acesso:');
    console.log(JSON.stringify(data, null, 2));

    // Destaque para OPERADOR
    const operador = data.find(p => p.nome_politica?.toUpperCase() === 'OPERADOR');
    if (operador) {
      console.log('\n🔍 OPERADOR atual:');
      console.log(JSON.stringify(operador, null, 2));
    }
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
})();
