import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Supabase } from '../../pages/auth/supabase';
import { Postcard } from '../postcard/postcard';
import { Posts } from '../posts';
import { FeedSection } from '../../shared-components/feed-section';
import { NewCommentInput } from './new-comment-input';

@Component({
    selector: 'app-comments',
    imports: [Postcard, FeedSection, NewCommentInput],
    template: `
        <app-feed-section title="">
            <app-postcard [post]="currentPost()" [showComments]="false" />
            <app-new-comment-input
                [postId]="currentPost().id ?? ''"
                (addSuccess)="addedComment()"
            />
            <h2>Comments</h2>
            @if (numberOfComments() === 0) {
                <p>No comments for this post</p>
            } @else {
                @for (comment of currentComments(); track comment.id) {
                    <app-postcard [post]="comment" [showComments]="false" />
                }
            }
        </app-feed-section>
    `,
    styles: `
        section {
            width: 100%;
            position: relative;
            div {
                display: grid;
                position: relative;
                .title {
                    width: 100%;
                    background-color: rgba(0, 0, 0, 0.75);
                    color: white;
                    border: 1px solid gray;
                    position: sticky;
                    padding: var(--space-xs);
                    top: 0;
                    z-index: 10;
                    & > * {
                        margin: 0 auto;
                    }
                }
            }
        }
    `,
})
export default class Comments {
    private route = inject(ActivatedRoute);
    private supabase = inject(Supabase);
    protected postService = inject(Posts);

    private readonly routePostId = signal<string>(this.route.snapshot.params['postId']);

    protected currentPost = computed(() => {
        const posts = this.postService.posts();
        if (posts.length > 0) return posts[0];
        return this.postService.defaultPost;
    });
    // protected currentComments = signal<Comment[]>([]);
    protected currentComments = computed(() => {
        const postComments = this.postService.comments();
        if (postComments.length > 0)
            return postComments.sort(
                (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
            );
        return [];
    });
    protected numberOfComments = computed(() => this.currentComments().length);

    constructor() {
        effect(() => {
            this.postService.loadPostAndComments(this.routePostId());
        });
    }

    addedComment = () => {
        console.log('Added comment in Comments parent!');
        this.postService.loadPostAndComments(this.routePostId());
    };
}
