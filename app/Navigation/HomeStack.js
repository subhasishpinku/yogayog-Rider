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
import CodAmountCollect from '../CodAmountCollect/CodAmountCollect';
import QRPayment from '../QRPayment/QRPayment';
import CollectedCash from '../CollectedCash/CollectedCash';
import CashCollection from '../CashCollection/CashCollection';
import NonDeliveryReport from '../NonDeliveryReport/NonDeliveryReport';
import RTODetails from '../RTODetails/RTODetails';
import RescheduleDelivery from '../RescheduleDelivery/RescheduleDelivery';
import CODHandover from '../CODHandover/CODHandover';
import CallCustomer from '../CallCustomers/CallCustomers';
import RegisterScreen from '../RegisterScreen/RegisterScreen';
import DeactivateScreen from '../ActiveScreen/DeactivateScreen';
import ActiveList from '../ActiveScreen/ActiveList';
import ActiveScreen from '../ActiveScreen/ActiveScreen';
import WalletScreen from '../WalletScreen/WalletScreen';
import OnlinePayment from '../OnlinePayment/OnlinePayment';
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
         <Stack.Screen
        name={navigationStrings.CODAMOUNTCOLLECT}
        component={CodAmountCollect}
      />
         <Stack.Screen
        name={navigationStrings.QRPAYMENT}
        component={QRPayment}
      />
      <Stack.Screen
        name={navigationStrings.CASHCOLLECTION}
        component={CashCollection}
      />
      <Stack.Screen
        name={navigationStrings.COLLECTEDCASH}
        component={CollectedCash}
      />
      <Stack.Screen
        name={navigationStrings.NONDELIVERYREPORT}
        component={NonDeliveryReport}
      />
        <Stack.Screen
        name={navigationStrings.RTODETAILS}
        component={RTODetails}
      />
       <Stack.Screen
        name={navigationStrings.RESCHEDULEDELIVERY}
        component={RescheduleDelivery}
      />
       <Stack.Screen
        name={navigationStrings.CODHANDOVER}
        component={CODHandover}
      />
       <Stack.Screen
        name={navigationStrings.CALLCUSTOMER}
        component={CallCustomer}
      />
         <Stack.Screen
        name={navigationStrings.REGISTERSCREEN}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={navigationStrings.DEACTIVATESCREEN}
        component={DeactivateScreen}
      />
      <Stack.Screen
        name={navigationStrings.ACTIVELIST}
        component={ActiveList}
      />
       <Stack.Screen
        name={navigationStrings.ACTIVESCREEN}
        component={ActiveScreen}
      />
      <Stack.Screen
        name={navigationStrings.WALLETSCREEN}
        component={WalletScreen}
      />
       <Stack.Screen
        name={navigationStrings.ONLINEPAYMENT}
        component={OnlinePayment}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;



