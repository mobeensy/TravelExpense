import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SplashScreen from "../screens/SplashScreen";
import TripPlanner from "../screens/TripPlanner";
import TripDetails from "../screens/TripDetails";
import Dashboard from "../screens/Dashboard";
import ExportPage from "../screens/ExportPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 🚀 Stack for TripPlanner (Includes TripDetails)
const TripStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TripPlanner" component={TripPlanner} options={{ title: "Trip Planner" }} />
    <Stack.Screen name="TripDetails" component={TripDetails} options={{ title: "Trip Details" }} />
  </Stack.Navigator>
);

// 🚀 Bottom Tabs (For Home & Dashboard)
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = "help-circle"; // Default fallback icon

        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Dashboard") {
          iconName = "stats-chart";
        } else if (route.name === "Export") {
          iconName = "download";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007BFF",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={TripStack} />
    <Tab.Screen name="Dashboard" component={Dashboard} />
    <Tab.Screen name="Export" component={ExportPage} />
    {/* ✅ Ensure this is a valid React component */}
  </Tab.Navigator>
);

// 🚀 Main Navigator (Includes Splash Screen)
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* SplashScreen should go first */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Once Splash is done, navigate to Bottom Tabs */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
