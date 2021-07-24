import { NestFactory, NestApplication } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApplicationModule } from "./modules/application";
import { ConfigModule, ConfigServiceImpl } from "./modules/config";

async function bootstrap() {
  @Module({
    imports: [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule.forRoot(process.env.CONFIG_PATH)],
        inject: [ConfigServiceImpl],
        useFactory: (config: ConfigServiceImpl): TypeOrmModule =>
          config.getTypeOrmConfig(__dirname),
      }),
      ApplicationModule,
    ],
  })
  class AppModule {}

  const app: NestApplication = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  await app.listen(80);
}

bootstrap().catch(console.error);
