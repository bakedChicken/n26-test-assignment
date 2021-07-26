export type Application = {
  readonly id: string;
  readonly version: string;
  readonly description: string;
  readonly metadata: Record<string, unknown>;
  readonly data: Record<string, unknown>;
};

export type GetApplicationResponse = Application;

export type GetApplicationsResponse = Application[];

export class ApplicationRequestBody {
  readonly description!: string;
  readonly metadata?: Record<string, unknown>;
  readonly data?: Record<string, unknown>;
}
