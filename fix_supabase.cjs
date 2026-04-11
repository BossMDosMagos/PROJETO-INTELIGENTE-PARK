const https = require('https');

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bWJzbWF3ZmJ6YWN6a2x4ZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTIzODgsImV4cCI6MjA4ODIyODM4OH0.aNx8DCffzuxc7S6yEACCDuS2byuQf8SQzzSfJPA3RQI';

function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'pumbsmawfbzaczklxeog.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/pg_execute_query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🚀 Criando tabelas e colunas faltantes...\n');

  // 1. Adicionar coluna email na tabela perfis
  const sqls = [
    `ALTER TABLE perfis ADD COLUMN IF NOT EXISTS email TEXT`,
    
    // 2. Criar tabela entradas_saidas
    `CREATE TABLE IF NOT EXISTS entradas_saidas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      placa VARCHAR(8) NOT NULL,
      placa_normalizada VARCHAR(8),
      modelo VARCHAR(50),
      cor VARCHAR(50),
      tipo VARCHAR(20) DEFAULT 'carro',
      hora_entrada TIMESTAMP WITH TIME ZONE NOT NULL,
      hora_saida TIMESTAMP WITH TIME ZONE,
      valor DECIMAL(10, 2) DEFAULT 0,
      is_mensalista BOOLEAN DEFAULT false,
      permanencia_ms BIGINT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      synced BOOLEAN DEFAULT false
    )`,
    
    // 3. Criar índices
    `CREATE INDEX IF NOT EXISTS idx_entradas_saidas_placa ON entradas_saidas(placa)`,
    `CREATE INDEX IF NOT EXISTS idx_entradas_saidas_hora_entrada ON entradas_saidas(hora_entrada DESC)`,
    
    // 4. Desabilitar RLS temporariamente para testes
    `ALTER TABLE entradas_saidas DISABLE ROW LEVEL SECURITY`
  ];

  for (const sql of sqls) {
    try {
      await execSQL(sql);
      console.log('✅', sql.substring(0, 80));
    } catch (e) {
      console.log('⚠️', e.message.substring(0, 100));
    }
  }
  
  console.log('\n✅ Estrutura do Supabase corrigida!');
}

main().catch(console.error);
