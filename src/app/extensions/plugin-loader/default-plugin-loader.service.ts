/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable, NgModuleFactory, Injector } from '@angular/core';
import {
  PluginLoaderService,
  PluginsConfig
} from '@alfresco/aca-shared/extensions';
import { PLUGIN_EXTERNALS_MAP } from './plugin-externals';
import { HttpClient } from '@angular/common/http';
import { ExtensionConfig } from '@alfresco/adf-extensions';

@Injectable({
  providedIn: 'root'
})
export class DefaultPluginLoaderService extends PluginLoaderService {
  configPath = `${document.location.origin}/assets/plugins/plugins.config.json`;
  config: PluginsConfig;

  constructor(private http: HttpClient, private injector: Injector) {
    super();
  }

  async load() {
    const config = await this.http
      .get<PluginsConfig>(this.configPath)
      .toPromise();

    return this.setup(config);
  }

  async setup(config: PluginsConfig) {
    this.config = config;
  }

  async getAutoPlugins(): Promise<ExtensionConfig[]> {
    const autoLoad = Object.keys(this.config)
      .filter(key => this.config[key].load === 'auto')
      .map(key => this.loadModule(key));

    const result: ExtensionConfig[] = [];

    await Promise.all(autoLoad).then((modules: any[]) => {
      if (modules && modules.length > 0) {
        for (const moduleFactory of modules) {
          const moduleRef = moduleFactory.create(this.injector);

          if (typeof moduleRef.instance.getConfig === 'function') {
            const pluginConfig: ExtensionConfig = moduleRef.instance.getConfig();

            if (pluginConfig) {
              result.push(pluginConfig);
            }
          }
        }
      }
    });

    return result;
  }

  provideExternals() {
    Object.keys(PLUGIN_EXTERNALS_MAP).forEach(externalKey =>
      window.define(externalKey, [], () => PLUGIN_EXTERNALS_MAP[externalKey])
    );
  }

  loadModule<T>(pluginName: string): Promise<NgModuleFactory<T>> {
    const { config } = this;
    if (!config[pluginName]) {
      throw Error(`Can't find appropriate plugin`);
    }

    const depsPromises = (config[pluginName].deps || []).map(dep => {
      return window.System.import(config[dep].path).then(m => {
        window['define'](dep, [], () => m.default);
      });
    });

    return Promise.all(depsPromises).then(() => {
      return window.System.import(config[pluginName].path).then(
        module => module.default.default
      );
    });
  }
}
