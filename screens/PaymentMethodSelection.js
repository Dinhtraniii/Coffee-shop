
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import Modal from 'react-native-modal';


const PaymentMethodSelection = ({  isVisible, onClose,onSelectMethod }) => {
    const handleConfirm = () => {
        if (address) {
          onSelectMethod();
          onClose();
        
        }
      };
  return (
    <Modal isVisible={isVisible}>
        <View style={styles.modalContent}>
        <Text style={styles.title}>Select Payment Method</Text>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMethod('credit_card') }>
            <Text>Credit Card</Text>
            <Image source={require('../assets/amazonpay.png')}
            style={{ width: 45, height: 45, marginBottom: 10 }}
            resize />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMethod('paypal')}>
            <Text>PayPal</Text>
            <Image source={require('../assets/paypal.png')}
            style={{ width: 45, height: 45, marginBottom: 10 }}
            resize />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMethod('bank_transfer')}>
            <Text>Bank Transfer</Text>
            <Image source={require('../assets/bank.png')}
            style={{ width: 45, height: 45, marginBottom: 10 }}
            resize />
        </TouchableOpacity>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button_} onPress={onClose}>
            <Text style={styles.buttonText}>Huỷ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_} onPress={onClose}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button_: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
  },
});

export default PaymentMethodSelection;
