import { ExtensionConfig } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { PageLayoutModule } from '@alfresco/aca-shared';
import { AboutComponent } from './about.component';
import config from './about.config';
import { ExtensionListComponent } from './extension-list/extension-list.component';
import { LicenseListComponent } from './license-list/license-list.component';
import { ModuleListComponent } from './module-list/module-list.component';
import { PackageListComponent } from './package-list/package-list.component';
import { StatusListComponent } from './status-list/status-list.component';
import { AppConfigModule } from '@alfresco/adf-core';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule.forChild(),
    PageLayoutModule,
    AppConfigModule
  ],
  declarations: [
    AboutComponent,
    ExtensionListComponent,
    LicenseListComponent,
    ModuleListComponent,
    PackageListComponent,
    StatusListComponent
  ],
  exports: [AboutComponent],
  entryComponents: [AboutComponent]
})
export class AboutModule {
  static entry = AboutComponent;
  static AboutComponent = AboutComponent;

  getConfig(): ExtensionConfig {
    return config;
  }

  getName(): string {
    return 'About Module';
  }

  constructor() {
    console.log('Yay, about module loaded');
  }
}
