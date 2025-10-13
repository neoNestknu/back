export const NOTIFICATION_SERVICE_CLIENT = 'NOTIFICATION_SERVICE_CLIENT';

export const POSTGRES = 'postgres';
export const SEQUELIZE = 'SEQUELIZE';

export const USER_REPOSITORY = 'user_repository';
export const LINK_REPOSITORY = 'link_repository';

export const REDIS = 'REDIS';

export const KEYS = {
  production: {
    public_key: 'public.pem',
    private_key: 'private.pem',
  },
  development: {
    public_key: 'dev_public.pem',
    private_key: 'dev_private.pem',
  },
};

export const enum TYPE_MAIL {
  ACTIVATE_ACCOUNT = 'ACTIVATE_ACCOUNT',
  NOTIFICATION = 'NOTIFICATION',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}
