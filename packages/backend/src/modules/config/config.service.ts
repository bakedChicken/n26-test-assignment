import { Inject, Injectable } from "@nestjs/common";
import { configSymbol } from "./config.provider";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { resolve } from "path";

export type Config = {
  database: {
    url: string;
  };
};

export interface ConfigService {
  getTypeOrmConfig(dataPath: string): TypeOrmModuleOptions;
}

@Injectable()
export class ConfigServiceImpl implements ConfigService {
  constructor(@Inject(configSymbol) private readonly config: Config) {}

  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  getTypeOrmConfig(dataPath: string): TypeOrmModuleOptions {
    return {
      type: "postgres",
      url: this.config.database.url,
      logging: !this.isProduction,
      migrationsRun: !this.isProduction,
      migrations: [resolve(dataPath, "migrations", "**.js")],
      entities: [resolve(dataPath, "entities", "**.js")],
    };
  }
}
