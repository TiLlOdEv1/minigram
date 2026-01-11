// minigram/src/store/slices/premiumSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const subscribePremium = createAsyncThunk(
  'premium/subscribe',
  async ({ plan, paymentMethod }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        '/api/premium/subscribe',
        { plan, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Subscription failed')
    }
  }
)

const premiumSlice = createSlice({
  name: 'premium',
  initialState: {
    isPremium: false,
    verified: false,
    subscriptionEnd: null,
    plan: null,
    features: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPremiumStatus: (state, action) => {
      state.isPremium = action.payload.isPremium
      state.verified = action.payload.verified
      state.subscriptionEnd = action.payload.subscriptionEnd
      state.plan = action.payload.plan
      state.features = action.payload.features || []
    },
    clearPremiumError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribePremium.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(subscribePremium.fulfilled, (state, action) => {
        state.loading = false
        state.isPremium = true
        state.verified = true
        state.plan = action.payload.plan
        state.subscriptionEnd = action.payload.subscriptionEnd
        state.features = action.payload.features
      })
      .addCase(subscribePremium.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setPremiumStatus, clearPremiumError } = premiumSlice.actions
export default premiumSlice.reducer