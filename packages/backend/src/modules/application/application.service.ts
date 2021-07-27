import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ApplicationRequestBody,
  GetApplicationResponse,
  GetApplicationsResponse,
} from "@test-assignment/shared";
import { Connection } from "typeorm";

import { Application } from "../../entities/Application";
import {
  ApplicationRepository,
  ApplicationRepositoryError,
} from "./application.repository";

function mapEntityToResponse(entity: Application): GetApplicationResponse {
  return {
    id: entity.applicationId,
    version: entity.version,
    description: entity.description,
    metadata: entity.metadata ? JSON.parse(entity.metadata) : {},
    data: entity.data ? JSON.parse(entity.data) : {},
  };
}

@Injectable()
export class ApplicationService {
  constructor(private readonly connection: Connection) {}

  async getLatestApplicationVersions(): Promise<GetApplicationsResponse> {
    const applications = await this.connection
      .getCustomRepository(ApplicationRepository)
      .findLatestApplicationVersions();

    return applications.map(mapEntityToResponse);
  }

  async getAllVersionsOfApplication(
    applicationId: string
  ): Promise<GetApplicationsResponse> {
    const applications = await this.connection
      .getCustomRepository(ApplicationRepository)
      .findAllVersionsOfApplication(applicationId);

    return applications.map(mapEntityToResponse);
  }

  async createApplication(
    requestBody: ApplicationRequestBody
  ): Promise<GetApplicationResponse> {
    const createdApplication: Application = await this.connection
      .getCustomRepository(ApplicationRepository)
      .createOrUpdateApplication(requestBody);

    return mapEntityToResponse(createdApplication);
  }

  async updateApplication(
    applicationId: string,
    requestBody: ApplicationRequestBody
  ): Promise<GetApplicationResponse> {
    try {
      const updatedApplication = await this.connection
        .getCustomRepository(ApplicationRepository)
        .createOrUpdateApplication(requestBody, applicationId);

      return mapEntityToResponse(updatedApplication);
    } catch (err) {
      if (err instanceof ApplicationRepositoryError) {
        throw new NotFoundException();
      }

      throw err;
    }
  }

  async deleteApplication(applicationId: string): Promise<void> {
    await this.connection
      .getCustomRepository(ApplicationRepository)
      .deleteApplication(applicationId);
  }
}
