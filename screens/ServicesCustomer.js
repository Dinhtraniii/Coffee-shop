import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert,StatusBar} from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context'
import Logo from "../components/Logo";
const ServicesCustomer = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Service')
            .onSnapshot(querySnapshot => {
                const services = [];
                querySnapshot.forEach(documentSnapshot => {
                    services.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setServices(services);
                setInitialServices(services);
            });

        return () => unsubscribe();
    }, []);

    const [name, setName] = useState('')
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
                    <MenuOption onSelect={() => handleAppointment(item)}><Text>Appointment</Text></MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );
    

    const handleAppointment = (service) => {
        navigation.navigate("Appointment", { service });
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
                label={"Search by name"}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    const result = initialServices.filter(service => service.title.toLowerCase().includes(text.toLowerCase()));
                    setServices(result);
                }}
            />
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
                    Danh sách bàn</Text>
            </View>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            </View>
            </SafeAreaView>
        </View>
    )
}

export default ServicesCustomer;
