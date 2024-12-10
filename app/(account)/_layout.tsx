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
      <Stack.Screen
        name="forgetpass"
        options={{
            title: "",
            headerTransparent: true,
            
        }}
      />
      <Stack.Screen
        name="fpverification"
        options={{
            title: "",
            headerTransparent: true,
            
        }}
      />
      <Stack.Screen
        name="newpass"
        options={{
            title: "",
            headerTransparent: true,
            
        }}
      />
       <Stack.Screen
        name="resetpass"
        options={{
            title: "",
            headerTransparent: true,
            
        }}
      />
    </Stack>
    
  );
}
