import { computed, effect, inject, Injectable, resource } from '@angular/core';
import {
    AuthChangeEvent,
    // AuthSession,
    createClient,
    Session,
    SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { Profile } from '../../pages/user/user.type';
import { Router } from '@angular/router';
import { CreateComment, CreatePost } from '../../posts/post.type';
import { DbComment, DbPost, DbPostWithComments } from './supabase.type';

@Injectable({
    providedIn: 'root',
})
export class Supabase {
    private supabase: SupabaseClient;
    private router = inject(Router);

    private readonly currentUser = resource({
        loader: () => this.getUser(),
    });

    readonly userId = computed(() => this.currentUser.value()?.data.user?.id ?? '');
    readonly isLoggedIn = computed(
        () => !this.currentUser.value()?.error && this.currentUser.value()?.data.user
    );
    readonly userEmail = computed(() => this.currentUser.value()?.data.user?.email ?? '');

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

        effect(() => {
            this.authChanges(event => {
                console.log('event', event);
                this.currentUser.reload();
            });
        });
    }

    getUser = () => {
        return this.supabase.auth.getUser();
    };

    authChanges = (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
        return this.supabase.auth.onAuthStateChange(callback);
    };

    getCurrentUserProfile = (userId: string) => {
        return this.supabase
            .from('profiles')
            .select(`username, avatar_url, name`)
            .eq('id', userId)
            .limit(1)
            .single();
    };

    signUp = async (email: string, password: string, username: string, name: string) => {
        return await this.supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'localhost:4200',
                data: {
                    name: name,
                    username: username,
                },
            },
        });
    };

    signIn = async (email: string, password: string) => {
        return await this.supabase.auth.signInWithPassword({ email, password });
    };

    signOut = async () => {
        this.router.navigate(['']);
        return await this.supabase.auth.signOut();
    };

    resetPassword = async (email: string) => {
        return await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: '/auth/update-password',
        });
    };

    updatePassword = async (password: string) => {
        return await this.supabase.auth.updateUser({ password });
    };

    updateProfile = (profile: Profile) => {
        const update = {
            ...profile,
            modified_at: new Date(),
        };
        return this.supabase.from('profiles').upsert(update);
    };

    downloadImage = (path: string) => {
        return this.supabase.storage.from('avatars').download(path);
    };

    getAvatarPublicUrl = (path: string) => {
        return this.supabase.storage.from('avatars').getPublicUrl(path);
    };

    uploadAvatar = (filePath: string, file: File) => {
        return this.supabase.storage.from('avatars').upload(filePath, file);
    };

    createPost = (post: CreatePost) => {
        return this.supabase.from('posts').insert(post);
    };

    getAllPosts = () => {
        return this.supabase
            .from('posts')
            .select(
                `
                id,
                content,
                created_at, 
                profiles(
                    username,
                    name,
                    avatar_url
                )
                `
            )
            .order('created_at', { ascending: false })
            .overrideTypes<DbPost[]>();
    };

    getUserPosts = (userId: string) => {
        return this.supabase
            .from('posts')
            .select(
                `
                id,
                content,
                created_at, 
                profiles(
                    username,
                    name,
                    avatar_url
                )
                `
            )
            .eq('profile_id', userId)
            .order('created_at', { ascending: false })
            .overrideTypes<DbPost[]>();
    };

    getCommentsForPost = (postId: string) => {
        return this.supabase
            .from('comments')
            .select(`*`)
            .eq('post_id', postId)
            .order('created_at', { ascending: false })
            .overrideTypes<DbComment[]>();
    };

    getPostWithComments = (postId: string) => {
        return this.supabase
            .from('posts')
            .select(`*, profiles(*), comments(*, profiles(*))`)
            .eq('id', postId)
            .limit(1)
            .overrideTypes<DbPostWithComments[], { merge: false }>();
    };

    createComment = (comment: CreateComment) => {
        return this.supabase.from('comments').insert(comment);
    };
}
