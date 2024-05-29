import {createStackNavigator} from "@react-navigation/stack"
import Login from "../screens/Login"
import Register from "../screens/Register"
import Admin from "../screens/Admin"
import Customer from "../screens/Customer"
import ForgotPassword from "../screens/ForgotPassword"
import Home from "../screens/Home"

const Stack = createStackNavigator()

const Router = () =>{
    return(
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Admin" component={Admin}/>
            <Stack.Screen name="Customer" component={Customer}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        </Stack.Navigator>
    )
}

export default Router;