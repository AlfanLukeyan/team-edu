import { useAuth } from "@/hooks/useAuth";
import { ErrorModalEmitter } from "@/services/api_services";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TextInput } from "@/components/AuthTextInput";
import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function LoginScreen() {
  const theme = useColorScheme() ?? "light";
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      ErrorModalEmitter.emit("SHOW_ERROR", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // await loginUser(email, password);
      router.push("/(auth)/face_auth");
    } catch (error) {
      ErrorModalEmitter.emit("SHOW_ERROR", "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.header}>
            <ThemedText type="title" >
              Team Edu
            </ThemedText>
            <ThemedText>
              Sign in to continue your learning journey
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              leftIcon="person.fill"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              leftIcon="lock.circle.fill"
              isPassword
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push("/(auth)/forgot_password")}>
              <ThemedText style={{ color: Colors[theme].tint }}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <Button onPress={handleLogin} disabled={isLoading} style={styles.loginButton}>
              {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <ThemedView style={styles.signUpContainer}>
            <ThemedText style={{textAlignVertical:'bottom'}}>Don't have an account? </ThemedText>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <ThemedText style={{ color: Colors[theme].tint }}>
                Sign Up
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  testButton: {
    marginBottom: 20,
    backgroundColor: '#ff6b6b',
  },
  form: {
    marginBottom: 32,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  loginButton: {
    marginBottom: 24,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});