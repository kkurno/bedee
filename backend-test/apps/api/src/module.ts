import { AppConfigModule } from '@lib/app-config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppExceptionFilterModule } from '@lib/filter';
import { TodoApiModule } from './todo/todo.api.module';
import { HealthzApiModule } from './healthz/healthz.api.module';
import { SubtaskApiModule } from './subtask/subtask.api.module';
import { AppRequestLoggerMiddleware } from '@lib/middleware';

@Module({
  imports: [
    AppConfigModule,
    AppExceptionFilterModule,
    HealthzApiModule,
    TodoApiModule,
    SubtaskApiModule,
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppRequestLoggerMiddleware).forRoutes('*');
  }
}
