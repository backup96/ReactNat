import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View} from "react-native";
import { Slot, Stack } from "expo-router";
import { Fragment } from "react";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
    </Stack>
  );
}

export default RootLayout;
