import { useState, useEffect, useCallback, useContext } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { UserContext } from '../Store';

// NOTE: If you'd like, you can keep domain and client IDs in .env for security
const auth0Domain = 'dev-k677hwj8xdv51cs0.us.auth0.com';
const clientId = '3sSPuIJrqlcprrRc5i90gKM2Hj3Lz8Tg';

const API_BASE_URL = 'https://lifting-lads-api.onrender.com'; // Replace with your actual API URL

// Auth0's "discovery" endpoints
const discovery = {
  authorizationEndpoint: `https://${auth0Domain}/authorize`,
  tokenEndpoint: `https://${auth0Domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
};

const scopes = ['openid', 'profile', 'email'];

export function useAuth() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  const { userInfo, setUserInfo } = userContext;

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'liftinglads', // Must match the "scheme" in your app.json or app.config.js
  });

  console.log(redirectUri);

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

      // Save user to MongoDB
      await saveUserToDB(data);

      setUserInfo(data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }, []);

  // Save the user object to the backend
  const saveUserToDB = useCallback(async (user: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInfo: user }),
      });

      if (!response.ok) {
        console.error('Failed to save user to database:', await response.json());
      } else {
        console.log('User saved to database successfully');
      }
    } catch (error) {
      console.error('Error saving user to database:', error);
    }
  }, []);

  // Trigger the authentication flow
  const handleLogin = useCallback(() => {
    promptAsync();
  }, [promptAsync]);

  // Log out the user (clears Auth0 session and local state)
  const handleLogout = useCallback(async () => {
    setUserInfo(null);

    const returnTo = AuthSession.makeRedirectUri({
      scheme: 'liftinglads',
      path: 'loggedOut',
    });

    const logoutUrl =
      `https://${auth0Domain}/v2/logout?` +
      `client_id=${clientId}&` +
      `returnTo=${encodeURIComponent(returnTo)}`;

    WebBrowser.openBrowserAsync(logoutUrl);
    WebBrowser.dismissBrowser();
  }, []);

  return {
    userInfo,
    request,
    handleLogin,
    handleLogout,
  };
}
