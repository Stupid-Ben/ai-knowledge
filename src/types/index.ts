export interface Article {
  id: string;
  title: string;
  cover: string;
  summary: string;
  contentHtml: string;
  tags: string[];
  category: string;
  isPremium: boolean;
  views: number;
  collects: number;
  readMinutes: number;
  publishedAt: string;
}

export interface Category {
  key: string;
  name: string;
  icon: string;
}

export interface RankingList {
  key: string;
  name: string;
  articleIds: string[];
}

export interface MemberPlan {
  key: 'month' | 'quarter' | 'year' | 'lifetime';
  name: string;
  price: number;
  period: string;
  recommended?: boolean;
}

export interface User {
  isMember: boolean;
  points: number;
  friends: number;
  collectedIds: string[];
  historyIds: string[];
}

export interface AppState {
  user: User;
  isLoggedIn: boolean;
}

export interface AppContextType extends AppState {
  setUser: (user: User) => void;
  login: () => void;
  logout: () => void;
}
