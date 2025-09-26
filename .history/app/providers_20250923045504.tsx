"use client";
import { ReactNode, useEffect } from "react";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { loadAuth } from "@/features/auth/authSlice";

const queryClient = new QueryClient();

function AuthLoader() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadAuth());
  }, [dispatch]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthLoader />
        {children}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
