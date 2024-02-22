import { DatabaseModule } from '@lib/database';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggerModule, NestJsLogger, TransientLogger } from '@lib/logger';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
  ],
})
class ScriptModule { }

export default async function run() {
  const app = await NestFactory.createApplicationContext(ScriptModule, {
    logger: new NestJsLogger(),
  });
  const transientLogger = await app.resolve(TransientLogger);
  const dbConnection = app.get<Connection>(getConnectionToken());

  transientLogger.log({ message: 'drop database...' });

  await dbConnection.dropDatabase();

  transientLogger.log({ message: 'done.' });

  await app.close();

  console.info('app closed!');
}
