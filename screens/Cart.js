// Cart.js
import React, { useState } from "react";
import { View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Text } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import firestore from "@react-native-firebase/firestore";
import { useMyContextProvider } from "../index"; // Adjust the path as needed
import AddressSelection from './AddressSelection'; // Adjust the path as needed
import PaymentMethodSelection from './PaymentMethodSelection'; // Adjust the path as needed

const Cart = ({ navigation, route }) => {
  const { Product } = route.params || {};
  const [datetime, setDatetime] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [controller, dispatch] = useMyContextProvider();
  const { userLogin } = controller;
  const CARTs = firestore().collection("Carts");

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmit = () => {
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    CARTs.add({
      email: userLogin.email,
      ProductId: Product.id,
      datetime,
      address: selectedAddress,
      paymentMethod: selectedPaymentMethod,
      state: "new"
    })
      .then(r => {
        CARTs.doc(r.id).update({ id: r.id });
        navigation.navigate("Carts");
      });
  };

  return (
    <View style={{ padding: 10 }}>
      {Product && Product.image !== "" && (
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: Product && Product.image }}
            style={{ height: 300, width: '100%' }}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên món: </Text>
        <Text style={{ fontSize: 20, fontStyle: 'italic', fontWeight: '100' }}>{Product && Product.title}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá: </Text>
        <Text style={{ fontSize: 20, color: 'red' }}>{Product && Product.price} ₫</Text>
      </View>
      <DatePicker
        modal
        open={openDatePicker}
        date={datetime}
        onConfirm={(date) => {
          setOpenDatePicker(false);
          setDatetime(date);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      />
      <TouchableOpacity
        onPress={() => setOpenDatePicker(true)}
        style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Choose date time: </Text>
        <Text style={{ fontSize: 20 }}>{datetime.toDateString()}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setOpenAddressModal(true)}
        style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Shipping Address: </Text>
        <Text style={{ fontSize: 20 }}>{selectedAddress || 'Select address'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setOpenPaymentModal(true)}
        style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Payment Method: </Text>
        <Text style={{ fontSize: 20 }}>{selectedPaymentMethod || 'Select method'}</Text>
      </TouchableOpacity>
    
      <AddressSelection
        isVisible={openAddressModal}
        onClose={() => setOpenAddressModal(false)}
        onSelectAddress={handleSelectAddress}
      />
      <PaymentMethodSelection
        onSelectMethod={handleSelectPaymentMethod}
        isVisible={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
      />
        <Button style={{ margin: 10 }} textColor="black" buttonColor="red" mode="contained" onPress={handleSubmit}>
        Thanh toán
      </Button>
    </View>
  );
};

export default Cart;
