import { computed, effect, inject, Injectable, resource } from '@angular/core';
import { Supabase } from '../auth/supabase';
import { Profile } from './user.type';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private readonly authService = inject(Supabase);
    private readonly profileResource = resource({
        params: () => ({ userId: this.authService.userId() }),
        loader: ({ params }) => {
            return this.authService.getCurrentUserProfile(params.userId ?? '');
        },
    });

    profileData = computed(() => this.profileResource.value()?.data ?? ({} as Profile));
    avatarUrl = computed(() => this.profileData()?.avatar_url);

    constructor() {
        effect(() => {
            if (this.profileResource.status() === 'error') {
                throw new Error('Error retrieving profile');
            }
        });
    }
    isLoading = () => this.profileResource.isLoading();

    reloadResource = () => this.profileResource.reload();

    // status = () => this.profileResource.status();

    // hasValue = () => this.profileResource.hasValue();
}
