import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import 'react-native-reanimated';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Button, Text, View, StyleSheet } from 'react-native'
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import TopRightIcons from './TopRightIcons';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [userInfo, setUserInfo] = useState(null);

  const auth0Domain = 'dev-k677hwj8xdv51cs0.us.auth0.com';
  const clientId = '3sSPuIJrqlcprrRc5i90gKM2Hj3Lz8Tg';
  const discovery = {
    authorizationEndpoint: `https://${auth0Domain}/authorize`,
    tokenEndpoint: `https://${auth0Domain}/oauth/token`,
    revocationEndpoint: `https://${auth0Domain}/oauth/revoke`,
  };
  const scopes = ['openid', 'profile', 'email'];
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'liftinglads',
    });
    console.log(redirectUri)
  
    const authUrl = `https://${auth0Domain}/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=openid profile email`;

        const [request, response, promptAsync] = AuthSession.useAuthRequest(
          {
            clientId: clientId,
            redirectUri,
            scopes,
            // Auth0 requires `response_type=token` or `code`
            responseType: AuthSession.ResponseType.Token, 
            extraParams: {
              // Optionally, you can add additional parameters.
              // E.g., If using PKCE or turning on certain features.
              // `audience` is often needed if you want to call a specific API.
              // audience: 'https://myapi.example.com',
            },
          },
          discovery
        );

    // Handle the response
    useEffect(() => {
      if (response?.type === 'success' && response.authentication) {
        // You can now use the `accessToken` to get the user's profile.
        const { accessToken } = response.authentication;
        fetchUserInfo(accessToken);
      }
    }, [response]);
  
    // Fetch the user’s profile information from Auth0
    const fetchUserInfo = async (token: any) => {
      try {
        const userInfoResponse = await fetch(`https://${auth0Domain}/userinfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await userInfoResponse.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
  
    const handleLogin = () => {
      promptAsync();
    };

    const handleLogout = async () => {
      // 1. Clear local user state
      setUserInfo(null);
  
      // 2. Universal logout from Auth0’s session
      // Construct the logout URL with a returnTo parameter
      // that Auth0 will redirect back to when the logout is complete.
      // Make sure returnTo is also listed in "Allowed Logout URLs" in Auth0
      // or Auth0 will reject it.
      const returnTo = AuthSession.makeRedirectUri({
        scheme: 'liftinglads',
        path: 'loggedOut',
      });
      //const returnTo = redirectUri;
      console.log(returnTo)
      const logoutUrl = `https://${auth0Domain}/v2/logout?` +
        `client_id=${clientId}&` +
        `returnTo=${encodeURIComponent(returnTo)}`;
  
      // 3. Open the browser to log out from Auth0
      WebBrowser.openBrowserAsync(logoutUrl);
      WebBrowser.dismissBrowser();
    };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <TopRightIcons />
    <View style={styles.container}>
    {!userInfo && <Button
          title="Login with Auth0"
          disabled={!request}
          onPress={handleLogin}
        />}
    {userInfo && <Button title="Logout" onPress={handleLogout} />}
    </View>
     {userInfo && <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});