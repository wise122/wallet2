import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {green} from './LMStyle';

export default function LMButton({...rest}) {
    const {label,labelStyle, style} = {...rest};
    return (
        <TouchableOpacity {...rest} style={[styles.container,style]}>
            <Text style={[styles.label,labelStyle]}>{label}</Text>
        </TouchableOpacity>

    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems : 'center',
        backgroundColor : '#F0B90B',
        borderRadius : 5
    },
    label : {
        color : 'black',
        fontSize : 16,
        lineHeight : 22
    }
});
