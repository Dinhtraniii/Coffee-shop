import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Alert, Image,StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import {logout, useMyContextProvider } from "../index";

const Customers = ({navigation}) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [updatedCustomer, setUpdatedCustomer] = useState({});
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
            .collection('USER')
            .where('role', '==', 'customer')
            .onSnapshot(querySnapshot => {
                const customersData = [];
                querySnapshot.forEach(documentSnapshot => {
                    customersData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setCustomers(customersData);
            });

        return () => unsubscribe();
    }, []);

    const toggleCustomerDetails = (customer) => {
        if (selectedCustomer && selectedCustomer.id === customer.id) {
            setSelectedCustomer(null);
            setEditMode(false);
        } else {
            setSelectedCustomer(customer);
            setUpdatedCustomer(customer);
            setEditMode(false);
        }
    };

    const handleDelete = (customerId) => {
        Alert.alert(
            "Warning",
            "Are you sure you want to delete this customer? This operation cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        firestore()
                            .collection('USER')
                            .doc(customerId)
                            .delete()
                            .then(() => {
                                console.log("Customer deleted successfully!");
                                setSelectedCustomer(null);
                            })
                            .catch(error => {
                                console.error("Error deleting customer:", error);
                            });
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        firestore()
            .collection('USER')
            .doc(selectedCustomer.id)
            .update(updatedCustomer)
            .then(() => {
                console.log("Customer updated successfully!");
                setEditMode(false);
                setSelectedCustomer(updatedCustomer); // Update the selected customer with the new data
            })
            .catch(error => {
                console.error("Error updating customer:", error);
            });
    };

    const renderItem = ({ item }) => (
        <View style={{ margin: 10, padding: 10, borderRadius: 15, marginVertical: 5, backgroundColor: '#e0e0e0' }}>
            <TouchableOpacity onPress={() => toggleCustomerDetails(item)} style={{ padding: 15, borderRadius: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.email}</Text>
            </TouchableOpacity>
            {selectedCustomer && selectedCustomer.id === item.id && (
                <View style={{ marginTop: 10 }}>
                    {editMode ? (
                        <View>
                            <TextInput
                                label="Email"
                                value={updatedCustomer.email}
                                onChangeText={(text) => setUpdatedCustomer({ ...updatedCustomer, email: text })}
                                style={{ marginBottom: 10 }}
                            />
                            <TextInput
                                label="Password"
                                value={updatedCustomer.password}
                                onChangeText={(text) => setUpdatedCustomer({ ...updatedCustomer, password: text })}
                                style={{ marginBottom: 10 }}
                            />
                            <TextInput
                                label="Full Name"
                                value={updatedCustomer.fullName}
                                onChangeText={(text) => setUpdatedCustomer({ ...updatedCustomer, fullName: text })}
                                style={{ marginBottom: 10 }}
                            />
                            <TextInput
                                label="Address"
                                value={updatedCustomer.address}
                                onChangeText={(text) => setUpdatedCustomer({ ...updatedCustomer, address: text })}
                                style={{ marginBottom: 10 }}
                            />
                            <TextInput
                                label="Phone"
                                value={updatedCustomer.phone}
                                onChangeText={(text) => setUpdatedCustomer({ ...updatedCustomer, phone: text })}
                                style={{ marginBottom: 10 }}
                            />
                            <TextInput
                                label="Role"
                                value={updatedCustomer.role}
                                onChangeText={(text) => setUpdatedCustomer({ ...updatedCustomer, role: text })}
                                style={{ marginBottom: 10 }}
                            />
                            <Button mode="contained" onPress={handleSave} style={{ marginBottom: 10 }}>
                                Save
                            </Button>
                            <Button mode="contained" onPress={() => setEditMode(false)}>
                                Cancel
                            </Button>
                        </View>
                    ) : (
                        <View>
                            <Text>Email: {item.email}</Text>
                            <Text>Password: {item.password}</Text>
                            <Text>Full Name: {item.fullName}</Text>
                            <Text>Address: {item.address}</Text>
                            <Text>Phone: {item.phone}</Text>
                            <Text>Role: {item.role}</Text>
                            <Button mode="contained" onPress={handleEdit} style={{ marginTop: 10 }}>
                                Edit
                            </Button>
                            <Button mode="contained" onPress={() => handleDelete(item.id)} style={{ marginTop: 10, backgroundColor: 'red' }}>
                                Delete
                            </Button>
                        </View>
                    )}
                </View>
            )}
        </View>
    );

    return (
       
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Carts</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Image source={require('../assets/exit.png')} style={styles.logoutIcon} />
                </TouchableOpacity>
            </View>
           
            <FlatList
                data={customers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
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
export default Customers;
