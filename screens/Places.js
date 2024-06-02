import React, { useState, useEffect } from "react";
import { Image, View, Alert, StatusBar, ScrollView } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Logo from '../components/Logo';
import { categories } from '../constants';

const Places = ({ navigation }) => {
    const [initialPlaces, setInitialPlaces] = useState([]);
    const [Places, setPlaces] = useState([]);
    const [name, setName] = useState('');
    const [activeCategory, setActiveCategory] = useState(1);

    useEffect(() => {   
        const unsubscribe = firestore()
            .collection('Place')
            .onSnapshot(querySnapshot => {
                const Places = [];
                querySnapshot.forEach(documentSnapshot => {
                    Places.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setPlaces(Places);
                setInitialPlaces(Places);
            });

        return () => unsubscribe();
    }, []);

    const renderPlace = (Place) => (
        <View key={Place.id} style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            {Place.image !== "" && (
                <View style={{ flex: 1 }}>
                    <Image
                        source={{ uri: Place.image }}
                        style={{ height: 150, width: '100%', borderRadius: 10 }}
                        resizeMode="cover"
                    />
                </View>
            )}
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>Bàn: {Place.title}</Text>
                <Text style={{ fontSize: 20, marginBottom: 5 }}>Created by: {Place.create}</Text>
                <Text style={{ fontSize: 20, color: 'red' }}>số lượng: {Place.price} người</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => handleUpdate(Place)} style={{ marginRight: 10 }}>
                        <Text style={{ fontSize: 18, color: 'blue', textDecorationLine: 'underline' }}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(Place)} style={{ marginRight: 10 }}>
                        <Text style={{ fontSize: 18, color: 'red', textDecorationLine: 'underline' }}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
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
                              
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa Bàn:", error);
                            });
                    },
                    style: "default"
                }
            ]
        )
    }
    const handleUpdate = async (Place) => {
        try {
            navigation.navigate("PlaceUpdate", { Place });
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
        }
    }
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar/>
            <Image
                source={require('../assets/background.png')}
                style={{ width: '100%', position: 'absolute', top: -5, opacity: 0.1 }}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <Logo />
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={{ borderRadius: 10, marginHorizontal: 10 }}
                        label={"Search by name"}
                        mode="outlined"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            const result = initialPlaces.filter(Place => Place.title.toLowerCase().includes(text.toLowerCase()));
                            setPlaces(result);
                        }}
                    />
                    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={categories}
                            keyExtractor={item => item.id}
                            className="overflow-visible"
                            renderItem={({ item }) => {
                                let isActive = item.id == activeCategory;
                                let activeTextClass = isActive ? 'text-white' : 'text-gray-700';
                                return (
                                    <TouchableOpacity
                                        onPress={() => setActiveCategory(item.id)}
                                        style={{
                                            backgroundColor: isActive ? 'rgba(0, 0, 0, 0.07)' : 'transparent',
                                            padding: 16,
                                            paddingHorizontal: 20,
                                            borderRadius: 9999,
                                            marginRight: 8,
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
                            Danh Sách Bàn</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("AddNewPlace")}>
                            <Image source={require('../assets/add.png')} style={{ width: 30, height: 30, margin: 20 }} />
                        </TouchableOpacity>
                    </View>
                    {Places.map(renderPlace)}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

export default Places;
