import { registerAs } from '@nestjs/config';
import { JwtConfigInterface } from './jwt-config.interface';

export default registerAs(
  'jwt',
  (): JwtConfigInterface => ({
    publicKey: process.env.JWT_PUBLIC_KEY,
    secret: process.env.JWT_SECRET,
    expires: parseInt(process.env.JWT_EXPIRES ?? '3600'),
    refreshExpires: parseInt(process.env.JWT_REFRESH_EXPIRES ?? '0'),
  }),
);
