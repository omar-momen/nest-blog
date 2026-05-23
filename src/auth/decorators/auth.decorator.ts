import { SetMetadata } from '@nestjs/common';

import { AuthType } from 'src/auth/enums/auth-type.enum';

import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

export const Auth = (...args: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, args);
