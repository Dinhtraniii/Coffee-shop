import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { Text, Card, Title, Paragraph, IconButton } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { logout, useMyContextProvider } from "../index";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const AppoinmentCustomer = () => {
    const [appointments, setAppointments] = useState([]);
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const navigation = useNavigation();

    useEffect(() => {
        if (userLogin == null) {
            navigation.navigate("Login");
        }
    }, [userLogin, navigation]);

    const handleLogout = () => {
        logout(dispatch);
    };

    useEffect(() => {
        if (userLogin) {
            const unsubscribe = firestore()
                .collection('Appointments')
                .where('email', '==', userLogin.email) // Lọc cuộc hẹn dựa trên userId
                .onSnapshot(querySnapshot => {
                    const appointmentsData = [];
                    querySnapshot.forEach(documentSnapshot => {
                        appointmentsData.push({
                            ...documentSnapshot.data(),
                            id: documentSnapshot.id,
                        });
                    });
                    setAppointments(appointmentsData);
                });

            return () => unsubscribe();
        }
    }, [userLogin]);

    const handleDelete = (appointmentItem) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this appointment? This operation cannot be undone.",
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
                            .doc(appointmentItem.id)
                            .delete()
                            .then(() => {
                                console.log("Deleted successfully!");
                            })
                            .catch(error => {
                                console.error("Error:", error);
                            });
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.title}>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
                <Paragraph>Date/Time: {moment(item.datetime.toDate()).format('MMMM Do YYYY, h:mm a')}</Paragraph>
                <Paragraph>Email: {item.email}</Paragraph>
                <Paragraph>Payment Method: {item.paymentMethod}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <Menu>
                    <MenuTrigger>
                        <IconButton icon="dots-vertical" size={20} />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => handleDelete(item)}>
                            <Text style={styles.menuOption}>Delete</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Appointments</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Image source={require('../assets/logout.png')} style={styles.logoutIcon} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    list: {
        padding: 10,
    },
    card: {
        margin: 10,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateTime: {
        color: 'gray',
        marginTop: 5,
    },
    menuOption: {
        fontSize: 16,
        padding: 10,
    },
});

export default AppoinmentCustomer;
