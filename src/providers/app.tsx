import * as React from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query'

import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from "react-redux";
import { Toaster } from 'react-hot-toast';

import { Spinner } from '../components/Elements/Spinner';
import store from "../stores/store";

const ErrorFallback = () => {
  return (
    <div
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <button className="mt-4 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </button>
    </div>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const queryClient = new QueryClient()
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>


        <React.Suspense
          fallback={
            <div className="flex items-center justify-center w-screen h-screen">
              <Spinner size="xl" />
            </div>
          }
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Router>{children}</Router>
            <Toaster />
          </ErrorBoundary>

        </React.Suspense>
      </QueryClientProvider>
    </Provider>
  )
}
