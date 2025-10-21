import { ConfigType } from '@nestjs/config';
import { databaseProviders } from './database.provider';
import appConfig from '../../config/app.config';
import postgresConfig from '../../config/postgres.config';

export async function testConnection(
  postgresConf: ConfigType<typeof postgresConfig>,
  appConf: ConfigType<typeof appConfig>,
): Promise<void> {
  try {
    const sequelize = await databaseProviders[0].useFactory(
      postgresConf,
      appConf,
    );

    // Testing the connection
    await sequelize.authenticate();
    console.log('✓ Connection to PostgreSQL successful');

    // Check the availability of all registered models
    const models = sequelize.models;
    console.log('Registered models:', Object.keys(models));

    return;
  } catch (error) {
    console.error('✗ Error connecting to PostgreSQL:');
    console.error('Error type:', error.name);
    console.error('Message:', error.message);
    // Display additional information for diagnostics
    if (error.original) {
      console.error('Original error:', {
        code: error.original.code,
        detail: error.original.detail,
      });
    }
    return;
  }
}
