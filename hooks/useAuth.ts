// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// NOTE: If you'd like, you can keep domain and client IDs in .env for security
const auth0Domain = 'dev-k677hwj8xdv51cs0.us.auth0.com';
const clientId = '3sSPuIJrqlcprrRc5i90gKM2Hj3Lz8Tg';

// Auth0's "discovery" endpoints
const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
};

const scopes = ['openid', 'profile', 'email'];

export function useAuth() {
  const [userInfo, setUserInfo] = useState<any>(null);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'liftinglads', // Must match the "scheme" in your app.json or app.config.js
  });
  console.log(redirectUri)
  // Set up the authentication request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes,
      responseType: AuthSession.ResponseType.Token,
    },
    discovery
  );

  // If the user successfully logs in, fetch the user info
  useEffect(() => {
    if (response?.type === 'success' && response.authentication) {
      const { accessToken } = response.authentication;
      fetchUserInfo(accessToken);
    }
  }, [response]);

  // Fetch the user's profile information from Auth0
  const fetchUserInfo = useCallback(async (token: string) => {
    try {
      const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await userInfoResponse.json();
      setUserInfo(data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }, []);

  // Trigger the authentication flow
  const handleLogin = useCallback(() => {
    promptAsync();
  }, [promptAsync]);

  // Log out the user (clears Auth0 session and local state)
  const handleLogout = useCallback(async () => {
    // 1. Clear local user state
    setUserInfo(null);

    // 2. Universal logout from Auth0’s session
    const returnTo = AuthSession.makeRedirectUri({
      scheme: 'liftinglads',
      path: 'loggedOut', // or some path you want to handle after logout
    });

    const logoutUrl =
      `https://${auth0Domain}/v2/logout?` +
      `client_id=${clientId}&` +
      `returnTo=${encodeURIComponent(returnTo)}`;

    // 3. Open the browser to log out from Auth0
    await WebBrowser.openBrowserAsync(logoutUrl);
    // Close the WebBrowser again (on iOS, might need slightly different flow)
    WebBrowser.dismissBrowser();
  }, []);

  return {
    userInfo,
    request, // Expose if you need to conditionally disable login button
    handleLogin,
    handleLogout,
  };
}
