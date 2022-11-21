import React from 'react';
import {useSelector} from 'react-redux';
import WalletLoginScreen from './WalletLoginScreen';
import CreateWalletScreen from './CreateWalletScreen';

export default function StartScreen({navigation, lang}) {
    const {loggedIn} = useSelector(state => state.UserReducer);
    if(loggedIn){
        return <WalletLoginScreen navigation={navigation} lang={lang}/>
    }
    return (
        <CreateWalletScreen navigation={navigation} lang={lang}/>
    )
}
