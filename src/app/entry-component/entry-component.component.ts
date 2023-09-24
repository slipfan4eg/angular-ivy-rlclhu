import { Component, Input, OnInit } from '@angular/core';
import {
  ComponentEventEmittedEvent,
  ComponentLoadedEvent,
  ComponentLoadErrorEvent,
} from '../component-loader/core/interfaces/event-types';

@Component({
  selector: 'app-entry-component',
  templateUrl: './entry-component.component.html',
  styleUrls: ['./entry-component.component.css'],
})
export class EntryComponentComponent implements OnInit {
  @Input() components: any;
  constructor() {}

  ngOnInit(): void {}

  beforeComponentLoad() {
    console.log('Loading new component into the page...');
  }

  componentLoaded([status, tagName]: ComponentLoadedEvent) {
    console.log('The component has been successfully loaded', status, tagName);
  }

  componentLoadFailed([error, tagName]: ComponentLoadErrorEvent) {
    console.error(`[${tagName}] Error loading the component: `, error);
  }

  eventEmitted([input, eventName, tagName]: ComponentEventEmittedEvent) {
    console.log(
      `[${tagName}] Emmitted a new event '${eventName}' and this is the payload: `,
      input
    );
  }
}
