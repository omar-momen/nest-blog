import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Data transfer object for creating a user via HTTP with validation rules
 */
export class CreateUserDto {
  /** Given name of the user (required, 3–96 characters) */
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstName!: string;

  /** Family name of the user (optional, same length rules when provided) */
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(96)
  lastName?: string;

  /** Unique email address used for login and notifications */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email!: string;

  /** Plain-text password; must meet complexity rules enforced by `@Matches` */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password!: string;
}
