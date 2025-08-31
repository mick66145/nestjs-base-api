export interface JwtConfigInterface {
  publicKey?: string;
  secret?: string;
  expires: number;
  refreshExpires: number;
}
