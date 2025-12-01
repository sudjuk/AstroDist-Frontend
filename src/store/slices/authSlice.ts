import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/httpClient';
import type { RootState } from '../index';

export interface PublicUser {
  id: number;
  login: string;
  isModerator: boolean;
}

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('auth_token'),
  loading: false,
  error: null,
};

interface LoginPayload {
  login: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const login = createAsyncThunk<
  { token: string; user: PublicUser },
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post<LoginResponse>('/api/auth/login', payload);
    const token = data.access_token;
    localStorage.setItem('auth_token', token);

    const profile = await api.get<PublicUser>('/api/me');
    return { token, user: profile.data };
  } catch (e: any) {
    const message = e?.response?.data?.error || e?.message || 'Ошибка авторизации';
    return rejectWithValue(message);
  }
});

export const register = createAsyncThunk<
  { token: string; user: PublicUser },
  LoginPayload,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    await api.post('/api/auth/register', payload);
    const { data } = await api.post<LoginResponse>('/api/auth/login', payload);
    const token = data.access_token;
    localStorage.setItem('auth_token', token);

    const profile = await api.get<PublicUser>('/api/me');
    return { token, user: profile.data };
  } catch (e: any) {
    const message = e?.response?.data?.error || e?.message || 'Ошибка регистрации';
    return rejectWithValue(message);
  }
});

export const fetchProfile = createAsyncThunk<
  PublicUser,
  void,
  { state: RootState; rejectValue: string }
>('auth/fetchProfile', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;
  if (!token) {
    return rejectWithValue('Нет токена');
  }
  try {
    const { data } = await api.get<PublicUser>('/api/me');
    return data;
  } catch (e: any) {
    const message = e?.response?.data?.error || e?.message || 'Ошибка загрузки профиля';
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      localStorage.removeItem('auth_token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка авторизации';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<PublicUser>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка загрузки профиля';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;


