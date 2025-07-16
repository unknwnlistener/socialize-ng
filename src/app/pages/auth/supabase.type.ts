import { Profile } from '../user/user.type';

export interface DbPost {
    id: string;
    profiles: Pick<Profile, 'name' | 'avatar_url' | 'username'>;
    content: string;
    created_at: Date;
}

export interface DbComment {
    id: string;
    content: string;
    created_at: Date;
    profiles: Profile;
    post: DbPost;
}

export type DbPostWithComments = DbPost & { comments: DbComment[] };
