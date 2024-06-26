import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Alert, StatusBar, StyleSheet, Image } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { logout, useMyContextProvider } from "../index";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const Carts = ({ navigation }) => {
    const [carts, setCarts] = useState([]);
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;

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
            .onSnapshot(querySnapshot => {
                const cartsData = [];
                querySnapshot.forEach(documentSnapshot => {
                    cartsData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                // Sắp xếp mảng cartsData dựa trên số đơn hàng
                cartsData.sort((a, b) => a.orderNumber - b.orderNumber);
                setCarts(cartsData);
            });

        return () => unsubscribe();
    }, []);

 

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
                              // Sau khi xoá, cập nhật lại số đơn hàng và sắp xếp lại danh sách
                              updateOrderNumbers();
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
  const updateOrderNumbers = (deletedItemId) => {
    // Lấy danh sách đơn hàng
    const updatedCarts = [...carts];

    // Xóa đơn hàng và cập nhật lại số đơn hàng cho các đơn hàng còn lại
    const index = updatedCarts.findIndex(item => item.id === deletedItemId);
    updatedCarts.splice(index, 1);
    updatedCarts.forEach((item, index) => {
        item.orderNumber = index + 1;
    });

    // Cập nhật lại state với danh sách đơn hàng mới
    setCarts(updatedCarts);
};

const renderItem = ({ item }) => (
    <TouchableOpacity >
        <View style={styles.cartItem}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                <View>
                    <Text style={styles.cartTitle}>{`Order ${item.orderNumber}: ${item.title}`}</Text>
                    <Text>{`Email: ${item.email}`}</Text>
                    <Text>{`Price: ${item.price}`}</Text>
                   
                </View>
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
    </TouchableOpacity>
);

    return (
        <View style={styles.container}>
            <StatusBar />
            <View style={styles.header}>
                <Text style={styles.headerText}>Carts</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Image source={require('../assets/exit.png')} style={styles.logoutIcon} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={carts}
                renderItem={renderItem}
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
        backgroundColor: 'black',
    },
    headerText: {
        color: 'cyan',
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

export default Carts;
