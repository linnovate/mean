export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: {
    _id: string;
    fullname: string;
    email: string;
  };
  categories: Category[];
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  scheduledAt?: Date;
  views: number;
  likes: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isFeatured: boolean;
  allowComments: boolean;
  commentCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    fullname: string;
    email: string;
  };
  blogCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    fullname: string;
    email: string;
  };
  blog: {
    _id: string;
    title: string;
    slug: string;
  };
  parentComment?: {
    _id: string;
    content: string;
    author: any;
  };
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: {
    _id: string;
    fullname: string;
    email: string;
  };
  moderatedAt?: Date;
  moderationReason?: string;
  likes: string[];
  isEdited: boolean;
  editedAt?: Date;
  replyCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  status?: string;
  author?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  sort?: 'newest' | 'oldest' | 'popular' | 'title';
}

export interface PaginationResponse<T> {
  data?: T[];
  blogs?: T[];
  comments?: T[];
  categories?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  blog?: T;
  category?: T;
  comment?: T;
  data?: T;
}
