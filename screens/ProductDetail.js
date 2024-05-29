import React from "react"
import { View, Image } from "react-native"
import { Text } from "react-native-paper"

const ProductDetail = ({ route }) => {
    const { Product } = route.params
    return (
        
        <View style={{padding: 10}}>
             {Product.image !== "" && (
                <View style={{ flexDirection: 'row' }}>
                   
                    <Image
                        source={{ uri: Product.image }}
                        style={{ height: 300, width: '100%' }}
                        resizeMode="contain"
                    />
                </View>
            )}
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Product name: </Text>
                <Text style={{ fontSize: 20}}>{Product.title}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>CreateBy: </Text>
                <Text style={{ fontSize: 20}}>{Product.create}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Price: </Text>
                <Text style={{ fontSize: 20,color:'red'}}>{Product.price} ₫</Text>
            </View>
           
        </View>
    )
}

export default ProductDetail;
