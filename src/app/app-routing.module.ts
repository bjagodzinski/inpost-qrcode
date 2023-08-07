import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { CollectOptionComponent } from './collect-option/collect-option.component';
import { ReturnOptionComponent } from './return-option/return-option.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'collect', component: CollectOptionComponent },
  { path: 'return', component: ReturnOptionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
