import { Sequelize } from 'sequelize-typescript';
import { ConfigType } from '@nestjs/config';
import { POSTGRES, SEQUELIZE } from '../../constants/constants';
import postgresConfig from '../../config/postgres.config';
import appConfig from '../../config/app.config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    inject: [postgresConfig.KEY, appConfig.KEY],
    useFactory: async (
      postgresConf: ConfigType<typeof postgresConfig>,
      appConf: ConfigType<typeof appConfig>,
    ) => {
      const env = appConf.node_env;
      let schema = 'public';
      if (env === 'development') {
        schema = 'test';
      }
      const sequelize = new Sequelize({
        logging: console.log,
        dialect: POSTGRES,
        host: postgresConf.host,
        port: postgresConf.port,
        username: postgresConf.user,
        password: postgresConf.password,
        database: postgresConf.db_name,
        schema: schema,
      });
      sequelize.addModels([]);
      if (appConf.node_env == 'test') {
        await sequelize.sync({ force: true });
      }
      return sequelize;
    },
  },
];
