import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import useConnection from "@/hooks/useConnection";
import ToastManager, { Toast } from "toastify-react-native";
import { View, AppState } from "react-native";
import RDim from "@/hooks/useDimensions";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isConnected } = useConnection(); // State to track server connection
  const [appState, setAppState] = useState(AppState.currentState);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    mplus: require("../assets/fonts/MPLUS1p-Regular.ttf"),
    mplusb: require("../assets/fonts/MPLUS1p-Bold.ttf"),
    jsans: require("../assets/fonts/JosefinSans-Regular.ttf"),
    jsansb: require("../assets/fonts/JosefinSans-Bold.ttf"),
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // App has come to the foreground
        console.log("App has come to the foreground!");
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (isConnected) {
      Toast.success("connected now.");
    }
  }, [isConnected]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <ToastManager
        position="bottom"
        style={{minWidth: RDim.width*.9}}
        textStyle={{ fontSize: 12 }}
        duration={2000}
        showCloseIcon={false}
      />
      <Stack
        screenOptions={{
          statusBarStyle: "light",
          statusBarColor: "#355E3B",
          // statusBarColor: '#D6D6CA'
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(HomeScreens)" options={{ headerShown: false }} />
        <Stack.Screen name="(bikePrevRes)" options={{ headerShown: false }} />
        <Stack.Screen name="(account)" options={{ headerShown: false }} />
        <Stack.Screen name="(allbikes)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}
