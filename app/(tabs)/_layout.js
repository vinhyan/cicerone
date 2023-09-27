import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#14213d",
        },
        headerTintColor: "#fca311",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: "#14213d",
        },
        tabBarActiveTintColor: "#fca311",
        tabBarInactiveTintColor: "#ffffff",
        tabBarLabelStyle: {
          display: "none",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "#FCA311" : "#FFFFFF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="list"
              size={24}
              color={focused ? "#FCA311" : "#FFFFFF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search"
              size={24}
              color={focused ? "#FCA311" : "#FFFFFF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings"
              size={24}
              color={focused ? "#FCA311" : "#FFFFFF"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
