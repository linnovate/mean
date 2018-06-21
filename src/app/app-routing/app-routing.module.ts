import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemaComponent } from '../schema/schema.component';
import { AuthGuard } from '../auth/auth-guard.service';

const routes : Routes = [{
  path: '',
  loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
}, {
  path: 'upload/schema',
  component: SchemaComponent,
  canActivate: [AuthGuard]
}, {
  path: 'auth',
  loadChildren: 'app/auth/auth.module#AuthModule'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
  declarations: []
})

export class AppRoutingModule {}
