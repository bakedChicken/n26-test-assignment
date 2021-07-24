export type GetApplicationResponse = {
  readonly id: string;
  readonly meta: {
    readonly version: number;
    readonly name: string;
    readonly author: string;
  }[];
};
