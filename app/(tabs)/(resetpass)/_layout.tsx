import { Stack } from "expo-router"

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen
        name="index"
        options={{
            title: "",
            headerTransparent: true,
            headerShown:false
        }}
      />
    </Stack>
  )
}

export default _layout