import {
  Component,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isObservable, Subscription, tap } from 'rxjs';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';
import { ComponentLoaderDirective } from './core/directives/component-loader.directive';
import {
  ComponentEventEmittedEvent,
  ComponentLoadedEvent,
  ComponentLoadErrorEvent,
} from './core/interfaces/event-types';
import { LoadableComponent } from './core/interfaces/loadable-component';

@Component({
  selector: 'd-component-loader',
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.css'],
})
export class ComponentLoaderComponent implements OnInit, OnDestroy {
  tagName: string = 'Unknown';

  @Input() component!: LoadableComponent;

  @Input() debug: boolean = false;

  @ViewChild(ComponentLoaderDirective, { static: true })
  componentLoader!: ComponentLoaderDirective;

  @Output() componentLoaded: EventEmitter<ComponentLoadedEvent> =
    new EventEmitter<ComponentLoadedEvent>();
  @Output() componentLoadFailed: EventEmitter<ComponentLoadErrorEvent> =
    new EventEmitter<ComponentLoadErrorEvent>();
  @Output() beforeLoad: EventEmitter<undefined | null> = new EventEmitter<
    undefined | null
  >();
  @Output() eventEmitted: EventEmitter<ComponentEventEmittedEvent> =
    new EventEmitter<ComponentEventEmittedEvent>();

  private eventSubscriptions: Subscription[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.unBindOutputEvents();
  }

  loadComponent(): void {
    this.beforeLoad.emit();
    this.renderComponent().then(
      (success) => this.onComponentLoaded(),
      (error) => this.onComponentLoadFailed(error)
    );
  }

  async renderComponent(): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      try {
        const viewContainerRef = this.componentLoader.viewContainerRef;
        viewContainerRef.clear();

        var componentRef = viewContainerRef.createComponent<any>(
          this.component.component
        );
        this.tagName = componentRef.location.nativeElement.tagName;

        this.bindComponentParams(componentRef);
        this.bindOutputEvents(componentRef);
        console.log(
          `[${this.tagName}] Component instance: `,
          componentRef.instance
        );

        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  bindComponentParams(componentRef: any) {
    if (!this.component.params) return;

    try {
      for (let param of Object.keys(this.component.params)) {
        // if (!componentRef.instance[param])
        //throw new Error(`The input parameter '${param} does not exist in the component`);
        // ---> How to identify the inputs of the component
        componentRef.instance[param] = this.component.params[param];
      }
    } catch (err) {
      throw err;
    }
  }

  bindOutputEvents(componentRef: any) {
    if (!this.component.outputEvents) return;

    try {
      for (let outputEventName of Object.keys(this.component.outputEvents)) {
        const emitter = componentRef.instance[outputEventName];
        if (!emitter || !isObservable(emitter)) {
          continue;
        }

        let subscription = emitter.subscribe(
          this.component.outputEvents[outputEventName]
        );
        this.eventSubscriptions = this.eventSubscriptions.concat([
          subscription,
          emitter.subscribe((event) =>
            this.onAnyOutputEmits([event, outputEventName, this.tagName])
          ),
        ]);
      }
    } catch (err) {
      throw err;
    }
  }

  unBindOutputEvents() {
    // When the component is destroyed we must unsubscribe
    if (this.eventSubscriptions && this.eventSubscriptions.length > 0) {
      this.eventSubscriptions.forEach((sub) => sub.unsubscribe());
    }
  }

  // Events
  onComponentLoaded(): void {
    // Triggered once the component has been loaded correctly
    this.componentLoaded.emit([true, this.tagName]);
  }

  onComponentLoadFailed(error: Error): void {
    this.componentLoadFailed.emit([error, this.tagName]);
  }

  onAnyOutputEmits([
    input,
    eventName,
    componentSelector,
  ]: ComponentEventEmittedEvent): void {
    // This is triggered when any of the binded events emitts an event.
    this.ref.markForCheck();
    this.eventEmitted.emit([input, eventName, componentSelector]);
  }
}
