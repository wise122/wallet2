import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {green, primary, secondBackground} from '../../component/common/LMStyle';
import LMButton from '../../component/common/LMButton';
import {Root} from 'popup-ui';
import LMTextInput from '../../component/common/LMTextInput';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useDispatch} from 'react-redux';
import {UserAction} from '../../persistent/user/UserAction';
import LMBackButton from '../../component/common/LMBackButton';
import {WalletAction} from '../../persistent/wallet/WalletAction';
import LMLoading from '../../component/common/LMLoading';
import LMToast from '../../component/common/LMToast';
import LMTouchableOpacity from '../../component/common/LMTouchableOpacity';
import LMAlert from '../../component/common/LMAlert';

export default function ImportWalletScreen({navigation,lang}){
    const dispatch = useDispatch();
    const schema = yup.object().shape({
        recoveryPhrase : yup.string().required(lang.walletSecretRecoveryPhrase),
        password: yup.string().required(lang.pleaseInputPassword).min(8,lang.passwordMustBeAtLeast8Characters),
        confirmPassword: yup.string().required(lang.pleaseInputConfirmPassword).oneOf([yup.ref('password'), null],lang.passwordMustMatch)
    });
    const {control, handleSubmit, errors} = useForm({
        resolver: yupResolver(schema),
    });
    const [securePhrase,setSecurePhrase] = useState(true);
    const [securePassword,setSecurePassword] = useState(true);
    const onSubmit = async ({recoveryPhrase, password}) => {
        const mnemonics = recoveryPhrase.split(' ');
        LMLoading.show();
        await sleep(1000);
        dispatch(WalletAction.addFromMnemonic({mnemonics, name: lang.defaultWalletName, isMain: true})).then(response => {
            const {success, data} = response;
            if (success) {
                LMLoading.hide();
                dispatch(UserAction.signUp({
                    password: password,
                    walletAddress : data.address,
                    secretRecoveryPhrase : mnemonics.join(' ')
                }));
            } else {
                LMLoading.hide();
                LMToast.error({
                    title: lang.error,
                    text: lang.yourWalletSecretRecoveryPhraseIsIncorrect,
                })
            }
        });
    };
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
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
                        <Text style={{fontSize: 25, fontWeight : 'bold'}}>{lang.importWallet}</Text>
                        <Text style={{color : 'gray', textAlign : 'center', paddingLeft : 10, paddingRight : 10}}>{lang.typically12}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.row}>
                            <Controller
                                control={control}
                                render={({onChange, onBlur, value}) => (
                                    <LMTextInput
                                        label={lang.walletSecretRecoveryPhrase}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        error={errors['recoveryPhrase']}
                                        placeholder={lang.enterOrPasteYourWalletSecretRecoveryPhrase}
                                        labelStyle={{color : primary}}
                                        secureTextEntry={securePhrase}
                                        hint={lang.clickToShow}
                                        onHintPress={async () => {
                                            setSecurePhrase(false);
                                            await sleep(5000);
                                            setSecurePhrase(true);
                                        }}
                                        multiline={true}
                                        style={{height: 70}}
                                    />
                                )}
                                name="recoveryPhrase"
                                defaultValue=""
                            />
                        </View>
                        <View style={styles.row}>
                            <Controller
                                control={control}
                                render={({onChange, onBlur, value}) => (
                                    <LMTextInput
                                        label={lang.password}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        error={errors['password']}
                                        secureTextEntry={securePassword}
                                        placeholder={lang.password}
                                        labelStyle={{color : primary}}
                                        hint={lang.clickHereToShowYourPassword}
                                        onHintPress={async () => {
                                            setSecurePassword(false);
                                            await sleep(5000);
                                            setSecurePassword(true);
                                        }}
                                    />
                                )}
                                name="password"
                                defaultValue=""//12345678
                            />
                        </View>
                        <View style={styles.row}>
                            <Controller
                                control={control}
                                render={({onChange, onBlur, value}) => (
                                    <LMTextInput
                                        label={lang.confirmPassword}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                        error={errors['confirmPassword']}
                                        secureTextEntry={securePassword}
                                        placeholder={lang.confirmPassword}
                                        labelStyle={{color : primary}}
                                        hint={lang.clickHereToShowYourPassword}
                                        onHintPress={async () => {
                                            setSecurePassword(false);
                                            await sleep(5000);
                                            setSecurePassword(true);
                                        }}
                                    />
                                )}
                                name="confirmPassword"
                                defaultValue="" //12345678
                            />
                        </View>
                        <View style={styles.row}>
                            <LMButton
                                label={lang.confirm}
                                onPress={handleSubmit(onSubmit)}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Root>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1
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
    }
});
