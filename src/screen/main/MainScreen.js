import React, {useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {black, defaultBackground, gray, green, white} from '../../component/common/LMStyle';
import {useDispatch, useSelector} from 'react-redux';
import {WalletAction} from '../../persistent/wallet/WalletAction';
import LMSelect from '../../component/common/LMSelect';
import LMLoading from '../../component/common/LMLoading';
import Jazzicon from 'react-native-jazzicon';
import LMNetworkSelector from '../../component/common/LMNetworkSelector';
import LMCrypto from '../../component/common/LMCrypto';
import LMFiat from '../../component/common/LMFiat';
import LMTouchableOpacity from '../../component/common/LMTouchableOpacity';
import LMTokenIcon from '../../component/common/LMTokenIcon';
import LMFlatList from '../../component/common/LMFlatList';
import {AssetAction} from '../../persistent/asset/AssetAction';
import {TokenAction} from '../../persistent/token/TokenAction';
import NumberFormat from 'react-number-format';
global.fetch = require('node-fetch');

export default function MainScreen({navigation, route}) {
    const dispatch = useDispatch();
    const {activeWallet, wallets} = useSelector(state => state.WalletReducer);
    const {activeNetwork} = useSelector(state => state.NetworkReducer);
    const {assets} = useSelector(state => state.AssetReducer);
    const {language} = useSelector(state => state.LanguageReducer)
    useEffect(async () => {
        dispatch(AssetAction.list(activeWallet,activeNetwork.chainId));
        dispatch(TokenAction.getTokens({chainId: activeNetwork.chainId}));
    }, []);
    const formatWalletAddress = (address?) => {
        const prefix = address.substring(0,6);
        const suffix = address.substring(address.length-4,address.length);
        return prefix + "..." + suffix;
    }
    const renderItem =  ({item}) => {
        return (
            <TouchableOpacity style={styles.item} onPress={async () => {

            }}>
                <View style={{width: 40, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <LMTokenIcon uri= {item.logoURI}/>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 14}}>{item.symbol}</Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
                    <NumberFormat
                        value={item.balance.val}
                        displayType={'text'}
                        thousandSeparator={true}
                        decimalScale={4}
                        renderText={value => (
                            <Text>{value}</Text>
                        )}
                    />
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../../../assets/bsc.png')} style={styles.logo} resizeMode={'contain'}/>
                <LMNetworkSelector/>
                <TouchableOpacity style={[styles.logo, {alignItems: 'flex-end', justifyContent: 'center'}]}
                                  onPress={() => {
                                      navigation.navigate('ScannerScreen', {
                                          screenName: 'TransferScreen',
                                      });
                                  }}>
                    <Image source={require('../../../assets/qr-code.png')} style={styles.icon} resizeMode={'stretch'}/>
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.accountContainer} onPress={() => {
                    LMSelect.show({
                        data: wallets,
                        onPress: (item) => {
                            LMLoading.show();
                            dispatch(WalletAction.setActiveWallet({
                                privateKey: item.privateKey,
                                name: item.name,
                                chainId : activeNetwork.chainId
                            })).then(() => {
                                LMLoading.hide();
                            });
                        },
                        key: 'address',
                        label: 'name',
                        renderItem: (item) => {
                            return (
                                <>
                                    <View
                                        style={{width: 60, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                                        <Jazzicon size={32} address={item.address}/>
                                    </View>
                                    <View style={{flex: 1, justifyContent: 'center'}}>
                                        <Text style={{fontSize: 14}}>{item.name}</Text>
                                        <LMCrypto value={item.balance}/>
                                        <LMFiat value={item.balance}/>
                                    </View>
                                    <View
                                        style={{width: 60, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                                        {
                                            activeWallet.address == item.address &&
                                            <View style={{
                                                width: 16,
                                                height: 16,
                                                backgroundColor: green,
                                                borderColor: gray,
                                                borderRadius: 32,
                                            }}>
                                            </View>
                                        }

                                    </View>
                                </>
                            );
                        },
                    });

                }}>
                    <View style={{flex: 1}}>
                        <Text style={styles.title}>{activeWallet.name}</Text>
                        <Text numberOfLines={1}>{formatWalletAddress(activeWallet.address)}</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>

                        <LMCrypto value={activeWallet.balance}/>
                        <LMFiat value={activeWallet.balance}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.operationContainer}>
                    <TouchableOpacity style={styles.operationItem} onPress={() => {
                        navigation.navigate('TransferScreen');
                    }}>
                        <Image source={require('../../../assets/transfer.png')} style={styles.operationIcon}
                               resizeMode={'stretch'}/>
                        <Text style={{color: black}}>{language.transfer}</Text>
                    </TouchableOpacity>
                    <Image source={require('../../../assets/div.png')} style={styles.div} resizeMode={'stretch'}/>
                    <TouchableOpacity style={styles.operationItem} onPress={async () => {
                        navigation.navigate('TopUpScreen');
                    }}>
                        <Image source={require('../../../assets/topup.png')} style={styles.operationIcon}
                               resizeMode={'stretch'}/>
                        <Text style={{color: black}}>{language.topUp}</Text>
                    </TouchableOpacity>
                    <Image source={require('../../../assets/div.png')} style={styles.div} resizeMode={'stretch'}/>
                    <TouchableOpacity style={styles.operationItem} onPress={() => {
                        navigation.navigate('TransactionScreen');
                    }}>
                        <Image source={require('../../../assets/history.png')} style={styles.operationIcon}
                               resizeMode={'stretch'}/>
                        <Text style={{color: black}}>{language.history}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.assets}>
                    <View style={styles.assetTitle}>
                        <Text style={styles.assetText}>{language.assets}</Text>
                        <LMTouchableOpacity onPress={()=>{
                            navigation.navigate("TokenScreen",{
                                onSelect : async (token) => {
                                    dispatch(AssetAction.addAsset(activeWallet,activeNetwork.chainId,token));
                                },
                                search : 'BNB'
                            });
                        }}>
                            <Text style={styles.assetText}>{language.add}</Text>
                        </LMTouchableOpacity>
                    </View>
                    <LMFlatList
                        data={assets}
                        keyExtractor={item=>item.symbol}
                        renderItem={renderItem}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultBackground,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        flex: 1,
    },
    header: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
    },
    logo: {
        width: 70,
        height: 50,
    },
    accountContainer: {
        marginTop: 24,
        height: 50,
        flexDirection: 'row',
    },
    operationContainer: {
        marginTop: 24,
        height: 84,
        backgroundColor: '#f5bd00',
        borderRadius: 10,
        padding: 8,
        flexDirection: 'row',
    },
    operationItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    operationIcon: {
        width: 32,
        height: 32,
    },
    div: {
        width: 1,
        height: 57,
    },
    contentContainer: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    activityContainer: {
        marginTop: 24,
        height: 275,
    },
    title: {
        fontSize: 18, fontWeight: 'bold',
    },
    activityItem: {
        width: '100%',
        height: 60,
        marginTop: 1,
        flexDirection: 'row',
    },
    activityIconContainer: {
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIcon: {
        width: 24,
        height: 24,
    },
    leftActivityItem: {
        flex: 4,
        justifyContent: 'center',
    },
    rightActivityItem: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    assets: {
        flex:1,
    },
    assetTitle : {
        width : '100%',
        height : 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection : 'row'
    },
    assetText : {
        fontWeight:  'bold'
    },
    icon: {width: 32, height: 32, backgroundColor: '#f5bd00', borderRadius: 5},
    item : {
        width : '100%',
        height : 60,
        borderBottomWidth : 0.5,
        borderBottomColor : '#e2e2e2',
        flexDirection:  'row'
    },
});
