import { Profile } from '../pages/user/user.type';

export interface Post {
    id?: string;
    author: Pick<Profile, 'name' | 'avatar_url' | 'username'>;
    content: string;
    postedAt: Date;
    mediaUrls?: string[];
}

export interface CreatePost {
    content: string;
    profile_id: string;
}

export interface Comment {
    id: string;
    content: string;
    postedAt: Date;
    author: Profile;
}
export interface CreateComment {
    content: string;
    profile_id: string;
    post_id: string;
}
