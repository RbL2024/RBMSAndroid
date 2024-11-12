import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#355E3B",
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen
        name="login"
        options={{
            title: "",
            headerTransparent: true,
            
        }}
      />
      <Stack.Screen
        name="register"
        options={{
            title: "",
            headerTransparent: true,
            
        }}
      />
    </Stack>
  );
}
