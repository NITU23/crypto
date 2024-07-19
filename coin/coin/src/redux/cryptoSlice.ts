import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Coin {
  code: string;
  rate: number;
  volume: number;
  cap: number;
}

interface CryptoState {
  coins: Coin[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  coins: [],
  loading: false,
  error: null,
};

export const fetchCoins = createAsyncThunk<Coin[], string>(
  'crypto/fetchCoins',
  async (selectedCode: string) => {
    try {
      const response = await axios.get<Coin[]>(`http://localhost:500?coin=${selectedCode}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch coins');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    clearCoins(state) {
      state.coins = []; // Clear coins array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action: PayloadAction<Coin[]>) => {
        state.coins = action.payload; // Replace coins array with new data
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coins';
      });
  },
});

export const { clearCoins } = cryptoSlice.actions;

export default cryptoSlice.reducer;
