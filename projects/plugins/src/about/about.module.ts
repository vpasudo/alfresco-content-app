import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AboutComponent],
  entryComponents: [AboutComponent]
})
export class AboutModule {
  static entry = AboutComponent;
  static AboutComponent = AboutComponent;

  constructor() {}
}
