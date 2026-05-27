import { apiClient } from './client';
import type { UserProfileDto } from './types';

export const profileApi = {
  getProfile: (): Promise<UserProfileDto> => {
    return apiClient.get<UserProfileDto>('/users/me/profile');
  },

  updateProfile: (profile: Partial<UserProfileDto>): Promise<UserProfileDto> => {
    return apiClient.put<UserProfileDto>('/users/me/profile', profile);
  },
};
