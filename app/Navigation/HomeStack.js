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
import ActiveDelivery from '../ActiveScreen/ActiveDelivery';
import AllProfileScreen from '../ALLProfileScreen/AllProfileScreen';
import DocumentsUploadSection from '../DocumentsUploadSection/DocumentsUploadSection';
import KYCPageVerification from '../KYCPageVerification/KYCPageVerification';
import KYCApproved from '../KYCApproved/KYCApproved';
import LiveLocationMap from '../LiveLocationMap/LiveLocationMap';
import LiveLocationShow from '../LiveLocationMap/LiveLocationShow';

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
      
       <Stack.Screen
        name={navigationStrings.ACTIVEDELIVERY}
        component={ActiveDelivery}
      />
      <Stack.Screen
        name={navigationStrings.ALLPROFILESCREEN}
        component={AllProfileScreen}
      />
       <Stack.Screen
        name={navigationStrings.DOCUMENTSUPLOADSECTION}
        component={DocumentsUploadSection}
      />
        <Stack.Screen
        name={navigationStrings.KYCVERIFICATION}
        component={KYCPageVerification}
      />
         <Stack.Screen
        name={navigationStrings.KYCAPPROVED}
        component={KYCApproved}
      />
         <Stack.Screen
        name={navigationStrings.LIVELOCATIONMAP}
        component={LiveLocationMap}
      />
          <Stack.Screen
        name={navigationStrings.LIVELOCATIONSHOW}
        component={LiveLocationShow}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;



