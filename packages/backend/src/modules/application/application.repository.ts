import { EntityRepository, EntityManager } from "typeorm";
import { ApplicationRequestBody } from "@test-assignment/shared";

import { Application } from "../../entities/Application";

export class ApplicationRepositoryError extends Error {}

@EntityRepository(Application)
export class ApplicationRepository {
  constructor(private readonly manager: EntityManager) {}

  findLatestApplicationVersions(): Promise<Application[]> {
    return this.manager.query(`
        WITH max_version_application AS (
            SELECT application_id,
                   max(version) AS version
            FROM applications
            WHERE deleted_at IS NULL
            GROUP BY application_id
        )
        SELECT application_id AS "applicationId",
               description,
               version,
               metadata,
               data
        FROM applications a
        JOIN  max_version_application USING (application_id, version)
        WHERE a.deleted_at IS NULL
    `);
  }

  findAllVersionsOfApplication(applicationId: string): Promise<Application[]> {
    return this.manager.find(Application, {
      where: {
        applicationId,
      },
    });
  }

  async createOrUpdateApplication(
    { description, metadata, data }: ApplicationRequestBody,
    applicationId?: string
  ): Promise<Application> {
    if (applicationId) {
      type QueryResult = {
        applicationId: string;
        version: string;
      };

      const [highestApplicationVersion]: [QueryResult] =
        await this.manager.query(
          `
            SELECT application_id AS "applicationId",
                   max(version) AS version
            FROM applications
            WHERE deleted_at IS NULL and application_id = $1
            GROUP BY application_id
        `,
          [applicationId]
        );

      if (highestApplicationVersion.version === undefined) {
        throw new ApplicationRepositoryError(
          `Application with requested id ('${applicationId}') is not found`
        );
      }

      return this.manager.save(
        this.manager.create(Application, {
          applicationId,
          version: `${+highestApplicationVersion.version + 1}`,
          description,
          metadata,
          data,
        })
      );
    }

    return this.manager.save(
      this.manager.create(Application, {
        description,
        metadata,
        data,
      })
    );
  }

  async deleteApplication(applicationId: string): Promise<void> {
    await this.manager.query(
      `
      UPDATE applications
      SET deleted_at = now()
      WHERE application_id = $1
    `,
      [applicationId]
    );
  }
}
