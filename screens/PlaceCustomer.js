import React, { useState, useEffect } from "react";
import { Image, View, Alert, StatusBar, ScrollView } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Logo from '../components/Logo';
import { categories } from "../constants";

const  PlaceCustomer= ({ navigation }) => {
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
                <Text style={{ fontSize: 20, color: 'red' }}>Số lượng: {Place.price} người</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => handleAppointment(Place)} style={{ marginRight: 10 }}>
                        <Text style={{ fontSize: 18, color: 'red', textDecorationLine: 'underline' }}>Đặt Bàn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const handleAppointment = (Place) => { 
        navigation.navigate("Appointment", { Place }); }
return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
    <StatusBar />
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
                    const result = initialPlaces.filter(product => product.title.toLowerCase().includes(text.toLowerCase()));
                    setPlaces(result);
                }}
            />
            <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    keyExtractor={item => item.id}
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
                        </View>
                        {Places.map(renderPlace)}
                    </View>
                </SafeAreaView>
            </ScrollView>
        );
    }

export default PlaceCustomer;
