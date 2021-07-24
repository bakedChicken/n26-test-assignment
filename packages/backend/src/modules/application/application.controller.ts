import { Controller, Get } from "@nestjs/common";
import { GetApplicationResponse } from "@test-assignment/shared/application";

@Controller("/applications")
export class ApplicationController {
  @Get()
  async getApplicationList(): Promise<GetApplicationResponse[]> {
    return Promise.resolve([]);
  }
}
