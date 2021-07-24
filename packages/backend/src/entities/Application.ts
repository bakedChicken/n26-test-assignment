import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("applications")
export class Application {
  @PrimaryGeneratedColumn("uuid", { name: "application_id" })
  readonly applicationId!: string;
}
