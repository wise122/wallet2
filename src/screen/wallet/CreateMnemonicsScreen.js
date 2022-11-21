import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {white} from '../../component/common/LMStyle';
import LMButton from '../../component/common/LMButton';
import LMBackButton from '../../component/common/LMBackButton';
import {Root} from 'popup-ui';
import WalletModule from '../../module/etherjs/WalletModule';

export default function CreateMnemonicsScreen({navigation, route, lang}) {
    const {password} = route.params;
    const [mnemonics, setMnemonics] = useState(null);
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        onPressReveal();
    }, []);
    const onPressReveal = () => {
        const mnemonics = WalletModule.generateMnemonics();
        setMnemonics(mnemonics);
    };

    const renderMnemonic = (mnemonic, index) => (
        <View style={styles.mnemonic} key={index}>
            <View style={{width: '80%'}}>
                <Text style={{textAlign: 'left', fontWeight : 'bold'}}>{index + 1}. {mnemonic}</Text>
            </View>
        </View>
    );
    const renderBody = () => {
        return (
            <View style={styles.mnemonicsContainer}>
                {mnemonics && mnemonics.map(renderMnemonic)}
            </View>
        );
    };
    return (
        <Root>
            <SafeAreaView style={styles.container}>
                <View style={styles.topBackBg}></View>
                <View style={styles.header}>
                    <LMBackButton color={'black'} onPress={() => {
                        navigation.goBack();
                    }}/>

                </View>
                <View style={styles.layerContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/bsc.png')} style={{width : 150, height: 150}} resizeMode={'cover'}/>
                        <Text style={{fontSize: 25, fontWeight : 'bold'}}>{lang.secretRecoveryPhrase}</Text>
                        <Text style={{color : 'gray', textAlign : 'center', paddingLeft : 10, paddingRight : 10}}>{lang.writeDownAndSave}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        {renderBody()}
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.row}>
                            <LMButton
                                label={lang.continue}
                                onPress={() => {
                                    navigation.navigate('ConfirmMnemonicsScreen', {mnemonics, password});
                                }}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Root>
    );
}
const styles = StyleSheet.create({
    header: {
        height: 50,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
    },
    topBackBg: {
        height: 250,
        width: '100%',
        backgroundColor: '#F0B90B',
        position : 'absolute'
    },
    container: {
        alignItems: 'center',
        flex: 1
    },
    layerContainer : {
        flex: 1,
        width : '90%',
        backgroundColor : 'white',
        borderRadius : 20
    },
    logoContainer : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    contentContainer: {
        flex: 2,
        padding: 10,
    },
    row : {
        width: '100%',
        marginBottom: 10,
    },
    loginContainer : {
        position : 'absolute',
        bottom : 0,
        height : 50,
        width : '100%',
        justifyContent: 'center',
        alignItems : 'center'
    },
    mnemonicsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginHorizontal: 10,
        borderRadius: 10,
    },
    overlayMnemonics: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mnemonic: {
        margin: 5,
        width: 130,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.2,
        borderColor: '#f5bd00',
    },
    buttonContainer : {
        position : 'absolute',
        bottom : 0,
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center',
        padding : 10
    }
});
