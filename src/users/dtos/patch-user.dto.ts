import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

/**
 * Partial update payload for user fields (all properties optional)
 */
export class PatchUserDto extends PartialType(CreateUserDto) {}
