import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import { AppConfigService } from '@lib/app-config';
import { NestJsLogger } from '@lib/logger';
import { ApiModule } from './module';
import { DatabaseStorage } from '@lib/database/database.storage';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
    logger: new NestJsLogger(),
  });

  const appConfigService = app.get(AppConfigService);

  app.setGlobalPrefix(appConfigService.values.apps.api.pathPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.set('trust proxy', appConfigService.values.apps.api.numTrustedProxies);

  app.enableCors(appConfigService.values.apps.api.cors);

  /*
    #CONSIDERATION: Security things
    - set security-related HTTP headers to response objects
    ...
  */

  await app.listen(appConfigService.values.apps.api.port);
}
bootstrap();
