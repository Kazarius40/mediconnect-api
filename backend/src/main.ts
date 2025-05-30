import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
