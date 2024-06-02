import React, { useState } from "react";
import { View, Image, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import firestore from "@react-native-firebase/firestore";
import { useMyContextProvider } from "../index";
import PaymentMethodSelection from './PaymentMethodSelection';

const Appointment = ({ navigation, route }) => {
    const { Place } = route.params || {};
    const [datetime, setDatetime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const APPOINTMENTS = firestore().collection("Appointments");

    const handleSelectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleSubmit = () => {
        // Kiểm tra xem đã chọn phương thức thanh toán chưa
        if (!selectedPaymentMethod) {
            Alert.alert('Error', 'Please select a payment method');
            return;
        }
        
        // Tiến hành kiểm tra và xác nhận đặt bàn
        confirmAppointment();
    };

    const confirmAppointment = () => {
        // Thêm bản ghi mới vào cơ sở dữ liệu
        APPOINTMENTS.add({
            title: Place.title,
            email: userLogin.email,
            PlaceId: Place.id,
            datetime,
            paymentMethod: selectedPaymentMethod,
            state: "new"
        }).then(response => {
            APPOINTMENTS.doc(response.id).update({ id: response.id });
            // navigation.navigate("AppointmentCustomer");
        }).catch(error => {
            console.error("Error adding appointment:", error);
            Alert.alert('Error', 'Failed to add appointment');
        });
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Cover source={{ uri: Place.image }} />
                <Card.Content>
                    <Text style={styles.title}>View: {Place.title}</Text>
                    <Text style={styles.price}>Place: {Place.price} ₫</Text>
                </Card.Content>
            </Card>

            <TouchableOpacity
                onPress={() => setOpen(true)}
                style={styles.datetimeContainer}
            >
                <Text style={styles.label}>Choose date time:</Text>
                <Text style={styles.datetime}>{datetime.toDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setOpenPaymentModal(true)}
                style={styles.paymentContainer}
            >
                <Text style={styles.label}>Payment Method:</Text>
                <Text style={styles.paymentMethod}>{selectedPaymentMethod || 'Select method'}</Text>
            </TouchableOpacity>

            <PaymentMethodSelection
                onSelectMethod={handleSelectPaymentMethod}
                isVisible={openPaymentModal}
                onClose={() => setOpenPaymentModal(false)}
            />

            <Button
                style={styles.button}
                textColor="black"
                buttonColor="tomato"
                mode="contained"
                onPress={handleSubmit}
            >
                Đặt bàn
            </Button>

            <DatePicker
                modal
                open={open}
                date={datetime}
                onConfirm={(date) => {
                    setOpen(false);
                    setDatetime(date);
                }}
                onCancel={() => setOpen(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    card: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 18,
        color: 'red',
    },
    datetimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    datetime: {
        fontSize: 18,
    },
    paymentMethod: {
        fontSize: 18,
    },
    button: {
        marginTop: 20,
    },
});

export default Appointment;
