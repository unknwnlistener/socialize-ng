import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Supabase } from './supabase';

export const signedInGuard: CanActivateFn = async () => {
    const authService = inject(Supabase);
    const router = inject(Router);

    const { data, error } = await authService.getUser();
    if (!error && data.user) {
        // https://angular.dev/guide/routing/route-guards#canactivate
        return new RedirectCommand(router.parseUrl('/home'), { replaceUrl: true });
    } else {
        return true;
    }
};
