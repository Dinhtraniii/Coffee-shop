import React, { useState } from "react";
import { View, Image } from 'react-native'
import {Text, TextInput, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";

const ProductUpdate = ({ route, navigation }) => {
    const { Product } = route.params;
    const [title, setTitle] = useState(Product.title);
    const [price, setPrice] = useState(Product.price);
    const [imagePath, setImagePath] = useState(Product.image);

    const handleUpdateProduct = async () => {
        try {
            await firestore()
                .collection('Product')
                .doc(Product.id)
                .update({
                    title: title,
                    price: price
                });
            if (imagePath !== Product.image) {
                const refImage = storage().ref(`/Products/${Product.id}.png`);
                await refImage.putFile(imagePath);
                const imageLink = await refImage.getDownloadURL();
                await firestore()
                    .collection('Product')
                    .doc(Product.id)
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
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Product name *</Text>
            <TextInput
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                value={title}
                onChangeText={setTitle}
                placeholder="Input a Product name"
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Price *</Text>
            <TextInput
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                keyboardType="numeric"
            />
            <Button buttonColor="#33CCFF" textColor="black" mode="contained" onPress={handleUpdateProduct}>Update</Button>
        </View>
    );
}

export default ProductUpdate;
