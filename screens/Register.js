import React, { useState, useEffect } from 'react';
import { Image, View,ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { createAccount } from '../index';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Background from '../components/Background';
import Logo from '../components/Logo';

const Register = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [disableCreate, setDisableCreate] = useState(true);

  const hasErrorFullName = () => fullName === "";
  const hasErrorEmail = () => !email.includes('@');
  const hasErrorPassword = () => password.length < 6;
  const hasErrorPasswordConfirm = () => confirmPassword !== password;

  useEffect(() => {
    setDisableCreate(
      hasErrorFullName() ||
      hasErrorEmail() ||
      hasErrorPassword() ||
      hasErrorPasswordConfirm() ||
      phone.trim() === '' ||
      address.trim() === ''
    );
  }, [fullName, email, password, confirmPassword, phone, address, hasErrorFullName, hasErrorEmail, hasErrorPassword, hasErrorPasswordConfirm]);

  const handleRegister = () => {
    createAccount(email, password, fullName, phone, address, role);
  };

  return (
    <ScrollView>
    <Background>
      <Logo />
    <View style={{ flex: 1,margin:10}}>
    
      <TextInput
        label={"Full Name"}
        value={fullName}
        onChangeText={setFullname}
      />
      <HelperText type='error' visible={hasErrorFullName()}>
        Full name không được phép để trống
      </HelperText>
      <TextInput
        label={"Email"}
        value={email}
        onChangeText={setEmail}
      />
      <HelperText type='error' visible={hasErrorEmail()}>
        Địa chỉ email không hợp lệ
      </HelperText>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          label={"Password"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={showPassword}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
            style={{ width: 20, height: 20, margin: 20 }}
          />
        </TouchableOpacity>
      </View>
      <HelperText type='error' visible={hasErrorPassword()}>
        Password ít nhất 6 kí tự
      </HelperText>

      <View style={{ flexDirection: "row" }}>
        <TextInput
          label={"Confirm Password"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={showConfirmPassword}
          style={{ flex: 1}}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={showConfirmPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
            style={{ width: 20, height: 20, margin: 20 }}
          />
        </TouchableOpacity>
      </View>
      <HelperText type='error' visible={hasErrorPasswordConfirm()}>
        Confirm Password phải giống với Password
      </HelperText>
      <TextInput
        label={"Address"}
        value={address}
        onChangeText={setAddress}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label={"Phone"}
        value={phone}
        onChangeText={setPhone}
        style={{ marginBottom: 20 }}
      />
      <Button textColor='black' buttonColor='#0099FF' mode='contained' onPress={handleRegister} disabled={disableCreate}>
        Create New Account
      </Button>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text>Do you have an account ?</Text>
        <Button onPress={() => navigation.navigate("Login")}>
          Login Account
        </Button>
      </View>
    </View>
    </Background>
    </ScrollView>
  );
};

export default Register;
