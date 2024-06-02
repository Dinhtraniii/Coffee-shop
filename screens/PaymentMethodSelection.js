import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';

const PaymentMethodSelection = ({ isVisible, onClose, onSelectMethod }) => {
  const handleConfirm = () => {
    // Thực hiện xác nhận lựa chọn phương thức thanh toán
    onClose();
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Select Payment Method</Text>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMethod('credit_card')}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Credit Card</Text>
            <Image source={require('../assets/amazonpay.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMethod('paypal')}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>PayPal</Text>
            <Image source={require('../assets/paypal.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMethod('bank_transfer')}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Bank Transfer</Text>
            <Image source={require('../assets/bank.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onSelectMethod('cash')}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Cash</Text>
            <Image source={require('../assets/cash.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button_} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button_} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  icon: {
    width: 30,
    height: 30,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button_: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
});

export default PaymentMethodSelection;
