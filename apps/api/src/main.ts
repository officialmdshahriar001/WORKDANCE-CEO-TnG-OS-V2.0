import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const origins = [
    "http://localhost:3000",
    "https://workdance.netlify.app"
  ];

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 WORKDANCE CEO OS Engine running on port ${port}`);
}
bootstrap();
