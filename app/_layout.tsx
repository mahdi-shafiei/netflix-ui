import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { RootScaleProvider } from '@/contexts/RootScaleContext';
import { useRootScale } from '@/contexts/RootScaleContext';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OverlayProvider } from '@/components/Overlay/OverlayProvider';
import { MiniPlayer } from '@/components/BottomSheet/MiniPlayer';
import { useRouter } from 'expo-router';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { WhoIsWatching } from '../components/WhoIsWatching';
import { UserProvider } from '@/contexts/UserContext';
import { useUser } from '@/contexts/UserContext';

function AnimatedStack() {
  const { scale } = useRootScale();
  const router = useRouter();
  const [isModalActive, setIsModalActive] = useState(false);
  const { selectedProfile, selectProfile } = useUser();
  const colorScheme = useColorScheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          translateY: (1 - scale.value) * -150,
        },
      ],
    };
  });

  // return <WhoIsWatching onProfileSelect={selectProfile} />;


  if (!selectedProfile) {
    return <WhoIsWatching onProfileSelect={selectProfile} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {isModalActive && (
        <BlurView
          intensity={50}
          style={[
            StyleSheet.absoluteFill,
            { zIndex: 1 }
          ]}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
        />
      )}
      <Animated.View style={[styles.stackContainer, animatedStyle]}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="movie/[id]"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
            listeners={{
              focus: () => setIsModalActive(true),
              beforeRemove: () => setIsModalActive(false),
            }}
          />
          <Stack.Screen
            name="switch-profile"
            options={{
              presentation: 'transparentModal',
              headerShown: false,
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
            listeners={{
              focus: () => setIsModalActive(true),
              beforeRemove: () => setIsModalActive(false),
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>

      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootScaleProvider>
          <UserProvider>
            <OverlayProvider>
              <AnimatedStack />
            </OverlayProvider>
          </UserProvider>
        </RootScaleProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  stackContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 5,
  },
});

