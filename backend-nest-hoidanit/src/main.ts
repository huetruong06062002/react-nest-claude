import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { globalValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(globalValidationPipe);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.get<string>('app.corsOrigin') ?? 'http://localhost:5173',
    credentials: true,
  });

  const port = config.get<number>('app.port') ?? 3000;

  await app.listen(port);
  console.log(`Application running on http://localhost:${port}/api/v1`);
}
bootstrap();
