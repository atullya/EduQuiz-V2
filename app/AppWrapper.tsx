"use client";

import {
  loadAuthFromStorage,
  loginSuccess,
} from "@/lib/store/slices/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = loadAuthFromStorage();
    if (auth) {
      dispatch(
        loginSuccess({
          user: auth.user,
          accessToken: auth.token,
          refreshToken: auth.refreshToken,
        })
      );
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AppWrapper;
