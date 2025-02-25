import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "../screens/SplashScreen";
import TripPlanner from "../screens/TripPlanner";
import TripDetails from "../screens/TripDetails";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Hide header for SplashScreen */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

        {/* Show header with a title */}
        <Stack.Screen name="TripPlanner" component={TripPlanner} options={{ title: "Trip Planner" }} />

        {/* Show back button for TripDetails */}
        <Stack.Screen name="TripDetails" component={TripDetails} options={{ title: "Trip Details" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
