import React, { useState } from "react";
import { View, Image, Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Text, Card } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useMyContextProvider } from "../index";
import AddressSelection from './AddressSelection'; // Điều chỉnh đường dẫn cần thiết
import PaymentMethodSelection from './PaymentMethodSelection'; // Điều chỉnh đường dẫn cần thiết

const Cart = ({ navigation, route }) => {
    const { Product } = route.params || {};
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const CARTs = firestore().collection("Carts");

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    };

    const handleSelectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleSubmit = () => {
        if (!selectedAddress || !selectedPaymentMethod) {
            Alert.alert('Error', 'Please select a shipping address and payment method');
            return;
        }

        CARTs.add({
            email: userLogin.email,
            ProductId: Product.id,
            address: selectedAddress,
            paymentMethod: selectedPaymentMethod,
            state: "new"
        })
        .then(response => {
            CARTs.doc(response.id).update({ id: response.id })
            .then(() => {
                navigation.navigate("CartsCustomer");
            });
        })
        .catch(error => {
            console.error("Error adding to cart: ", error);
            Alert.alert('Error', 'Failed to add to cart');
        });
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Image
                        source={{ uri: Product.image }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <Text style={styles.productTitle}>{Product.title}</Text>
                    <Text style={styles.productPrice}>{Product.price} ₫</Text>
                </Card.Content>
            </Card>

            <TouchableOpacity
                onPress={() => setOpenAddressModal(true)}
                style={styles.selectionContainer}>
                <Text style={styles.selectionTitle}>Shipping Address:</Text>
                <Text style={styles.selectionText}>{selectedAddress || 'Select address'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setOpenPaymentModal(true)}
                style={styles.selectionContainer}>
                <Text style={styles.selectionTitle}>Payment Method:</Text>
                <Text style={styles.selectionText}>{selectedPaymentMethod || 'Select method'}</Text>
            </TouchableOpacity>

            <AddressSelection
                isVisible={openAddressModal}
                onClose={() => setOpenAddressModal(false)}
                onSelectAddress={handleSelectAddress}
            />

            <PaymentMethodSelection
                isVisible={openPaymentModal}
                onClose={() => setOpenPaymentModal(false)}
                onSelectMethod={handleSelectPaymentMethod}
            />

            <Button
                style={styles.button}
                textColor="white"
                buttonColor="tomato"
                mode="contained"
                onPress={handleSubmit}>
                Checkout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    card: {
        marginBottom: 25,
    },
    image: {
        height: 200,
        width: '100%',
        marginBottom: 10,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        marginBottom: 10,
        color: 'red',
    },
    selectionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
        padding: 10,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
    },
    selectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    selectionText: {
        fontSize: 16,
        color: "#555",
    },
    button: {
        marginTop: 30,
    },
});

export default Cart;
