import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import RDim from "@/hooks/useDimensions";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#355E3B",
        tabBarStyle: {
          paddingHorizontal: "10%",
          height: RDim.height * 0.06,
          backgroundColor: '#D6D6CA'
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={32} name="home" color={color} />
          ),
          headerShown: false,
          
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history-edu" size={32} color={color} />
          ),
          headerTitleStyle:{
            color:"white",
            fontSize: 28,
            fontFamily: 'mplusb'
          },
          headerStyle:{
            backgroundColor:'#355E3B'
          }
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="notifications-active"
              size={32}
              color={color}
            />
          ),
          headerTitleStyle:{
            color:"white",
            fontSize: 28,
            fontFamily: 'mplusb'
          },
          headerStyle:{
            backgroundColor:'#355E3B'
          },
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Accounts",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={32} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="(resetpass)"
        options={{
          title: "Reset Password",
          headerShown: false,
          href: null,
          tabBarStyle: {
            display: 'none'
          }
        }}
      />
    </Tabs>
  );
}
