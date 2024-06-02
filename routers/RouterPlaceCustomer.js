import { createStackNavigator } from "@react-navigation/stack";
import PlacesCustomer from '../screens/PlaceCustomer';
import { logout,useMyContextProvider } from "../index";
import Appointment from "../screens/Appointment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import { useEffect } from "react"

const Stack = createStackNavigator();

const RouterPlaceCustomer = ({ navigation }) => {
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
            initialRouteName="PlacesCustomer"
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
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && (userLogin.fullName)}} name="PlacesCustomer" component={PlacesCustomer} />
            <Stack.Screen name="Appointment" component={Appointment} />
        </Stack.Navigator>
    )
}

export default RouterPlaceCustomer;
