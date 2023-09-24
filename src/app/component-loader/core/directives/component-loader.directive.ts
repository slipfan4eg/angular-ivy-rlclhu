import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[componentLoader]',
})
export class ComponentLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
