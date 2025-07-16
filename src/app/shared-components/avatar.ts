import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Supabase } from '../pages/auth/supabase';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CircleUserRoundIcon } from '../assets/icons/circle-user-round';

@Component({
    selector: 'app-avatar',
    imports: [CircleUserRoundIcon],
    template: `
        <div class="flex">
            <div class="avatar" [class.small-img]="isViewOnly()">
                @if (avatarUrl()) {
                    <img [src]="avatarUrl()" alt="Avatar" />
                } @else {
                    <app-icon-circle-user-round classes="size-large" />
                }
            </div>
            @if (!isViewOnly()) {
                <div class="primary block">
                    <label for="single-upload">
                        <button type="button">{{ loading() ? 'Uploading ...' : 'Upload' }}</button>
                    </label>
                    <input
                        style="visibility: hidden;position: absolute"
                        type="file"
                        id="single-upload"
                        accept="image/*"
                        (change)="uploadAvatar($event)"
                        [disabled]="loading()"
                    />
                </div>
            }
        </div>
    `,
    styles: `
        .flex {
            display: flex;
            align-items: end;
            gap: var(--space-s);
        }
        .avatar img {
            width: 100px;
            aspect-ratio: 1;
            border-radius: 100px;
            object-fit: cover;
        }
        .small-img img {
            width: 50px;
        }
    `,
})
export class Avatar {
    private readonly auth = inject(Supabase);
    private readonly dom = inject(DomSanitizer);

    protected readonly loading = signal(false);
    protected readonly avatarUrl = signal<SafeResourceUrl>('');

    readonly avatarPath = input<string>();
    readonly isViewOnly = input<boolean>(true);
    readonly upload = output<string>();

    constructor() {
        effect(() => {
            const url = this.avatarPath();
            if (url) this.getImage(url);
            else this.avatarUrl.set('');
        });
    }

    getImage = (path: string) => {
        const { data } = this.auth.getAvatarPublicUrl(path);
        this.avatarUrl.set(data.publicUrl);
    };

    downloadImage = async (path: string) => {
        try {
            const { data, error } = await this.auth.downloadImage(path);
            if (error) console.log('Download error', error);
            if (data instanceof Blob) {
                this.avatarUrl.set(
                    this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
                );
            }
        } catch (error) {
            console.log('Error downloading image', error);
        }
    };

    uploadAvatar = async (event: Event) => {
        try {
            this.loading.set(true);
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (!file) {
                throw new Error('You must select an image to upload.');
            }

            const fileExt = file.name.split('.').pop();
            const filePath = `${(Math.random() + '').substring(2)}.${fileExt}`;

            const { error } = await this.auth.uploadAvatar(filePath, file);
            if (error) console.log('Upload error', error);
            this.upload.emit(filePath);
        } catch (error) {
            console.log('Error uploading avatar', error);
        } finally {
            this.loading.set(false);
        }
    };
}
