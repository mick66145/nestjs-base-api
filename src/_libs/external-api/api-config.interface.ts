export type ApiConfig = Record<string, ApiConfigServiceInterface>;

export interface ApiConfigServiceInterface {
  apiKeyHeader?: string;
  apiKey?: string;
  baseUrl?: string;
}
