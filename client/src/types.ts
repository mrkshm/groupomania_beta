export interface UserObjectType {
  username: string;
  email: string;
  body: string;
  imageUrn: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TagType {
  name: string;
  slug: string;
  description: string;
  tagCount: number;
}

export interface PostType {
  identifier: string;
  slug: string;
  title: string;
  tagName: string;
  createdAt: string;
  body: string;
  imgUrl: string;
  userName: string;
  imgPath: string;
  url: string;
  commentCount: number;
  voteScore: number;
  userVote: number;
  user: UserObjectType;
}

export interface CommentType {
  identifier: string;
  body: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  // Virtual
  userVote: number;
  voteScore: number;
}

export interface PostFetchProps {
  identifier: string;
  slug: string;
  comments: CommentType[];
}

export interface SessionUserProps {
  sessionUser: UserObjectType | null;
  setSessionUser: Function;
}
