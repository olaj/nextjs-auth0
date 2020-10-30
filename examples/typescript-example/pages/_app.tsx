import React from 'react';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';

export default function App({ Component, pageProps }: AppProps): React.ElementType<AppProps> {
  // If you've used `withAuth`, pageProps.user can pre-populate the hook
  // if you haven't used `withAuth`, pageProps.user is undefined so the hook
  // fetches the user from the API routes
  const { user, ...otherProps } = pageProps;

  return (
    <UserProvider user={user}>
      <Component {...otherProps} />
    </UserProvider>
  );
}
