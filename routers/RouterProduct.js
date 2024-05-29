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
    const handleDelete = (Product) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this Product? This operation cannot be returned",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('Product')
                            .doc(Product.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Products");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa dịch vụ:", error);
                            });
                    },
                    style: "default"
                }
            ]
        );
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
            
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && (userLogin.fullName)}} name="Product" component={Product} />
            
            <Stack.Screen name="AddNewProduct" component={AddNewProduct} /> 
            <Stack.Screen name="ProductDetail" component={ProductDetail} /> 
            <Stack.Screen name="ProductUpdate" component={ProductUpdate} /> 
             
            
         </Stack.Navigator>
       
    )
}

    
   

export default RouterProduct;
