import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { ExtensionConfig } from '@alfresco/adf-extensions';

@NgModule({
  imports: [CommonModule],
  declarations: [AboutComponent],
  exports: [AboutComponent],
  entryComponents: [AboutComponent]
})
export class AboutModule {
  static entry = AboutComponent;
  static AboutComponent = AboutComponent;

  getConfig(): ExtensionConfig {
    return {
      $id: 'about',
      $name: 'about',
      $version: '1.0.0',
      $vendor: 'Alfresco',
      $license: 'LGPL',
      $runtime: '1.8.0',

      routes: [
        {
          id: 'plugin.route.1',
          path: 'plugins/about',
          component: 'about#entry'
        }
      ]
    };
  }

  getName(): string {
    return 'About Module';
  }

  constructor() {
    console.log('Yay, about module loaded');
  }
}
