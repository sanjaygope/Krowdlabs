import { Stack } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from '../utils/supabase';
import { Platform } from 'react-native';
import "../global.css";
import '../utils/i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // required in newer SDK
    shouldShowList: true, // required in newer SDK
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      console.log('Error getting push token', e);
    }
  } else {
    // Physical device required
  }

  return token;
}

export default function RootLayout() {
  const { user, isLoading } = useAuthStore();
  const segments = useSegments() as string[];
  const router = useRouter();
  const [navigationReady, setNavigationReady] = React.useState(false);

  // Notification listeners (Subscription type)
  const notificationListener = useRef<Notifications.Subscription>(undefined);
  const responseListener = useRef<Notifications.Subscription>(undefined);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Notification received while app is foregrounded
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // User tapped on notification
      console.log(response);
    });

    setNavigationReady(true);

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, []);

  // Sync Push Token to user profile whenever user auth changes
  useEffect(() => {
    if (user && !user.isNewUser) {
      registerForPushNotificationsAsync().then(async (token) => {
        if (token) {
          await supabase
            .from('workers')
            .update({ push_token: token })
            .eq('id', user.id);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (isLoading || !navigationReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the login page.
      router.replace('/(auth)/welcome');
    } else if (user) {
      if (user.isNewUser) {
        // Redirect to profile setup if new
        if (segments[1] !== 'setup') router.replace('/(auth)/setup');
      } else if (inAuthGroup) {
        // Logged in and not new, redirect to home
        router.replace('/(app)/home');
      }
    }
  }, [user, isLoading, segments, navigationReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

