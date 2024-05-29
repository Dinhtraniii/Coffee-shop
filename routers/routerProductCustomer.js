import { createStackNavigator } from "@react-navigation/stack";
import Product from '../screens/Product';
import AddNewProduct from '../screens/AddNewProduct';
import ProductDetail from '../screens/ProductDetail';
import ProductUpdate from "../screens/ProductUpdate";
import {logout, useMyContextProvider } from "../index";
import { Text, IconButton } from "react-native-paper";
import { Menu, MenuTrigger, MenuOption, MenuOptions } from "react-native-popup-menu";
import { Alert, Image } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from "react-native-gesture-handler";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Setting from "../screens/Setting";
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
