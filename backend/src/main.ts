import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors = validationErrors.flatMap((error) => {
          const field = error.property;
          const constraints = Object.values(error.constraints ?? {});
          return constraints.map((message) => ({ field, message }));
        });

        return new BadRequestException({
          statusCode: 400,
          errors,
        });
      },
    }),
  );

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
