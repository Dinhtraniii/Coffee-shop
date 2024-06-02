import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Alert, StatusBar } from "react-native";
import { Text, Image } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { logout, useMyContextProvider } from "../index";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const Carts = ({ navigation }) => {
    const [Carts, setCarts] = useState([]);
    

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Carts')
            .onSnapshot(querySnapshot => {
                const CartsData = [];
                querySnapshot.forEach(documentSnapshot => {
                    CartsData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                // Sort the CartsData array based on orderNumber
                CartsData.sort((a, b) => a.orderNumber - b.orderNumber);
                setCarts(CartsData);
            });
    
        return () => unsubscribe();
    }, []);
        const handleCartPress = (item) => {
            navigation.navigate("Cart", { Product: item });
        };


        const renderItem = ({ item }) => (
            <View style={{ margin: 10, padding: 10, borderRadius: 15, marginVertical: 5, backgroundColor: '#e0e0e0' }}>
                <TouchableOpacity style={{ margin: 10, padding: 15, borderRadius: 15, marginVertical: 5, backgroundColor: '#e0e0e0' }}>
                    <Menu>
                        <MenuTrigger>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{`Đơn ${item.orderNumber} :`}</Text>
                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
                            </View>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => handleDelete(item)}><Text>Delete</Text></MenuOption>
                        </MenuOptions>
                    </Menu>
                </TouchableOpacity>
            </View>
        );

    const handleDelete = (cartItem) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this product? This operation cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('Carts')
                            .doc(cartItem.id)
                            .delete()
                            .then(() => {
                                console.log("Deleted successfully!");
                            })
                            .catch(error => {
                                console.error("Error:", error);
                            });
                    },
                    style: "default"
                }
            ]
        );
    };

   

    return (
        <View style={{ flex: 1 }}>
            <StatusBar />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 }}>
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>Carts</Text>
                {/* <TouchableOpacity onPress={handleLogout}>
                    <Text style={{ color: 'red', fontSize: 18 }}>Logout</Text>
                </TouchableOpacity> */}
            </View>
            <FlatList
                data={Carts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

export default Carts;
