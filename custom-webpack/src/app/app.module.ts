import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeView } from './home/home-view.component';
import { EsriLoaderModule } from 'angular-esri-loader';
import { EsriLoaderService } from 'angular-esri-loader';
import { EsriMapComponent } from './esri.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: HomeView, pathMatch: 'full'},
      { path: 'lazy', loadChildren: './+lazy/lazy.module#LazyModule'}
    ])
  ],
  declarations: [ AppComponent, HomeView, EsriMapComponent ],
  exports: [ AppComponent, EsriMapComponent ],
  providers: [EsriLoaderService]
})
export class AppModule {}
