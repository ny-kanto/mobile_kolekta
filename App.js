import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/pages/HomeScreen";
import PaymentScreen from "./src/pages/PaymentScreen";
import LoginForm from './src/pages/LoginForm';

const Stack = createStackNavigator();

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="Login" component={LoginForm} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
