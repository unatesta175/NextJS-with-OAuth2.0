"use client";
import { ReactNode, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { useAppDispatch } from '@lib/reduxHooks';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { checkAuthStatus } from "@/features/auth/authSlice";

const queryClient = new QueryClient();

function AuthLoader() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Since the cookie is HTTP-only, we can't detect it with JavaScript
    // Always try to check auth status - the backend will return 401 if no valid session
    dispatch(checkAuthStatus());
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
