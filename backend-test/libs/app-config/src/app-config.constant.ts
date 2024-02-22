import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export type Env = 'prod' | 'local';

export type AppConfigValues = {
  env: Env;
  apps: {
    api: {
      port: number;
      pathPrefix: string;
      numTrustedProxies: number;
      cors: CorsOptions;
    };
  };
};

export const ENV: Env = (process.env.APP_ENV as Env | undefined) ?? 'local';

export const APP_CONFIG_VALUES: AppConfigValues = {
  env: ENV,
  apps: {
    api: {
      port: process.env.API_PORT !== undefined ? Number(process.env.API_PORT) : 3001,
      pathPrefix: 'api',
      // Use "x + 1" formula to get the number of trusted proxies (x is a number of proxies)
      numTrustedProxies: process.env.NUM_TRUSTED_PROXIES !== undefined ? Number(process.env.NUM_TRUSTED_PROXIES) : 0 + 1,
      cors: {
        origin: ENV === 'local'
          ? ['*']
          : (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
        credentials: true,
      },
    },
  },
};
