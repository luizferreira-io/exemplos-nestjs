import { dotEnvSchema } from '../schemas/dotEnv.schema';

export function validateEnv(config: Record<string, unknown>) {
  const { error, value } = dotEnvSchema.validate(config, {
    abortEarly: false, // Mostra todos os erros
    allowUnknown: true, // Permite outras variáveis
    stripUnknown: false, // Mantém outras variáveis
  });

  if (error) {
    console.error('\n\n');
    console.error('--------------------------------------------------------------------------------');
    console.error('🚨 ERRO DE CONFIGURAÇÃO!');
    console.error('--------------------------------------------------------------------------------');
    console.error('Verifique as variáveis de ambiente no arquivo .env.');
    console.error('\n');
    console.error('📋 Problemas encontrados:');

    error.details.forEach((detail, index) => {
      const field = detail.path.join('.');
      const message = detail.message;
      console.error(`   ${index + 1}. ${field}: ${message}`);
    });

    console.error('\n');
    console.error('💡 Verifique se:');
    console.error('   - todas as variáveis obrigatórias estão preenchidas no arquivo .env.');
    console.error('   - existem variáveis no arquivo .env que não são esperadas pela aplicação.');
    console.error('   - a tipagem dos valores está correta.');
    console.error('   - está tudo de acordo com a documentação');
    console.error('--------------------------------------------------------------------------------');
    console.error('\n\n');

    //throw new Error('Configuração de ambiente inválida');
    process.exit(1);
  }

  return value;
}
