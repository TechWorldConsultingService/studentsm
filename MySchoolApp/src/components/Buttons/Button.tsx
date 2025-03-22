import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface ButtonProps {
    onPress: ()=> void;
    buttonText: string;
}
const CustomButton: React.FC<ButtonProps> = ({onPress, buttonText}) => {
    return (

        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: "#6200EA",
                padding: 15,
                marginTop: 20,
                alignItems: "center",
                borderRadius: 5,
            }}
        >
            <Text style={{ color: "white", fontWeight: "bold" }}>{buttonText}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({})