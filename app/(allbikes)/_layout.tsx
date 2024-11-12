import { Tabs } from "expo-router";
import RDim from "@/hooks/useDimensions";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: "#355E3B",
        tabBarStyle: {
          paddingHorizontal: "10%",
          height: RDim.height * 0.06,
          backgroundColor: '#D6D6CA'
        },
      }}>
      <Tabs.Screen
        name="adults"
        options={{
          title: "Adult Bikes",
          tabBarIconStyle: {
            display:'none'
          },
          tabBarLabelStyle:{
            fontSize:RDim.width * 0.055,
            paddingBottom: RDim.height * 0.01,
            fontFamily: 'mplus'
          },
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="kids"
        options={{
          title: "Kiddy Bikes",
          tabBarIconStyle: {
            display:'none'
          },
          tabBarLabelStyle:{
            fontSize:RDim.width * 0.055,
            paddingBottom: RDim.height * 0.01,
            fontFamily: 'mplus'
          },
          headerShown: false
        }}
      />
    </Tabs>
  );
}