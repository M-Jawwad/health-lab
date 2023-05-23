import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainDashboardComponent } from "../core/dashboard/dashboard/main-dashboard.component";


const routes: Routes = [
    {
        path: '', component: MainDashboardComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule) },
            { path: 'users', loadChildren: () => import('./users/users-module').then(m => m.UsersModule) },
            { path: 'customers', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
            { path: 'consumer', loadChildren: () => import('./consumer/consumer.module').then(m => m.ConsumerModule) },
            { path: 'group', loadChildren: () => import('./user-groups/user-groups-module').then(m => m.UserGroupsModule) },
            { path: 'setting', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
            { path: 'packages', loadChildren: () => import('./packages/packages.module').then(m => m.PackagesModule) },
            { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule) },
            // { path: 'audit', loadChildren: () => import('./audit/audit.module').then(m => m.AuditModule) },
        ]
    },
    {
        path: '**', redirectTo: ''
    }
]


@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ]
})
export class PlatformRoutingModule { }