import {View} from "react-native"
import {Button} from "react-native-paper"
import { logout, useMyContextProvider } from "../index"
import { useEffect } from "react"
import Profile from "./Profile"

const Setting = ({navigation}) => {
    const [controller, dispatch] = useMyContextProvider();
    const {userLogin} = controller
    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
    }, [userLogin])

    const handleLogout = () => {
        logout(dispatch);
    };
    
    
    return(
        <View style={{ padding:40, flex:1, justifyContent:"center"}}>
            <Button
                buttonColor="#A52A2A"
                textColor="black"
                mode="contained"
                onPress={handleLogout}
            >
                Logout
            </Button>
           
        </View>
    )
}

export default Setting