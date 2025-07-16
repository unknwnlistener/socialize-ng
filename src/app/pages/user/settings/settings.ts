import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Supabase } from '../../auth/supabase';
import { ProfileService } from '../profile.service';
import { Avatar } from '../../../shared-components/avatar';

@Component({
    selector: 'app-settings',
    imports: [ReactiveFormsModule, Avatar],
    templateUrl: './settings.html',
    styleUrl: './settings.css',
})
export default class Settings {
    private formBuilder = inject(FormBuilder);
    protected readonly authService = inject(Supabase);
    protected readonly profileService = inject(ProfileService);

    loading = signal(false);
    userEmail = computed(() => this.authService.userEmail());

    updateProfileForm = this.formBuilder.group({
        username: [''],
        avatar_url: [''],
        name: [''],
    });

    protected get avatarUrl() {
        return this.updateProfileForm.value.avatar_url ?? '';
    }

    constructor() {
        effect(() => {
            this.loading.set(this.profileService.isLoading());
        });
        effect(() => {
            const profileData = this.profileService.profileData();
            console.log('Profile data', profileData);
            this.updateProfileForm.patchValue({
                username: profileData?.username,
                avatar_url: profileData?.avatar_url,
                name: profileData?.name,
            });
        });
    }

    updateProfile = async () => {
        try {
            this.loading.set(true);

            const username = this.updateProfileForm.value.username as string;
            const avatar_url = this.updateProfileForm.value.avatar_url as string;
            const name = this.updateProfileForm.value.name as string;
            const { error } = await this.authService.updateProfile({
                id: this.authService.userId(),
                username,
                avatar_url,
                name,
            });
            this.profileService.reloadResource();
            if (error) throw error;
        } catch (error) {
            console.log('Error occured [Account.ts]:', error);
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            this.loading.set(false);
        }
    };

    updateAvatar = async (event: string) => {
        this.updateProfileForm.patchValue({
            avatar_url: event,
        });
        await this.updateProfile();
    };

    signOut = async () => {
        await this.authService.signOut();
    };
}
