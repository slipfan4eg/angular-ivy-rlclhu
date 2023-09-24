import { Component, VERSION } from '@angular/core';
import { Component1Component } from './components/component1/component1.component';
import { Component2Component } from './components/component2/component2.component';
import { Component3Component } from './components/component3/component3.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ComponentLoader';
  showComponents: boolean = true;
  components: any[] = [
    {
      component: Component1Component,
      outputEvents: {},
    },
    {
      component: Component2Component,
      params: {
        name: 'Component2 is the best component',
      },
    },
    {
      component: Component3Component,
    },
  ];

  toggleComponents() {
    this.showComponents = !this.showComponents;
  }
}
