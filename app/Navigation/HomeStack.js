import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import navigationStrings from '../constants/navigationStrings';
import SplashScreen from '../SplashScreen/SplashScreen';
import LoginScreen from '../LoginScreen/LoginScreen';
import VerifyOtpScreen from '../VerifyOtpScreen/VerifyOtpScreen';
import DashboardScreen from '../DashboardScreen/DashboardScreen';
import WithdrawEarnings from '../EarningsScreen/WithdrawEarnings';
import EditProfileScreen from '../ProfileScreen/EditProfileScreen';
import AcceptRejectOrder from '../AcceptRejectOrder/AcceptRejectOrder';
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={navigationStrings.SPLASHSCREEN}
        component={SplashScreen}
      />
      <Stack.Screen
        name={navigationStrings.LOGINSCREEN}
        component={LoginScreen}
      />
      <Stack.Screen
        name={navigationStrings.VERIFYOTP}
        component={VerifyOtpScreen}
      />
      <Stack.Screen
        name={navigationStrings.DASHBOARDSCREEN}
        component={DashboardScreen}
      />
      <Stack.Screen
        name={navigationStrings.WITHDRAWEARNINGS}
        component={WithdrawEarnings}
      />
      <Stack.Screen
        name={navigationStrings.EDITPROFILESCREEN}
        component={EditProfileScreen}
      />
       <Stack.Screen
        name={navigationStrings.ACCEPTREJECTORDER}
        component={AcceptRejectOrder}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
