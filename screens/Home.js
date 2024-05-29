import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';
import { Image, View, TouchableOpacity,ImageBackground} from 'react-native';



const HomeScreen = ({ navigation }) => (
   <Background>
    <Logo />
    <Header>NoHope Coffee</Header>

    <Paragraph>
        "Awake Your Senses, One Sip at a Time."
    </Paragraph>
    <Button 
        style={{margin:10}} mode='contained' textColor='black' buttonColor='#0099FF'
        onPress={() => navigation.navigate('Login')}>
      Login
    </Button>
    <Button 
      mode="outlined"
      onPress={() => navigation.navigate('Register')}
    >
      Sign Up
    </Button>
   
  </Background>
);

export default memo(HomeScreen);