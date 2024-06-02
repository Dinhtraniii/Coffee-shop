import React, { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity,ImageBackground } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useMyContextProvider, login } from '../index';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controller, dispatch] = useMyContextProvider();
  const { userLogin } = controller;
  const [showPassword, setShowPassword] = useState(false);
  const [disableLogin, setDisableLogin] = useState(true);

  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPassword = () => password.length < 6;

  useEffect(() => {
    setDisableLogin(email.trim() === '' || password.trim() === '' || hasErrorEmail() || hasErrorPassword());
  }, [email, password, hasErrorEmail, hasErrorPassword]);

  const handleLogin = () => {
    login(dispatch, email, password);
  };

  useEffect(() => {
    console.log(userLogin)
    if (userLogin != null) {
      if (userLogin.role === "admin")
        navigation.navigate("Admin")
      else if (userLogin.role === "customer")
        navigation.navigate("Customer")
    }
  }, [userLogin])

  return (
    <ImageBackground  
    source ={require('../assets/bg.jpg')}
    style ={{width: '100%', height: '100%'}}
    resize>
    <View style={{ marginHorizontal: 20, marginTop: 50 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 150, height: 150, marginBottom: 10 }}
            resize
        />
        </View>
      
      <TextInput style={{margin:10}}
        label={"Email"}
        value={email}
        onChangeText={setEmail}
      />
      <HelperText type='error' visible={hasErrorEmail()}>
        Địa chỉ Email không hợp lệ
      </HelperText>
      <View style={{ flexDirection: "row", margin:10 }}>
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
            style={{ width: 16, height: 16, margin: 10,marginTop:20,justifyContent:'center' }}
          />
        </TouchableOpacity>
      </View>
      <HelperText type='error' visible={hasErrorPassword()}>
        Password có ít nhất 6 ký tự
      </HelperText>
      <Button style={{margin:10}} mode='contained' textColor='black' buttonColor='#0099FF' onPress={handleLogin} disabled={disableLogin}>
        Login
      </Button>
      <View  style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text>Dont have an account ?</Text>
        <Button onPress={() => navigation.navigate("Register")}>
          Create new account
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Button onPress={() => navigation.navigate("ForgotPassword")}>
          Forgot Password
        </Button>
      </View>
      </View>
     
    </ImageBackground>
  );
};

export default Login;
