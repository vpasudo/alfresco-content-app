import { Component, OnDestroy, OnInit } from '@angular/core';
import { version, dependencies } from '../../../../package.json';
import { RepositoryInfo } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { ExtensionRef } from '@alfresco/adf-extensions';
import { ContentApiService } from '@alfresco/aca-shared';
import { map } from 'rxjs/operators';

@Component({
  selector: 'aca-about-plugin',
  styleUrls: ['about.component.scss'],
  templateUrl: 'about.component.html'
})
export class AboutComponent implements OnInit, OnDestroy {
  repository: RepositoryInfo;
  releaseVersion = version;
  extensions$: Observable<ExtensionRef[]>;
  dependencyEntries: Array<{ name: string; version: string }>;
  statusEntries: Array<{ property: string; value: string }>;
  licenseEntries: Array<{ property: string; value: string }>;

  constructor(private contentApi: ContentApiService) {}

  ngOnInit() {
    this.dependencyEntries = Object.keys(dependencies).map(key => {
      return {
        name: key,
        version: dependencies[key]
      };
    });

    this.contentApi
      .getRepositoryInformation()
      .pipe(map(node => node.entry.repository))
      .subscribe(repository => {
        this.repository = repository;

        this.statusEntries = Object.keys(repository.status).map(key => {
          return {
            property: key,
            value: repository.status[key]
          };
        });

        if (repository.license) {
          this.licenseEntries = Object.keys(repository.license).map(key => {
            return {
              property: key,
              value: repository.license[key]
            };
          });
        }
      });
  }

  ngOnDestroy() {}
}
