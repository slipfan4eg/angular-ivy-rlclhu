import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EntryComponentComponent } from './entry-component/entry-component.component';
import { Component1Component } from './components/component1/component1.component';
import { Component2Component } from './components/component2/component2.component';
import { Component3Component } from './components/component3/component3.component';
import { ComponentLoaderModule } from './component-loader/component-loader.module';

@NgModule({
  imports: [BrowserModule, FormsModule, ComponentLoaderModule],
  declarations: [
    AppComponent,
    EntryComponentComponent,
    Component1Component,
    Component2Component,
    Component3Component,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
