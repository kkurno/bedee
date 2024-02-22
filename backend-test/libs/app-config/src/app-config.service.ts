import { Injectable, Scope } from '@nestjs/common';
import { AppConfigValues, APP_CONFIG_VALUES } from './app-config.constant';

@Injectable({
  scope: Scope.DEFAULT,
})
export class AppConfigService {
  private _values = APP_CONFIG_VALUES;

  private async onModuleInit(): Promise<void> {
    this._values = {
      ...this._values,
      // additional configurations value that depend on any external services
    };
  }

  get values(): AppConfigValues {
    return this._values;
  }
}
