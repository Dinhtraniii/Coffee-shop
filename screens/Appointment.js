import React, { useState } from "react"
import { View, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Button, Text } from "react-native-paper"
import datetime from "react-native-date-picker"
import DatePicker from "react-native-date-picker"
import firestore from "@react-native-firebase/firestore"
import { useMyContextProvider } from "../index"
import AddressSelection from './AddressSelection'; // Adjust the path as needed
import PaymentMethodSelection from './PaymentMethodSelection'; // Adjust the path as needed

const Appointment = ({navigation, route }) => {
    const { service } = route.params || {};
    const [datetime, setDatetime] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [controller, dispatch] = useMyContextProvider()
    const {userLogin} = controller
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const APPOINTMENTs = firestore().collection("Appointments")

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
      };
    
      const handleSelectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
      };
    const handleSubmit = () =>{
        if (!selectedAddress) {
            alert('Please select a shipping address');
            return;
          }
          if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
          }
        APPOINTMENTs.add({
            email: userLogin.email,
            serviceId: service.id,
            datetime,
            address: selectedAddress,
            paymentMethod: selectedPaymentMethod,
            state: "new"
        })
        .then(r => 
            {
                APPOINTMENTs.doc(r.id).update({id: r.id})
                navigation.navigate("Appointments")
            })
    }
    return (
        <View style={{padding: 10}}>
            {service && service.image !== "" && (
                <View style={{ flexDirection: 'row' }}>

                    <Image
                        source={{ uri: service && service.image }}
                        style={{ height: 300, width: '100%' }}
                        resizeMode="contain"
                    />
                </View>
            )}
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Bàn: </Text>
                <Text style={{ fontSize: 20 }}>{service && service.title}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá: </Text>
                <Text style={{ fontSize: 20,color:'red'}}>{service && service.price} ₫</Text>
            </View>
            
            <DatePicker
                modal
                open={open}
                date={datetime}
                onConfirm={(date) => {
                    setOpen(false)
                    setDatetime(date)
                }}
                onCancel={()=>{
                    setOpen(false)
                }}
            />
            <TouchableOpacity
                onPress={()=> setOpen(true)}            
                style={{flexDirection:"row", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Choose date time: </Text>
                <Text style={{ fontSize: 20}}>{datetime.toDateString()}</Text>
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
            <Button style={{margin: 10}} textColor="black" buttonColor="pink" mode="contained" onPress={handleSubmit}>  
                Đặt lịch
            </Button>
        </View>
    )
}

export default Appointment;
