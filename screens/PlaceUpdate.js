import React, { useState } from "react";
import { View, Image } from 'react-native'
import {Text, TextInput, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";

const PlaceUpdate = ({ route, navigation }) => {
    const { Place } = route.params;
    const [title, setTitle] = useState(Place.title);
    const [price, setPrice] = useState(Place.price);
    const [imagePath, setImagePath] = useState(Place.image);

    const handleUpdatePlace = async () => {
        try {
            await firestore()
                .collection('Place')
                .doc(Place.id)
                .update({
                    title: title,
                    price: price
                });
            if (imagePath !== Place.image) {
                const refImage = storage().ref(`/Places/${Place.id}.png`);
                await refImage.putFile(imagePath);
                const imageLink = await refImage.getDownloadURL();
                await firestore()
                    .collection('Place')
                    .doc(Place.id)
                    .update({
                        image: imageLink
                    });
            }

            navigation.goBack();
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
        }
    }

    const handleUploadImage = () =>{
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300
        })
        .then(image =>
            setImagePath(image.path)
        )
        .catch(e=> console.log(e.message))
    }

    return (
        <View style={{ padding: 10 }}>
            {((imagePath !== "") &&
            <Image source={{uri: imagePath}}
                style={{height: 300}}
            />
            )}
            <Button style={{margin: 20}} buttonColor="#33CCFF" textColor="black" mode="contained" onPress={handleUploadImage}>Change Image</Button>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Place name *</Text>
            <TextInput
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                value={title}
                onChangeText={setTitle}
                placeholder="Input a place name"
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Place *</Text>
            <TextInput
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                keyboardType="numeric"
            />
            <Button buttonColor="#33CCFF" textColor="black" mode="contained" onPress={handleUpdatePlace}>Update</Button>
        </View>
    );
}

export default PlaceUpdate;
