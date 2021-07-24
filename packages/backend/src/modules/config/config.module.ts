import { Config, ConfigServiceImpl } from "./config.service";
import { DynamicModule, Global, Logger, Module } from "@nestjs/common";
import { configSymbol } from "./config.provider";
import { existsSync, readFileSync } from "fs";
import { inspect } from "util";

@Global()
@Module({})
export class ConfigModule {
  static forRoot(configPath: string | undefined): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: Logger,
          useClass: Logger,
        },
        {
          provide: configSymbol,
          inject: [Logger],
          useFactory: (logger: Logger): Config => {
            const defaultConfig: Config = {
              database: {
                url: "postgresql://postgres:postgres@database:5432/postgres",
              },
            };

            if (!configPath) {
              logger.warn(
                `Config path was not specified. Using default config: ${inspect(
                  defaultConfig,
                  { compact: false }
                )}`
              );
              return defaultConfig;
            }

            if (!existsSync(configPath)) {
              logger.warn(
                `Config does not exist at path ${configPath}. Using default config: ${inspect(
                  defaultConfig,
                  {
                    compact: false,
                  }
                )}`
              );
              return defaultConfig;
            }

            const configContent: string = readFileSync(configPath, {
              encoding: "utf-8",
            });

            try {
              return JSON.parse(configContent);
            } catch (e) {
              logger.warn(
                `Default config file has incorrect format. Perhaps it contains syntax error or empty`
              );
              throw e;
            }
          },
        },
        ConfigServiceImpl,
      ],
      exports: [ConfigServiceImpl],
    };
  }
}
