import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert,StatusBar } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Background from '../components/Background';
import Logo from '../components/Logo';
import { SafeAreaView } from 'react-native-safe-area-context'

const Services = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');

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
    

    const handleUpdate = async (service) => {
        try {
            navigation.navigate("ServiceUpdate", { service });
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
        }
    }
    

    const handleDelete = (service) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this service? This operation cannot be returned",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('Service')
                            .doc(service.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Services");
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

    const handleDetail = (service) => {
        navigation.navigate("ServiceDetail", { service });
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
                    <TouchableOpacity onPress={() => navigation.navigate("AddNewService")}>
                      <Image source={require('../assets/add.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
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

export default Services;
