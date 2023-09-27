import { Stack, useRouter } from "expo-router";
import { Button, Platform, Pressable } from "react-native";
import UserContextProvider from "./context/UserContext";

export default function Layout() {
  const router = useRouter();

  const cancelButton = () => {
    if (Platform.OS === "ios") {
      return (
        <Button
          title="Cancel"
          color={Platform.OS === "ios" ? "#fff" : "#FCA311"}
          onPress={() => router.back()}
        />
      );
    } else if (Platform.OS === "web") {
      return (
        <Pressable
          onPress={() => router.back()}
          style={{
            padding: 10,
            borderRadius: 5,
            margin: 10,
            alignSelf: "flex-start",
            font: "400 18px system-ui",
          }}
        >
          <Text style={{ color: "#FCA311" }}>Cancel</Text>
        </Pressable>
      );
    }
  };

  return (
    <UserContextProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="(modals)/beer-modal"
          options={{
            presentation: "modal",
            headerTintColor: "#FCA311",
            headerStyle: {
              backgroundColor: "#14213D",
            },
            headerLeft: cancelButton,
          }}
        />
        <Stack.Screen
          name="(modals)/itemDetail"
          options={{
            presentation: "modal",
            headerTintColor: "#FCA311",
            headerStyle: {
              backgroundColor: "#14213D",
            },
            headerLeft: cancelButton,
          }}
        />
      </Stack>
    </UserContextProvider>
  );
}
