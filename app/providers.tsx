"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const ReduxProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};
