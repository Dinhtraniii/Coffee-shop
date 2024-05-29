import React, { useState, useEffect } from "react";
import { Image, View, Alert,StatusBar,Dimensions,ToastAndroid } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

import Logo from '../components/Logo';
import {categories} from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
;



const Products = ({ navigation }) => {
    const [initialProducts, setInitialProducts] = useState([]);
    const [Products, setProducts] = useState([]);           
    const [name, setName] = useState('');
    const [activeCategory, setActiveCategory] = useState(1);

    useEffect(() => {   
        const unsubscribe = firestore()
            .collection('Product')
            .onSnapshot(querySnapshot => {
                const Products = [];
                querySnapshot.forEach(documentSnapshot => {
                    Products.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setProducts(Products);
                setInitialProducts(Products);
            });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={{ margin: 10,padding: 15, borderRadius: 15, marginVertical: 5, backgroundColor: '#e0e0e0' }}>
            <Menu>
                <MenuTrigger>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}>
                        <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.title}</Text>
                        <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.price} ₫</Text>
                    </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleUpdate(item)}><Text>Update</Text></MenuOption>
                    <MenuOption onSelect={() => handleDelete(item)}><Text>Delete</Text></MenuOption>
                    <MenuOption onSelect={() => handleDetail(item)}><Text>Detail</Text></MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );
    

    const handleUpdate = async (Product) => {
        try {
            navigation.navigate("ProductUpdate", { Product });
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
        }
    }
    

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
        )
    }
    
    const handleDetail = (Product) => {
        navigation.navigate("ProductDetail", { Product });
    }

   

    return (
        <View style={{flex:1, position: 'relative', backgroundColor: 'white' }}>
            <StatusBar/>
             <Image
                source={require('../assets/background.png')}
                style={{ width: '100%', position: 'absolute', top: -5, opacity: 0.1 }}
            />
            <SafeAreaView style={{flex:1}}>
                <Logo />
            <View style={{ flex: 1 }}>
           
            <TextInput
            style={{borderRadius:10,marginHorizontal:10}}
                label={"Search by name"}
                mode="outlined"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    const result = initialProducts.filter(Product => Product.title.toLowerCase().includes(text.toLowerCase()));
                    setProducts(result);
                }}
            />
            <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={item=> item.id}
                className="overflow-visible"
                renderItem={({item})=>{
                    let isActive =item.id==activeCategory;
                    let activeTextClass = isActive?'text-white':'text-gray-700';
                    return (
                        <TouchableOpacity
                            onPress={()=> setActiveCategory(item.id)}
                            style={{
                                backgroundColor: isActive ? 'rgba(0, 0, 0, 0.07)' : 'transparent', // Adjust as needed
                                padding: 16,
                                paddingHorizontal: 20,
                                borderRadius: 9999, // Large enough to make a circle
                                marginRight: 8, // Adjust as needed
                                shadowColor: "#045",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                            
                        >
                            <Text style={{ fontWeight: '600', ...(isActive ? activeTextClass : {}) }}>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
                />
            </View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Text style={{
                    padding: 15,
                    fontSize: 25,
                    fontWeight: "bold",
                }}>
                    Chọn món</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("AddNewProduct")}>
                      <Image source={require('../assets/add.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
            </View>                
                
                <FlatList
                    data={Products}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
            </SafeAreaView>
           
            
        </View>
    )
}

export default Products;
