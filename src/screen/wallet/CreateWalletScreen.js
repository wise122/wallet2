import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {primary} from '../../component/common/LMStyle';
import LMButton from '../../component/common/LMButton';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import LMTextInput from '../../component/common/LMTextInput';
import LMTouchableOpacity from '../../component/common/LMTouchableOpacity';
import LMAlert from '../../component/common/LMAlert';
import {UserAction} from '../../persistent/user/UserAction';
import {Root} from 'popup-ui';
import {useDispatch} from 'react-redux';

export default function CreateWalletScreen({navigation,lang}){
    const dispatch = useDispatch();
    const schema = yup.object().shape({
        password: yup.string().required(lang.pleaseInputPassword).min(8,lang.passwordMustBeAtLeast8Characters),
        confirmPassword: yup.string().required(lang.pleaseInputConfirmPassword).oneOf([yup.ref('password'), null], lang.passwordMustMatch)
    });
    const {control, handleSubmit, errors} = useForm({
        resolver: yupResolver(schema),
    });
    const [securePassword,setSecurePassword] = useState(true);
    const onSubmit = ({password}) => {
        navigation.navigate("CreateMnemonicsScreen",{password});
    };
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    return (
        <Root>
        <SafeAreaView style={styles.container}>
            <View style={styles.topBackBg}></View>
            <View style={styles.header}>

            </View>
            <View style={styles.layerContainer}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../../assets/bsc.png')} style={{width : 150, height: 150}} resizeMode={'cover'}/>
                    <Text style={{fontSize: 25, fontWeight : 'bold'}}>{lang.createWallet}</Text>
                    <Text style={{color : 'gray'}}>{lang.privateKeyNeverLeaveYourDevice}</Text>
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
                            defaultValue=""
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
                            defaultValue=""
                        />
                    </View>
                    <LMTouchableOpacity style={styles.row} onPress={()=>{
                        navigation.navigate("TermsAndConditionsScreen");
                    }}>
                        <Text style={{color : primary}}>{lang.byClicking} <Text style={{color : primary, fontWeight : 'bold'}}>{lang.confirm}, </Text> {lang.youHaveAgreed} <Text style={{color : primary, fontWeight : 'bold'}}>{lang.termOfUse}</Text></Text>
                    </LMTouchableOpacity>
                    <View style={styles.row}>
                        <LMButton
                            label={lang.confirm}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                    <LMTouchableOpacity style={styles.loginContainer} onPress={()=>{
                        dispatch(UserAction.clear()).then(()=>{
                            navigation.navigate("ImportWalletScreen");
                        });
                    }}>
                        <Text style={{color : 'gray'}}>{lang.alreadyHaveAWallet}  <Text style={{color : '#F0B90B', fontWeight : 'bold'}}>{lang.import}</Text></Text>
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
