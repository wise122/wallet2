import React from 'react';
import CommonAPI from '../../module/api/CommonAPI';
import {ApplicationProperties} from '../../ApplicationProperties';
import WalletModule from '../../module/etherjs/WalletModule';
import {BigNumber} from 'ethers';
import convert from 'ether-converter';
import EtherUtilModule from '../../module/etherjs/EtherUtilModule';
import {green, orange, red} from '../../component/common/LMStyle';
import moment from 'moment';
import _ from 'lodash';

export const WalletService = {
    fromMnemonic,
    fromPrivateKey,
    getTransactions,
    sendTransaction,
    getFeeSuggestions
};

async function fromMnemonic(mnemonics) {
    const wallet = await WalletModule.fromMnemonic(mnemonics);
    return {
        success : wallet ? true : false ,
        data: wallet
    };
}
async function fromPrivateKey(pk) {
    const wallet = await WalletModule.fromPrivateKey(pk);
    return {
        success : wallet ? true : false ,
        data: wallet
    };
}
async function sendTransaction(wallet,tx) {
    const transaction = await WalletModule.sendTransaction(wallet,tx);
    return {
        success : !_.isNil(transaction.Error) ? true : false ,
        data: transaction
    };
}
async function getTransactions(address) {
    const {status,message,result} = await CommonAPI.get('api?module=account&action=txlist&address='+address+'&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey='+ApplicationProperties.ETHERSCAN_API_KEY);
    const data =  status === '1' ? result : [];

    data.map((transaction) => {
        transaction.sentOrReceived = transaction.from.toUpperCase() == address.toUpperCase() ? 'Sent' : 'Received';
        transaction.status = transaction.isError == "1" ? 'Cancelled' : transaction.txreceipt_status == '0' ? 'Pending' : 'Confirmed';
        transaction.color = transaction.isError == "1" ? red : transaction.txreceipt_status == '0' ? orange : green;
        transaction.icon = transaction.from.toUpperCase() == address.toUpperCase() ? require('../../../assets/send.png') : require('../../../assets/receive.png');
        transaction.date = moment(transaction.timeStamp,'X').format('MMMM Do YYYY, h:mm:ss a');
        transaction.etherValue = convert(transaction.value, 'wei').ether;
        transaction.etherGasValue = convert(transaction.gasPrice*transaction.gas, 'wei').ether;
    });
    return data;
}

async function getFeeSuggestions(gasLimit) {
    const {status,message,result} = await CommonAPI.get('api?module=gastracker&action=gasoracle&apikey='+ApplicationProperties.ETHERSCAN_API_KEY);
    if(status === '1'){
        const safeGasPrice = result.SafeGasPrice;
        const proposeGasPrice = result.ProposeGasPrice;
        const fastGasPrice = result.FastGasPrice;
        return {
            safeGasPrice : {...await calculateFee(safeGasPrice, gasLimit),key : 1},
            proposeGasPrice : {...await calculateFee(proposeGasPrice, gasLimit),key : 2},
            fastGasPrice : {...await calculateFee(fastGasPrice, gasLimit),key : 3},
        }

    }
    return status === '1' ? result : {
        safeGasPrice : 0,
        proposeGasPrice : 0,
        fastGasPrice : 0,
    };
}
async function calculateFee(gasPrice, gasLimit) {
    const price = BigNumber.from(convert(gasPrice/10, 'gwei', 'wei'));
    let etherFee = price.mul(BigNumber.from(gasLimit));
    etherFee = await EtherUtilModule.formatUnits(etherFee.toString());
    return {
        wei : price,
        ether : etherFee
    }
}
