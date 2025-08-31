import { Controller, Get, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppConfigInterface } from './_libs/app/app-config.interface';

@Controller('')
export class AppController implements OnApplicationBootstrap {
  private appConfig!: AppConfigInterface;
  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    this.appConfig = this.configService.getOrThrow<AppConfigInterface>('app');
  }

  @ApiExcludeEndpoint()
  @Get()
  info() {
    return {
      appName: this.appConfig.name,
      version: this.appConfig.version,
    };
  }
}
