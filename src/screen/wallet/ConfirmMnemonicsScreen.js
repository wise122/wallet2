import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {green, primary, secondBackground} from '../../component/common/LMStyle';
import _ from 'lodash';
import {WalletAction} from '../../persistent/wallet/WalletAction';
import {useDispatch} from 'react-redux';
import LMButton from '../../component/common/LMButton';
import LMBackButton from '../../component/common/LMBackButton';
import {Root, Toast} from 'popup-ui';
import {UserAction} from '../../persistent/user/UserAction';
import LMLoading from '../../component/common/LMLoading';
import LMToast from '../../component/common/LMToast';

export default function ConfirmMnemonicsScreen({navigation,route,lang}){
    const dispatch = useDispatch();

    const {mnemonics,password} = route.params;
    const [selectable,setSelectable] = useState(_.shuffle([...mnemonics]));
    const [selected,setSelected] = useState([]);

    useEffect(()=>{

    },[]);

    const onPressMnemonic = (mnemonic, isSelected) => {
        if (isSelected){
            setSelectable(selectable.filter(m => m !== mnemonic));
            setSelected(selected.concat([mnemonic]));

        } else{
            setSelectable(selectable.concat([mnemonic]));
            setSelected(selected.filter(m => m !== mnemonic));
        }
    }
    const renderMnemonic = (mnemonic, index, selected) => (
        <TouchableOpacity style={styles.mnemonic} key={index} onPress={()=>{
            onPressMnemonic(mnemonic,selected)
        }}>
            <View style={{width : '80%'}}>
                <Text style={{textAlign : "left"}}>{index+1}. {mnemonic}</Text>
            </View>
        </TouchableOpacity>
    );
    const renderSelectableMnemonic = (mnemonic, index, selected) => (
        <TouchableOpacity style={styles.selectableMnemonic} key={index} onPress={()=>{
            onPressMnemonic(mnemonic,selected)
        }}>
            <Text>{mnemonic}</Text>
        </TouchableOpacity>
    );
    const renderSelected = () => (
        <View style={styles.mnemonicsContainer}>
            {selected.map((mnemonic, index) => {
                return renderMnemonic(mnemonic, index, false);
            })}
        </View>
    );

    const renderSelectable = () => (
        <View style={styles.selectableMnemonicsContainer}>
            {selectable.map((mnemonic, index) => {
                return renderSelectableMnemonic(mnemonic, index, true);
            })}
        </View>
    );
    const isValidSequence = () => {
        return _.isEqual(mnemonics, selected);
    }
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
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
                        <Text style={{fontSize: 25, fontWeight : 'bold'}}>{lang.confirmSecretRecoveryPhrase}</Text>
                        <Text style={{color : 'gray', textAlign : 'center', paddingLeft : 10, paddingRight : 10}}>{lang.tapTheWords}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        {renderSelected()}
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.row}>
                            {renderSelectable()}
                        </View>
                        <View style={styles.row}>
                            <LMButton
                                label={lang.continue}
                                onPress={async () => {
                                    if (isValidSequence()) {
                                        LMToast.error({
                                            title: lang.error,
                                            text: lang.yourSeedPhraseOrderIsIncorrect,
                                        })
                                        return;
                                    }
                                    LMLoading.show();
                                    await sleep(1000);
                                    dispatch(WalletAction.addFromMnemonic({mnemonics, name: lang.defaultWalletName, isMain: true})).then(response => {
                                        const {success, data} = response;
                                        if (success) {
                                            dispatch(UserAction.signUp({
                                                password: password,
                                                walletAddress : data.address,
                                                secretRecoveryPhrase : mnemonics.join(' ')
                                            }));
                                        }
                                        LMLoading.hide();
                                    });
                                }}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Root>
    )
}
const styles = StyleSheet.create({
    selectableMnemonicsContainer : {
        width : '100%',
        borderRadius : 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    selectableMnemonic : {
        width : 70,
        height : 35,
        backgroundColor : 'white',
        borderRadius : 5,
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 0.2,
        borderColor : '#f5bd00',
        margin : 2
    },

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
