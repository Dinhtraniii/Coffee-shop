import React, { useState } from "react"
import { View, Image } from "react-native"
import { Text, TextInput, Button } from "react-native-paper"
import firestore from '@react-native-firebase/firestore'
import storage from "@react-native-firebase/storage"
import ImagePicker from "react-native-image-crop-picker"
import { useMyContextProvider } from "../index"

const AddNewProduct = ({navigation}) => {
    const [controller, dispatch] = useMyContextProvider()
    const {userLogin} = controller
    const [imagePath, setImagePath] = useState('')
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const ProductS = firestore().collection("Product")
    const handleAddNewProduct = () => {
        ProductS.add({
            title,
            price,
            create: userLogin.email
        })
        .then(response =>{
            const refImage = storage().ref("/Products/" + response.id + ".png")
            refImage.putFile(imagePath)
            .then(
                ()=>
                    refImage.getDownloadURL()
                    .then(link =>
                        {
                            ProductS.doc(response.id).update({
                                id: response.id, 
                                image: link
                            })
                            navigation.navigate("Products")
                        }
                    )
                )
            .catch(e => console.log(e.message))
        })
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
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Product name *</Text>
            <Button textColor="black" buttonColor="#33CCFF" style={{margin: 10}} mode="contained" onPress={handleUploadImage}>
                Upload Image
            </Button>
            {((imagePath!= "")&&
            <Image source={{uri: imagePath}}
                style={{height: 300}}
            />
            )}
            <TextInput
                placeholder="Input a Product name"
                value={title}
                onChangeText={setTitle}
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Price *</Text>
            <TextInput
                placeholder="0"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <Button buttonColor="#33CCFF" textColor="black" mode="contained" onPress={handleAddNewProduct}>Add</Button>
        </View>
    );
};

export default AddNewProduct;
