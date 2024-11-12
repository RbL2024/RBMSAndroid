import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#fff",
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen
        name="preview"
        options={{ headerTransparent: true, title: "" }}
      />
      <Stack.Screen
        name="reserve"
        options={{
          title: "Reserve",
          headerStyle: {
            backgroundColor: '#355E3B'
          },
        }}
      />
    </Stack>
  );
}
