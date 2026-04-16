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
  const sqls = [
    `ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS tolerancia_inicial INTEGER DEFAULT 30`,
    `ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS cobrar_adicional_teto BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS valor_teto_horas INTEGER DEFAULT 12`,
    `ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS fracao_hora_minutos INTEGER DEFAULT 30`,
    `ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS valor_primeira_hora DECIMAL(10, 2) DEFAULT 15.00`,
    `ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS cobranca_moto BOOLEAN DEFAULT TRUE`,
    `ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS percentual_moto DECIMAL(5, 2) DEFAULT 50.00`
  ];

  for (const sql of sqls) {
    try {
      await execSQL(sql);
      console.log('✅', sql.substring(0, 60));
    } catch (e) {
      console.log('⚠️', e.message.substring(0, 80));
    }
  }
  
  // Atualizar valores
  await execSQL(`UPDATE configuracoes SET tolerancia_inicial = 30, cobrar_adicional_teto = FALSE, valor_teto_horas = 12, fracao_hora_minutos = 30, valor_primeira_hora = 15.00 WHERE id = 1`);
  console.log('✅ Valores atualizados');
  
  console.log('✅ Campos de pricing adicionados!');
}

main().catch(console.error);
