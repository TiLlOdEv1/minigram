import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '../../services/postService';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10, type = 'all' }, { rejectWithValue }) => {
    try {
      const response = await postService.getPosts(page, limit, type);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await postService.getUserPosts(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(postId, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await postService.deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.likePost(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.unlikePost(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const commentOnPost = createAsyncThunk(
  'posts/commentOnPost',
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await postService.addComment(postId, comment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await postService.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sharePost = createAsyncThunk(
  'posts/sharePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.sharePost(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const savePost = createAsyncThunk(
  'posts/savePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.savePost(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const unsavePost = createAsyncThunk(
  'posts/unsavePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.unsavePost(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSavedPosts = createAsyncThunk(
  'posts/fetchSavedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.getSavedPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    userPosts: [],
    savedPosts: [],
    currentPost: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,
    hasMore: true,
    page: 1,
    totalPosts: 0,
    feedType: 'all', // all, following, trending, premium
    filters: {
      contentType: 'all', // all, images, videos, text
      sortBy: 'latest', // latest, popular, trending
    },
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
      state.totalPosts += 1;
    },
    updatePostInList: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
      state.totalPosts -= 1;
    },
    addCommentToPost: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.comments.unshift(comment);
        post.commentsCount += 1;
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.comments.unshift(comment);
        state.currentPost.commentsCount += 1;
      }
    },
    removeCommentFromPost: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.comments = post.comments.filter(c => c.id !== commentId);
        post.commentsCount -= 1;
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.comments = state.currentPost.comments.filter(c => c.id !== commentId);
        state.currentPost.commentsCount -= 1;
      }
    },
    updateLikeStatus: (state, action) => {
      const { postId, userId, liked } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        if (liked) {
          post.likesCount += 1;
          post.isLiked = true;
          post.likedBy.push(userId);
        } else {
          post.likesCount -= 1;
          post.isLiked = false;
          post.likedBy = post.likedBy.filter(id => id !== userId);
        }
      }
      if (state.currentPost?.id === postId) {
        if (liked) {
          state.currentPost.likesCount += 1;
          state.currentPost.isLiked = true;
          state.currentPost.likedBy.push(userId);
        } else {
          state.currentPost.likesCount -= 1;
          state.currentPost.isLiked = false;
          state.currentPost.likedBy = state.currentPost.likedBy.filter(id => id !== userId);
        }
      }
    },
    updateShareStatus: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.sharesCount += 1;
        post.sharedBy.push(userId);
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.sharesCount += 1;
        state.currentPost.sharedBy.push(userId);
      }
    },
    setFeedType: (state, action) => {
      state.feedType = action.payload;
      state.page = 1;
      state.posts = [];
      state.hasMore = true;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
      state.posts = [];
      state.hasMore = true;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.page === 1) {
          state.posts = action.payload.posts;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        state.hasMore = action.payload.hasMore;
        state.totalPosts = action.payload.total;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch User Posts
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
      })
      
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        state.posts.unshift(action.payload);
        state.totalPosts += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
        state.totalPosts -= 1;
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })
      
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.likesCount = action.payload.likesCount;
          post.isLiked = true;
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.likesCount = action.payload.likesCount;
          state.currentPost.isLiked = true;
        }
      })
      
      // Unlike Post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.likesCount = action.payload.likesCount;
          post.isLiked = false;
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.likesCount = action.payload.likesCount;
          state.currentPost.isLiked = false;
        }
      })
      
      // Comment on Post
      .addCase(commentOnPost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments.unshift(action.payload.comment);
          post.commentsCount += 1;
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.comments.unshift(action.payload.comment);
          state.currentPost.commentsCount += 1;
        }
      })
      
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments = post.comments.filter(c => c.id !== action.payload.commentId);
          post.commentsCount -= 1;
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.comments = state.currentPost.comments.filter(c => c.id !== action.payload.commentId);
          state.currentPost.commentsCount -= 1;
        }
      })
      
      // Share Post
      .addCase(sharePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.sharesCount = action.payload.sharesCount;
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.sharesCount = action.payload.sharesCount;
        }
      })
      
      // Save Post
      .addCase(savePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.isSaved = true;
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.isSaved = true;
        }
      })
      
      // Unsave Post
      .addCase(unsavePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.isSaved = false;
        }
        if (state.currentPost?.id === action.payload.postId) {
          state.currentPost.isSaved = false;
        }
      })
      
      // Fetch Saved Posts
      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.savedPosts = action.payload;
      });
  },
});

export const { 
  setPosts, 
  setCurrentPost, 
  addPost, 
  updatePostInList, 
  removePost,
  addCommentToPost,
  removeCommentFromPost,
  updateLikeStatus,
  updateShareStatus,
  setFeedType,
  setFilters,
  clearPosts,
  clearError,
  incrementPage 
} = postSlice.actions;

export default postSlice;