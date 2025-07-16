import { Component, inject } from '@angular/core';
import { Posts } from '../../posts/posts';
import { Postcard } from '../../posts/postcard/postcard';
import { FeedSection } from '../../shared-components/feed-section';

@Component({
    selector: 'app-home',
    imports: [Postcard, FeedSection],
    templateUrl: './home.html',
    styles: ``,
})
export default class Home {
    postService = inject(Posts);

    constructor() {
        this.postService.loadAllPostsFromDb();
    }
}
