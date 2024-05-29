import React, { useState, useEffect } from "react";
import { View, FlatList,TouchableOpacity,Alert } from "react-native";
import { Text,Image } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import {logout, useMyContextProvider } from "../index";
import { createStackNavigator } from "@react-navigation/stack";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';


const Appointments = (navigation) => {
    const [Appointments, setAppointments] = useState([]);
    const [controller,dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
        }, [userLogin])

    const handleLogout = () => {
        logout(dispatch);
    };
    useEffect(() => {
        
        const unsubscribe = firestore()
            .collection('Appointments')
            .onSnapshot(querySnapshot => {
                const AppointmentsData = [];
                querySnapshot.forEach(documentSnapshot => {
                    AppointmentsData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setAppointments(AppointmentsData);
            });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <View style={{ margin: 10, padding: 10, borderRadius: 15, marginVertical: 5, backgroundColor: '#e0e0e0' }}>
            
            <TouchableOpacity style={{ margin: 10,padding: 15, borderRadius: 15, marginVertical: 5, backgroundColor: '#e0e0e0' }}>
            <Menu>
                <MenuTrigger>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.id}</Text>
      
                    </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleDelete(item)}><Text>Delete</Text></MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
        </View>
    );

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
                            .collection('Appointments')
                            .doc(Product.id)
                            .delete()
                            .then(() => {
                                console.log("Đã xóa thành công!");
                                navigation.navigate("Appointments");
                            })
                            .catch(error => {
                                console.error("Lỗi:", error);
                            });
                    },
                    style: "default"
                }
            ]
        );
    };

    return (
        
        <View style={{ flex: 1 }}>
            
            <Text style={{ padding: 15, fontSize: 25, fontWeight: "bold" }}>Appointments</Text>
            <FlatList
                data={Appointments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
       
    )
}

export default Appointments;