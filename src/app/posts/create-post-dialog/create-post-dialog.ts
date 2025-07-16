import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { CircleXIcon } from '../../assets/icons/circle-x';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from '../../pages/auth/supabase';
import { CreatePost } from '../post.type';
import { Avatar } from '../../shared-components/avatar';
import { ProfileService } from '../../pages/user/profile.service';
import { Posts } from '../posts';

@Component({
    selector: 'app-create-post-dialog',
    imports: [ReactiveFormsModule, CircleXIcon, Avatar],
    template: `
        <header class="flex-justify-between">
            <app-avatar [avatarPath]="this.profileService.avatarUrl()" />
            <button (click)="dialogRef.close()"><app-icon-circle-x />Close</button>
        </header>
        <form [formGroup]="postForm" (ngSubmit)="createNewPost()">
            <main>
                <textarea
                    id="content"
                    formControlName="content"
                    type="text"
                    placeholder="Share something"
                    required
                ></textarea>
            </main>
            <footer class="flex-justify-end">
                <button type="submit" [disabled]="postForm.invalid">Post</button>
            </footer>
        </form>
    `,
    styles: `
        :host {
            display: block;
            background: black;
            border-radius: var(--border-radius);
            padding: var(--space-m);
        }
        header {
            width: 100%;
            margin-bottom: var(--space-2xs);
            button {
                display: flex;
                gap: var(--space-3xs);
                align-items: center;
                border: 0;
                padding: 0;
                background: inherit;
                color: var(--clr-fg);
            }
        }
        main {
            display: flex;
            align-items: start;
            gap: var(--space-2xs);
            textarea {
                width: 100%;
            }
        }
        footer {
            margin-top: var(--space-s);
        }
        button[type='submit'] {
            padding-inline: calc(var(--button-padding) + 1rem);
        }
        .flex-justify-end {
            display: flex;
            flex-direction: row;
            justify-content: end;
        }
        .flex-justify-between {
            display: flex;
            justify-content: space-between;
        }
    `,
})
export class CreatePostDialog {
    dialogRef = inject(DialogRef);
    supabase = inject(Supabase);
    profileService = inject(ProfileService);
    postService = inject(Posts);

    postForm = new FormGroup({
        content: new FormControl('', Validators.required),
    });

    createNewPost = async () => {
        const content = this.postForm.value.content ?? '';
        const profile_id = this.supabase.userId();
        const newPost: CreatePost = {
            content,
            profile_id,
        };
        const { data, error } = await this.supabase.createPost(newPost);
        if (error) {
            console.log('[create-post] Error inserting', data, error);
        }
        this.postService.posts.update(prev => [
            { content, author: this.profileService.profileData(), postedAt: new Date() },
            ...prev,
        ]);
        this.dialogRef.close();
    };
}
