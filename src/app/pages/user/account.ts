import { Component, inject } from '@angular/core';
import { Posts } from '../../posts/posts';
import { Postcard } from '../../posts/postcard/postcard';
import { ProfileService } from './profile.service';
import { FeedSection } from '../../shared-components/feed-section';

@Component({
    selector: 'app-account',
    imports: [Postcard, FeedSection],
    template: `
        <app-feed-section title="My Posts">
            @for (post of this.postService.posts(); track post.id) {
                <app-postcard [post]="post" />
            }
        </app-feed-section>
    `,
    styles: ``,
})
export default class Account {
    postService = inject(Posts);
    profileService = inject(ProfileService);
    constructor() {
        this.postService.loadUserPostsFromDb();
    }
}
