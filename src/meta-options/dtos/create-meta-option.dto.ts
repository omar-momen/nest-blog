import { IsJSON, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for JSON meta option payloads attached to posts
 */
export class CreateMetaOptionDto {
  /** Serialized JSON blob stored alongside the owning post */
  @IsJSON()
  @IsNotEmpty()
  value!: string;
}
