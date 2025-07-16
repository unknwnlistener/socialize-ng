import { inject, Injectable, signal } from '@angular/core';
import { Comment, Post } from './post.type';
import { HttpClient } from '@angular/common/http';
import { Supabase } from '../pages/auth/supabase';
import { DbPost, DbPostWithComments } from '../pages/auth/supabase.type';

@Injectable({
    providedIn: 'root',
})
export class Posts {
    http = inject(HttpClient);
    supabase = inject(Supabase);

    posts = signal<Post[]>([]);
    comments = signal<Comment[]>([]);

    defaultPost: Post = {
        id: '999',
        author: {
            name: 'a',
            username: 'a',
            avatar_url: 'a',
        },
        content: 'a',
        postedAt: new Date(Date.now()),
    };

    getPostsFromApi = () => {
        const url = `https://jsonplaceholder.typicode.com/posts`;
        return this.http.get<Post[]>(url);
    };

    loadAllPostsFromDb = async () => {
        const { data } = await this.supabase.getAllPosts();
        const convertedData: Post[] = this.convertDbToPosts(data);
        this.posts.set(convertedData);
    };

    loadUserPostsFromDb = async () => {
        const { data } = await this.supabase.getUserPosts(this.supabase.userId() ?? '');
        const convertedData: Post[] = this.convertDbToPosts(data);
        this.posts.set(convertedData);
    };

    private convertDbToPosts = (data: DbPost[] | null) => {
        return (
            data?.map(({ id, content, created_at, profiles }) => {
                return {
                    id,
                    content,
                    postedAt: created_at,
                    author: {
                        avatar_url: profiles.avatar_url,
                        username: profiles.username,
                        name: profiles.name,
                    },
                };
            }) ?? []
        );
    };

    private convertDbToComments = (data: DbPostWithComments | null) => {
        return (
            data?.comments.map(({ content, created_at, id, profiles }) => {
                return {
                    id,
                    content,
                    postedAt: created_at,
                    author: {
                        avatar_url: profiles.avatar_url,
                        username: profiles.username,
                        name: profiles.name,
                    },
                };
            }) ?? []
        );
    };

    loadPostAndComments = async (postId: string) => {
        const { data, error } = await this.supabase.getPostWithComments(postId);
        if (error) console.error('[Comments]: ', error);
        this.posts.set(this.convertDbToPosts(data));
        this.comments.set(this.convertDbToComments(data![0]));
    };
}
