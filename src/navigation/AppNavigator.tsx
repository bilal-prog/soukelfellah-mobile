import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAuth } from "@/context/AuthContext"
import { ListingDetailsScreen } from "@/screens/ListingDetailsScreen"
import { NotificationsScreen } from "@/screens/NotificationsScreen"
import { LoginScreen } from "@/screens/LoginScreen"
import { RegisterScreen } from "@/screens/RegisterScreen"
import { VerifyPhoneScreen } from "@/screens/VerifyPhoneScreen"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { EditListingScreen } from "@/screens/EditListingScreen"
import { LegalScreen } from "@/screens/LegalScreen"
import { ForgotPasswordScreen } from "@/screens/ForgotPasswordScreen"
import { setAuthToken } from "@/services/api"
import { useAppTheme } from "@/theme/context"

// Import Screens

import { MainTabNavigator } from "./MainTabNavigator"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated, isGuest, accessToken } = useAuth()
  const {
    theme: { colors },
  } = useAppTheme()

  // Keep authorization header synchronized
  useEffect(() => {
    setAuthToken(accessToken)
  }, [accessToken])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {isAuthenticated || isGuest ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="EditListing" component={EditListingScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyPhone" component={VerifyPhoneScreen} />
        </>
      )}
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}



export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => ["Welcome", "MainTabs"].includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <AppStack />
    </NavigationContainer>
  )
}
export default AppNavigator
