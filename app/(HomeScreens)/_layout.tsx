import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#355E3B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="lock" options={{}} />
      <Stack.Screen name="timetrack" options={{headerShown: false}} />
      <Stack.Screen name="rentdue" options={{headerShown: false}} />
    </Stack>
  );
}
