import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Supabase } from './supabase';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(Supabase);
    const router = inject(Router);

    const { data, error } = await authService.getUser();
    if (!error && data.user) {
        return true;
    } else {
        return new RedirectCommand(router.parseUrl('/auth/login'), { replaceUrl: true });
    }
};
