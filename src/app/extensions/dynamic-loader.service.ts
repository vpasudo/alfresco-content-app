/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import {
  ExtensionLoaderService,
  sortByOrder,
  mergeObjects,
  ExtensionConfig
} from '@alfresco/adf-extensions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DynamicExtensionLoaderService extends ExtensionLoaderService {
  constructor(http: HttpClient) {
    super(http);
  }

  load(
    configPath: string,
    pluginsPath: string,
    extensions?: ExtensionConfig[]
  ): Promise<ExtensionConfig> {
    return new Promise<any>(resolve => {
      this.loadConfig(configPath, 0).then(result => {
        if (result) {
          let config = result.config;

          const override = sessionStorage.getItem('app.extension.config');
          if (override) {
            config = JSON.parse(override);
          }

          if (config.$references && config.$references.length > 0) {
            const plugins = config.$references.map((name, idx) =>
              this.loadConfig(`${pluginsPath}/${name}`, idx)
            );

            Promise.all(plugins).then(results => {
              const configs = results
                .filter(entry => entry)
                .sort(sortByOrder)
                .map(entry => entry.config);

              if (extensions && extensions.length > 0) {
                configs.push(...extensions);
              }

              if (configs.length > 0) {
                config = mergeObjects(config, ...configs);
              }

              config = {
                ...config,
                ...this.getMetadata(result.config),
                $references: configs.map(ext => this.getMetadata(ext))
              };

              resolve(config);
            });
          } else {
            resolve(config);
          }
        }
      });
    });
  }
}
