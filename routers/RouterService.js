import { createStackNavigator } from "@react-navigation/stack";
import Services from '../screens/Services';
import AddNewService from '../screens/AddNewService';
import ServiceDetail from '../screens/ServiceDetail';
import ServiceUpdate from "../screens/ServiceUpdate";
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


const RouterService = ({ navigation }) => {
    const [controller,dispatch] = useMyContextProvider();
    const { userLogin } = controller;

    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
        }, [userLogin])

    const handleLogout = () => {
        logout(dispatch);
    };
    const handleDelete = (service) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this service? This operation cannot be returned",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('Service')
                            .doc(service.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Services");
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
            initialRouteName="Services"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "#99FFFF"
                },
                headerRight: (props) => (
                    <TouchableOpacity 
                        onPress={handleLogout}>
                      <Image source={require('../assets/logout.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
                  
            }} 
        > 
            
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && (userLogin.fullName)}} name="Services" component={Services} />
            <Stack.Screen name="AddNewService" component={AddNewService} /> 
            <Stack.Screen
                name="ServiceDetail"
                component={ServiceDetail}
                options={({ route }) => ({
                    headerRight: () => (
                        <Menu>
                            <MenuTrigger>
                            <Image source={require('../assets/dots.png')} style={{ width: 30, height: 30, margin: 20 }} />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => navigation.navigate("ServiceUpdate", { service: route.params.service })}>
                                    <Text>Update</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => handleDelete(route.params.service)}>
                                    <Text>Delete</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    )
                })}
            />
            <Stack.Screen name="ServiceUpdate" component={ServiceUpdate} /> 
         </Stack.Navigator>
       
    )
}

    
   

export default RouterService;
