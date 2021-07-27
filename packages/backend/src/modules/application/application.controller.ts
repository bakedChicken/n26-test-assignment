import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import {
  ApplicationRequestBody,
  GetApplicationResponse,
} from "@test-assignment/shared";

import { ApplicationService } from "./application.service";

@Controller("/applications")
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  getApplicationList(): Promise<GetApplicationResponse[]> {
    return this.applicationService.getLatestApplicationVersions();
  }

  @Get(":applicationId")
  getAllVersionsOfApplication(
    @Param("applicationId") applicationId: string
  ): Promise<GetApplicationResponse[]> {
    return this.applicationService.getAllVersionsOfApplication(applicationId);
  }

  @Post()
  createApplication(
    // This input could be sanitized using class-validator but I ran out of time
    @Body() requestBody: ApplicationRequestBody
  ): Promise<GetApplicationResponse> {
    return this.applicationService.createApplication(requestBody);
  }

  @Put(":applicationId")
  updateApplication(
    @Param("applicationId") applicationId: string,
    @Body() requestBody: ApplicationRequestBody
  ): Promise<GetApplicationResponse> {
    return this.applicationService.updateApplication(
      applicationId,
      requestBody
    );
  }

  @Delete(":applicationId")
  deleteApplication(
    @Param("applicationId") applicationId: string
  ): Promise<void> {
    return this.applicationService.deleteApplication(applicationId);
  }
}
