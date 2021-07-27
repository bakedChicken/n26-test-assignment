import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("applications")
export class Application {
  @PrimaryGeneratedColumn("uuid", { name: "application_id" })
  readonly applicationId!: string;

  @PrimaryColumn("numeric")
  readonly version!: string;

  @Column()
  readonly description!: string;

  @Column("jsonb", { nullable: true })
  readonly metadata!: string;

  @Column("jsonb", { nullable: true })
  readonly data!: string;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
