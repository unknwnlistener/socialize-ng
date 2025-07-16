import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Supabase } from '../pages/auth/supabase';
import { HouseIcon } from '../assets/icons/house';
import { SettingsIcon } from '../assets/icons/settings';
// import { CircleUserRoundIcon } from '../assets/icons/circle-user-round';
import { CirclePlusIcon } from '../assets/icons/circle-plus';
import { Dialog } from '@angular/cdk/dialog';
import { CreatePostDialog } from '../posts/create-post-dialog/create-post-dialog';
import { ProfileService } from '../pages/user/profile.service';
import { Avatar } from '../shared-components/avatar';
import { BadgePlusIcon } from '../assets/icons/badge-plus';
import { BadgeCheckIcon } from '../assets/icons/badge-check';

@Component({
    selector: 'app-navbar',
    imports: [
        RouterLinkActive,
        RouterLink,
        HouseIcon,
        SettingsIcon,
        CirclePlusIcon,
        Avatar,
        BadgePlusIcon,
        BadgeCheckIcon,
    ],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css',
})
export class Navbar {
    protected readonly authService = inject(Supabase);
    private readonly dialogService = inject(Dialog);
    protected profileService = inject(ProfileService);

    readonly isPortraitView = input(false);

    signoutUser = async () => {
        try {
            const { error } = await this.authService.signOut();
            if (error) throw error;
        } catch (err) {
            console.error(err);
        }
    };

    openDialog = () => {
        this.dialogService.open(CreatePostDialog, {
            width: '32rem',
        });
    };
}
