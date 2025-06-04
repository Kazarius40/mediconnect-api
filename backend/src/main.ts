import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config';

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);

  // await app.listen(process.env.PORT ?? 3000);
  const port = process.env.PORT;
  if (!port) {
    throw new Error('PORT is not defined in environment variables');
  }
  await app.listen(port);
}
