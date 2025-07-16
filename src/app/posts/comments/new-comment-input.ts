import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from '../../pages/auth/supabase';
import { CreateComment } from '../post.type';
import { Posts } from '../posts';

@Component({
    selector: 'app-new-comment-input',
    imports: [ReactiveFormsModule],
    template: `
        <form [formGroup]="addCommentGroup" (ngSubmit)="postComment()">
            <textarea
                id="comment"
                formControlName="comment"
                placeholder="Add comment..."
                rows="3"
                required
            ></textarea>
            <div class="controls">
                <button type="submit">Submit</button>
            </div>
        </form>
    `,
    styles: `
        form {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: var(--space-2xs);
            background: var(--clr-bg);
            border-radius: var(--border-radius);
            padding: var(--space-s);
            textarea {
                width: 100%;
                background: initial;
                border: initial;
            }
        }
        .controls {
            display: flex;
            width: 100%;
            justify-content: end;
        }
    `,
})
export class NewCommentInput {
    supabase = inject(Supabase);
    postService = inject(Posts);

    postId = input.required<string>();
    addSuccess = output();

    addCommentGroup = new FormGroup({
        comment: new FormControl('', Validators.required),
    });

    postComment = async () => {
        const content = this.addCommentGroup.value.comment ?? '';
        const profile_id = this.supabase.userId();
        const comment: CreateComment = {
            content,
            profile_id,
            post_id: this.postId(),
        };
        const { error } = await this.supabase.createComment(comment);
        if (error) {
            console.error('Error adding comment', error);
        } else {
            this.addCommentGroup.reset();
            this.addSuccess.emit();
        }
    };
}
