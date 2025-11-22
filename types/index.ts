
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  interests: string[];
  createdAt: string;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
}

export interface Session {
  id: string;
  userId: string;
  startedAt: string;
  expiresAt: string;
  status: 'open' | 'closed';
  latitude?: number;
  longitude?: number;
}

export interface Match {
  id: string;
  sessionAId: string;
  sessionBId: string;
  userA: User;
  userB: User;
  sharedInterests: string[];
  status: 'pending' | 'user_a_interested' | 'user_b_interested' | 'both_ready' | 'declined' | 'closed';
  createdAt: string;
}

export interface Settings {
  defaultOpenTime: 30 | 45 | 60;
  blockedUsers: string[];
}
