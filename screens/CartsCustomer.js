import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Alert, StatusBar, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { logout, useMyContextProvider } from "../index";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const CartCustomer = ({ navigation }) => {
    const [carts, setCarts] = useState([]);
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const user = auth().currentUser;
    const userEmail = user ? user.email : null;

    useEffect(() => {
        if (userLogin == null) {
            navigation.navigate("Login");
        }
    }, [userLogin, navigation]);

    const handleLogout = () => {
        logout(dispatch);
    };

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Carts')
            .where('email', '==', userEmail) // Make sure userEmail is defined and not null
            .onSnapshot(querySnapshot => {
                const cartsData = [];
                querySnapshot.forEach(documentSnapshot => {
                    cartsData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
    
                // Sort cartsData by order number
                cartsData.sort((a, b) => a.orderNumber - b.orderNumber);
                setCarts(cartsData);
            });
    
        return () => unsubscribe();
    }, [userEmail]);

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

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                <TouchableOpacity  onPress={() => handleCartPress(item)}>
                    <Text style={styles.cartTitle}>{`Order ${item.orderNumber} : ${item.title}`}</Text>
                </TouchableOpacity>
                <Menu>
                    <MenuTrigger>
                        <Image source={require('../assets/dots.png')} style={styles.menuIcon} />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => handleDelete(item)} style={styles.menuOption}>
                            <Text style={styles.menuOptionText}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    );
        const handleCartPress = (item) => {
                navigation.navigate("Cart", { Product: item });
            };
    return (
        <View style={styles.container}>
            <StatusBar />
            <View style={styles.header}>
                <Text style={styles.headerText}>Your Orders</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Image source={require('../assets/logout.png')} style={styles.logoutIcon} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={carts}
                renderItem={renderCartItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#99FFFF',
    },
    headerText: {
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
    },
    logoutIcon: {
        width: 30,
        height: 30,
    },
    cartItem: {
        margin: 10,
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
        backgroundColor: '#e0e0e0',
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    menuIcon: {
        width: 20,
        height: 20,
        tintColor: 'black',
    },
    menuOption: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    menuOptionText: {
        fontSize: 16,
        color: 'black',
    },
});

export default CartCustomer;
