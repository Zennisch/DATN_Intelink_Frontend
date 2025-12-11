import type { CurrentSubscription } from "../dto/UserDTO";

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'BANNED';

export interface User {
  id: number;
  username: string;
  email: string;
  verified: boolean;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
  profileName?: string;
  profilePictureUrl?: string;
  totalShortUrls: number;
  totalClicks: number;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  currentSubscription?: CurrentSubscription;
}
