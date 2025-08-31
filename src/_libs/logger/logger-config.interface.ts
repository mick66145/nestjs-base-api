export type LoggerConfig = Record<string, LoggerConfigServiceInterface>;

export interface LoggerConfigServiceInterface {
  level: string;
  maxSize: string;
  maxFiles: string;
  fileSilent: boolean;
  consoleSilent: boolean;
}
