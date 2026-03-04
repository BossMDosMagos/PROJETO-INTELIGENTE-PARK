console.log('🔵 TestImport.jsx iniciando...');

try {
  console.log('Tentando importar App.jsx...');
  const AppModule = require('./App.jsx');
  console.log('✅ App.jsx importado com sucesso!');
  console.log('Conteúdo:', Object.keys(AppModule));
} catch (error) {
  console.error('❌ Erro ao importar App.jsx:');
  console.error('Mensagem:', error.message);
  console.error('Stack:', error.stack);
}

export default function TestImport() {
  return <div>Test</div>;
}
