import { createStackNavigator } from "@react-navigation/stack";
import Places from '../screens/Places';
import AddNewPlace from "../screens/AddNewPlace";
import PlaceDetail from '../screens/PlaceDetail';
import PlaceUpdate from "../screens/PlaceUpdate";
import { logout,useMyContextProvider } from "../index";
import { Text, IconButton } from "react-native-paper";
import { Menu, MenuTrigger, MenuOption, MenuOptions } from "react-native-popup-menu";
import { Alert, Image } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from "react-native-gesture-handler";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Setting from "../screens/Setting";
import { useEffect } from "react"
const Stack = createStackNavigator();


const RouterPlace = ({ navigation }) => {
    const [controller,dispatch] = useMyContextProvider();
    const { userLogin } = controller;

    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
        }, [userLogin])

    const handleLogout = () => {
        logout(dispatch);
    };
    const handleDelete = (Place) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this place? This operation cannot be returned",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('Place')
                            .doc(Place.id)
                            .delete()
                            .then(() => {
                                console.log("Bàn đã được xóa thành công!");
                                navigation.navigate("Places");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa bàn", error);
                            });
                    },
                    style: "default"
                }
            ]
        );
    };
    
    return (
        <Stack.Navigator 
            initialRouteName="Places"
            screenOptions={{
                headerTitleAlign: "left",
                headerTintColor: "cyan",
                headerRight: (props) => (
                    <TouchableOpacity onPress={handleLogout}>
                      <Image source={require('../assets/exit.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
                  
                  
            }} 
        > 
            
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && (userLogin.fullName),
             headerStyle: {
                backgroundColor: "hsla(0, 0%, 0%, 1)"
            },
            headerTitleStyle:{
                                         color:'hsla(180, 100%, 50%, 1)'
                                    }  }} name="Places" component={Places} />
            <Stack.Screen  options={{
                            headerStyle: {
                                backgroundColor: "hsla(0, 0%, 0%, 1)"
                            },
                           
                        }}
                            name="AddNewPlace" component={AddNewPlace} /> 
            <Stack.Screen
                        options={{
                            headerStyle: {
                                backgroundColor: "hsla(0, 0%, 0%, 1)"
                            },
                           
                        }} name="PlaceUpdate" component={PlaceUpdate} /> 
         </Stack.Navigator>
       
    )
}

    
   

export default RouterPlace;
