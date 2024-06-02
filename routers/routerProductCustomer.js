import { createStackNavigator } from "@react-navigation/stack";

import {logout, useMyContextProvider } from "../index";

import { Alert, Image } from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";

import { useEffect } from "react"
import Cart from "../screens/Cart";
import ProductCustomer from "../screens/ProductCustomer";
const Stack = createStackNavigator();


const RouterProduct = ({ navigation }) => {
    const [controller,dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
        }, [userLogin])

    const handleLogout = () => {
        logout(dispatch);
    };
    return (
        
        <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "#99FFFF"
                },
              
                headerRight: (props) => (
                    <TouchableOpacity onPress={handleLogout}>
                      <Image source={require('../assets/logout.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
                  
            }} 
        > 
            
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && (userLogin.fullName)}} name="ProductCustomer" component={ProductCustomer} />
            <Stack.Screen name="Cart" component={Cart} />
            
         </Stack.Navigator>
       
    )
}

    
   

export default RouterProduct;
