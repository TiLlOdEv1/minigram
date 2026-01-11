import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { premiumService } from "../../services/premiumService";

// Async thunks
export const fetchPremiumPlans = createAsyncThunk(
  "premium/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await premiumService.getPlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const subscribeToPremium = createAsyncThunk(
  "premium/subscribe",
  async ({ plan, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await premiumService.subscribe(plan, paymentMethodId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  "premium/cancelSubscription",
  async (_, { rejectWithValue }) => {
    try {
      const response = await premiumService.cancelSubscription();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSubscriptionStatus = createAsyncThunk(
  "premium/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await premiumService.getStatus();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  "premium/getPaymentHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await premiumService.getPaymentHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyAccount = createAsyncThunk(
  "premium/verifyAccount",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await premiumService.verifyAccount(verificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPremiumStats = createAsyncThunk(
  "premium/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await premiumService.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkVPN = createAsyncThunk(
  "premium/checkVPN",
  async (_, { rejectWithValue }) => {
    try {
      const response = await premiumService.checkVPN();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const premiumSlice = createSlice({
  name: "premium",
  initialState: {
    plans: [],
    currentPlan: null,
    subscription: null,
    paymentHistory: [],
    stats: {
      totalRevenue: 0,
      premiumUsers: 0,
      conversionRate: 0,
      monthlyRecurring: 0,
      lifetimeRevenue: 0,
    },
    isPremium: false,
    isVerified: false,
    isLoading: false,
    isSubscribing: false,
    error: null,
    vpnStatus: {
      checked: false,
      isVPN: false,
      message: "",
    },
    verificationStatus: "none", // none, pending, verified, rejected
    features: {
      verifiedBadge: false,
      videoChat: false,
      aiAssistant: false,
      unlimitedStorage: false,
      prioritySupport: false,
      analytics: false,
      customThemes: false,
      adFree: false,
    },
    benefits: [],
  },
  reducers: {
    setPremiumStatus: (state, action) => {
      state.isPremium = action.payload.isPremium;
      state.isVerified = action.payload.isVerified || false;
      if (action.payload.subscription) {
        state.subscription = action.payload.subscription;
        state.currentPlan = action.payload.subscription.plan;
      }
    },
    setVerifiedStatus: (state, action) => {
      state.isVerified = action.payload;
    },
    setVPNStatus: (state, action) => {
      state.vpnStatus = {
        checked: true,
        isVPN: action.payload.isVPN,
        message: action.payload.message,
      };
    },
    updateFeatures: (state, action) => {
      state.features = { ...state.features, ...action.payload };
    },
    clearPremiumError: (state) => {
      state.error = null;
    },
    resetSubscription: (state) => {
      state.isPremium = false;
      state.subscription = null;
      state.currentPlan = null;
      state.features = {
        verifiedBadge: false,
        videoChat: false,
        aiAssistant: false,
        unlimitedStorage: false,
        prioritySupport: false,
        analytics: false,
        customThemes: false,
        adFree: false,
      };
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Premium Plans
      .addCase(fetchPremiumPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPremiumPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPremiumPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Subscribe to Premium
      .addCase(subscribeToPremium.pending, (state) => {
        state.isSubscribing = true;
        state.error = null;
      })
      .addCase(subscribeToPremium.fulfilled, (state, action) => {
        state.isSubscribing = false;
        state.isPremium = true;
        state.isVerified = true;
        state.subscription = action.payload.subscription;
        state.currentPlan = action.payload.plan;
        state.features = {
          verifiedBadge: true,
          videoChat: true,
          aiAssistant: true,
          unlimitedStorage: true,
          prioritySupport: true,
          analytics: true,
          customThemes: true,
          adFree: true,
        };
        state.verificationStatus = "verified";
      })
      .addCase(subscribeToPremium.rejected, (state, action) => {
        state.isSubscribing = false;
        state.error = action.payload;
      })

      // Cancel Subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.isLoading = false;
        state.isPremium = false;
        state.subscription = null;
        state.currentPlan = null;
        state.features = {
          verifiedBadge: false,
          videoChat: false,
          aiAssistant: false,
          unlimitedStorage: false,
          prioritySupport: false,
          analytics: false,
          customThemes: false,
          adFree: false,
        };
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Subscription Status
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPremium = action.payload.isPremium;
        state.isVerified = action.payload.isVerified;
        state.subscription = action.payload.subscription;
        state.currentPlan = action.payload.plan;
        state.verificationStatus = action.payload.verificationStatus || "none";

        if (action.payload.isPremium) {
          state.features = {
            verifiedBadge: true,
            videoChat: true,
            aiAssistant: true,
            unlimitedStorage: true,
            prioritySupport: true,
            analytics: true,
            customThemes: true,
            adFree: true,
          };
        }
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Payment History
      .addCase(getPaymentHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Verify Account
      .addCase(verifyAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verificationStatus = "pending";
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isVerified = true;
        state.verificationStatus = "verified";
        state.features.verifiedBadge = true;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.verificationStatus = "rejected";
      })

      // Get Premium Stats
      .addCase(getPremiumStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPremiumStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = {
          ...state.stats,
          ...action.payload,
        };
      })
      .addCase(getPremiumStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check VPN
      .addCase(checkVPN.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkVPN.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vpnStatus = {
          checked: true,
          isVPN: action.payload.isVPN,
          message: action.payload.message,
        };
      })
      .addCase(checkVPN.rejected, (state, action) => {
        state.isLoading = false;
        state.vpnStatus = {
          checked: true,
          isVPN: false,
          message: action.payload || "VPN check failed",
        };
      });
  },
});

export const {
  setPremiumStatus,
  setVerifiedStatus,
  setVPNStatus,
  updateFeatures,
  clearPremiumError,
  resetSubscription,
  updateStats,
} = premiumSlice.actions;

export default premiumSlice.reducer;
