import { Ro } from "./../../../../node_modules/@jridgewell/trace-mapping/src/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserData = {
  _id?: string;
  email?: string;
  username?: string;
  role?: string;
  profile?: object;
};
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}
interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
}
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_REFRESH_KEY = "auth_refresh_token";

const saveAuthToStorage = (
  accessToken: string,
  refreshToken: string,
  user: UserData
) => {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_REFRESH_KEY, refreshToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const clearAuthFromStorage = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const loadAuthFromStorage = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const refreshToken = localStorage.getItem(AUTH_REFRESH_KEY);
  const userStr = localStorage.getItem(AUTH_USER_KEY);

  if (token && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { token, refreshToken, user };
    } catch {
      clearAuthFromStorage();
      return null;
    }
  }
  return null;
};
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthResponse>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      saveAuthToStorage(
        action.payload.accessToken,
        action.payload.refreshToken,
        action.payload.user
      );
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearAuthFromStorage();
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    refreshTokenSuccess(state, action: PayloadAction<AuthResponse>) {
      // Merge user info to preserve any existing fields
      state.user = { ...state.user, ...action.payload.user };
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      saveAuthToStorage(
        action.payload.accessToken,
        action.payload.refreshToken,
        state.user!
      );
    },
  },
});
export const { loginSuccess, logout, setLoading, refreshTokenSuccess } =
  authSlice.actions;
export default authSlice.reducer;
