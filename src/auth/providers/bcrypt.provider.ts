import { HashingProvider } from './hashing.provider';

import * as bcrypt from 'bcrypt';

export class BcryptProvider implements HashingProvider {
  public async hashPassword(password: string): Promise<string> {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    return await bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
