import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getProfile(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const followUser = createAsyncThunk(
  'user/follow',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.follow(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollow',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.unfollow(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'user/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await userService.search(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getFollowers = createAsyncThunk(
  'user/getFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getFollowers(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getFollowing = createAsyncThunk(
  'user/getFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.getFollowing(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    profile: null,
    followers: [],
    following: [],
    searchResults: [],
    suggestions: [],
    isLoading: false,
    error: null,
    isUpdating: false,
    isFollowing: false,
    stats: {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      engagementRate: 0,
    },
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.followers = [];
      state.following = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    updateUserStats: (state, action) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
    addFollower: (state, action) => {
      state.followers.unshift(action.payload);
      if (state.profile) {
        state.profile.followersCount += 1;
      }
    },
    removeFollower: (state, action) => {
      state.followers = state.followers.filter(
        follower => follower.id !== action.payload
      );
      if (state.profile) {
        state.profile.followersCount -= 1;
      }
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.isFollowing = action.payload.isFollowing || false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentUser = action.payload;
        if (state.profile?.id === action.payload.id) {
          state.profile = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Follow User
      .addCase(followUser.fulfilled, (state, action) => {
        state.isFollowing = true;
        if (state.profile) {
          state.profile.followersCount += 1;
          state.profile.isFollowing = true;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Unfollow User
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isFollowing = false;
        if (state.profile) {
          state.profile.followersCount -= 1;
          state.profile.isFollowing = false;
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Followers
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      
      // Get Following
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      });
  },
});

export const { 
  setCurrentUser, 
  setProfile, 
  clearProfile, 
  clearSearchResults,
  updateUserStats,
  addFollower,
  removeFollower,
  setSuggestions,
  clearError 
} = userSlice.actions;

export default userSlice;