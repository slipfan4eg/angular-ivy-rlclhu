import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentLoaderComponent } from './component-loader.component';
import { ComponentLoaderDirective } from './core/directives/component-loader.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ComponentLoaderComponent, ComponentLoaderDirective],
  exports: [ComponentLoaderComponent],
})
export class ComponentLoaderModule {}
