import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/ui/navigation/AppNavigator";
import { deleteDatabase, initDatabase } from "./src/database/Database"; // Ensure this is imported

const App = () => {
  useEffect(() => {
    const setupDatabase = async () => {
      // await deleteDatabase();
      await initDatabase();
    };

    setupDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
