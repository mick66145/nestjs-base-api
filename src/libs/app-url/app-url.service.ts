import { Injectable, OnApplicationBootstrap, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppProjectConfigInterface } from 'src/config/app-project/app-project-config.interface';
import { urlGenerateByController } from '../utils/helper/url-helper';
import { abort } from 'src/_libs/api-response/abort.util';
import { AppConfigInterface } from 'src/_libs/app/app-config.interface';

type appUrlConfig = Pick<
  AppProjectConfigInterface,
  'internalUrl' | 'externalUrl'
>;

const urlType = {
  internalUrl: 'APP_INTERNAL_URL',
  externalUrl: 'APP_EXTERNAL_URL',
} as const;

@Injectable()
export class AppUrlService implements OnApplicationBootstrap {
  private appUrlConfig!: appUrlConfig;
  private globalPrefix!: string;

  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    try {
      const { internalUrl, externalUrl } =
        this.configService.getOrThrow<AppProjectConfigInterface>('app-project');
      this.appUrlConfig = { internalUrl, externalUrl };
    } catch {
      throw new Error('尚未設定app-project或配置不正確');
    }

    const { globalPrefix } =
      this.configService.getOrThrow<AppConfigInterface>('app');

    this.globalPrefix = globalPrefix;
  }

  getAppUrl(type: keyof appUrlConfig) {
    return this.appUrlConfig[type];
  }

  generateUrl<T>(
    type: keyof appUrlConfig,
    controller: Type<T>,
    method: keyof T,
    options?: {
      query?: Record<string, string>;
      pathParams?: Record<string, string>;
    },
  ) {
    const appUrl = this.getAppUrl(type);

    if (appUrl === undefined) {
      abort(`尚未設定${urlType[type]}`);
    }

    return urlGenerateByController(
      [appUrl, this.globalPrefix].filter(Boolean).join('/'),
      controller,
      method,
      options,
    );
  }
}
