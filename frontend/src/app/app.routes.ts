import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyblogsComponent } from './pages/myblogs/myblogs.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AppComponent } from './app.component';
import { CreateBlogComponent } from './pages/create-blog/create-blog.component';
import { ViewBlogComponent } from './pages/view-blog/view-blog.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { SuspendUserComponent } from './pages/suspend-user/suspend-user.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { EditBlogComponent } from './pages/edit-blog/edit-blog.component';
import { authGuard } from './guard/auth.guard';
import { roleGuard } from './guard/role.guard';
import { suspensionGuard } from './guard/suspension.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  { path: 'home', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'my-blogs',
    component: MyblogsComponent,
    pathMatch: 'full',
    canActivate: [suspensionGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full',
  },
  {
    path: 'createBlog',
    component: CreateBlogComponent,
    pathMatch: 'full',
    canActivate: [authGuard, suspensionGuard],
  },
  {
    path: 'editBlog/:id',
    component: EditBlogComponent,
    pathMatch: 'full',
    canActivate: [authGuard, suspensionGuard],
  },
  {
    path: 'viewBlog/:id',
    component: ViewBlogComponent,
    pathMatch: 'full',
    canActivate: [suspensionGuard],
  },
  {
    path: 'adminPanel',
    component: AdminPanelComponent,
    canActivate: [authGuard, roleGuard],
    pathMatch: 'full',
  },
  {
    path: 'suspended',
    component: SuspendUserComponent,
    pathMatch: 'full',
    // canActivate:[]
  },
  {
    path: 'notify',
    component: NotificationComponent,
    pathMatch: 'full',
    canActivate: [authGuard],
  },
];
