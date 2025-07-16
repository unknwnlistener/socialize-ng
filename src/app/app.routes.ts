import { Routes } from '@angular/router';
import { authGuard } from './pages/auth/auth-guard';
import { signedInGuard } from './pages/auth/signed-in-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'home',
        title: 'Home',
        loadComponent: async () => {
            return await import('./pages/home/home');
        },
    },
    {
        path: 'auth',
        canActivate: [signedInGuard],
        children: [
            {
                path: 'signup',
                title: 'Signup',
                loadComponent: async () => {
                    return await import('./pages/auth/signup/signup');
                },
            },
            {
                path: 'login',
                title: 'Login',
                loadComponent: async () => {
                    return await import('./pages/auth/login/login');
                },
            },
            {
                path: 'reset-password',
                title: 'Reset Password',
                loadComponent: async () => {
                    return await import('./pages/auth/reset-password');
                },
            },
        ],
    },
    {
        path: 'user',
        canActivate: [authGuard],
        children: [
            {
                path: 'update-password',
                title: 'Update Password',
                loadComponent: async () => {
                    return await import('./pages/auth/update-password');
                },
            },
            {
                path: 'settings',
                title: 'Settings',
                loadComponent: async () => {
                    return await import('./pages/user/settings/settings');
                },
            },
            {
                path: 'account',
                title: 'Account',
                loadComponent: async () => {
                    return await import('./pages/user/account');
                },
            },
        ],
    },
    {
        path: ':postId/comments',
        title: 'Comments',
        loadComponent: async () => {
            return await import('./posts/comments/comments');
        },
    },

    {
        path: '**',
        redirectTo: 'home',
    },
];
