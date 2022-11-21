import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {gray, green, primary, secondBackground} from '../../component/common/LMStyle';
import LMButton from '../../component/common/LMButton';
import {Root} from 'popup-ui';
import LMTextInput from '../../component/common/LMTextInput';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useDispatch} from 'react-redux';
import {UserAction} from '../../persistent/user/UserAction';
import LMAlert from '../../component/common/LMAlert';
import LMToast from '../../component/common/LMToast';
import LMLoading from '../../component/common/LMLoading';
import LMTouchableOpacity from '../../component/common/LMTouchableOpacity';

export default function WalletLoginScreen({navigation,lang}){
    useEffect(async () => {

    }, []);
    const dispatch = useDispatch();
    const schema = yup.object().shape({
        password: yup.string().required(lang.pleaseInputPassword).min(8,lang.passwordMustBeAtLeast8Characters)
    });
    const {control, handleSubmit, errors} = useForm({
        resolver: yupResolver(schema),
    });
    const [securePassword,setSecurePassword] = useState(true);
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    const onSubmit = ({password}) => {
        LMLoading.show();
        dispatch(UserAction.signIn({
            password : password
        })).then((data)=>{
            const {success} = data;
            if(!success){
                LMToast.error({
                    title: lang.error,
                    text: lang.invalidCredentials,
                });
            }
        })
    };
    return (
        <Root>
            <SafeAreaView style={styles.container}>
                <View style={styles.topBackBg}></View>
                <View style={styles.header}>

                </View>
                <View style={styles.layerContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/bsc.png')} style={{width : 150, height: 150}} resizeMode={'cover'}/>
                        <Text style={{fontSize: 25, fontWeight : 'bold'}}>{lang.signIn}</Text>
                        <Text style={{color : 'gray'}}>{lang.theBestDecentralized}</Text>
                    </View>
                    <View style={styles.contentContainer}>
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
                                        placeholder={'Password'}
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
                                defaultValue=""
                            />
                        </View>
                        <View style={styles.row}>
                            <LMButton
                                label={lang.confirm}
                                onPress={handleSubmit(onSubmit)}
                            />
                        </View>
                        <LMTouchableOpacity style={styles.loginContainer} onPress={()=>{
                            LMAlert.show({
                                message : lang.areYouSureWantToEraseYourWallet,
                                content : () => {
                                    return (
                                        <>
                                            <View>
                                                <Text style={{textAlign: 'justify'}}>{lang.yourCurrentWalletAccountsAssetsWillBe} <Text style={{fontWeight : 'bold'}}>{lang.removedFromThisAppPermanently}</Text> {lang.thisActionCannotBeUndone}</Text>
                                            </View>
                                            <View>
                                                <Text style={{textAlign: 'justify'}}>{lang.youCanOnlyRecoverThisWalletWithYour} <Text style={{fontWeight : 'bold'}}>{lang.secretRecoveryPhrase}</Text> {lang.wpayDoesNotHaveYourSecretRecoveryPhrase}</Text>
                                            </View>
                                        </>
                                    )
                                },
                                onOkPress :  async () => {
                                    dispatch(UserAction.clear()).then(()=>{
                                        navigation.navigate("ImportWalletScreen");
                                    });

                                }
                            });
                        }}>
                            <Text style={{color : 'gray'}}>{lang.dontHaveAWallet}  <Text style={{color : '#F0B90B', fontWeight : 'bold'}}>{lang.create}</Text></Text>
                        </LMTouchableOpacity>
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
