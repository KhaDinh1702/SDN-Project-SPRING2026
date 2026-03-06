// mobile/app/services/user.service.ts

import { http } from './api';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_active: boolean;
}

export const getMyProfile = async () => {
  const res = await http.get<{
    success: boolean;
    data: UserProfile;
  }>('/api/users/me');

  return res.data;
};

export const updateMyProfile = async (payload: Partial<UserProfile>) => {
  const res = await http.put<{
    success: boolean;
    data: UserProfile;
  }>('/api/users/me', payload);

  return res.data;
};