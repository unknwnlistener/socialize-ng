import { Component, computed, inject, input, signal } from '@angular/core';
import { Post } from '../post.type';
import { DatePipe } from '@angular/common';
import { Supabase } from '../../pages/auth/supabase';
import { Avatar } from '../../shared-components/avatar';
import { RouterLink } from '@angular/router';
import { MessageSquareTextIcon } from '../../assets/icons/message-square-text';

@Component({
    selector: 'app-postcard',
    imports: [DatePipe, Avatar, RouterLink, MessageSquareTextIcon],
    templateUrl: './postcard.html',
    styleUrl: './postcard.css',
})
export class Postcard {
    private supabase = inject(Supabase);

    readonly post = input.required<Post>();
    readonly showComments = input<boolean>(true);

    protected acceptedLength = 150;
    protected showMore = signal(false);
    protected readonly contentLength = computed(() => this.post().content.length);

    avatarUrl = computed(
        () => this.supabase.getAvatarPublicUrl(this.post().author.avatar_url).data.publicUrl
    );

    protected toggleReadMore = () => {
        this.showMore.update(state => !state);
    };
}
