import axios from 'axios';
import {ApplicationProperties} from '../../ApplicationProperties';
import {LMStorageService} from '../storage/LMStorageService';
import {LMStorageConstant} from '../storage/LMStorageConstant';
import _ from 'lodash'
async function addCustomToken(token) {
    const customs = await LMStorageService.getItem(LMStorageConstant.CUSTOM_TOKENS_STORAGE_KEY) || [];
    const tokens = await LMStorageService.getItem(LMStorageConstant.TOKENS_STORAGE_KEY) || [];
    await LMStorageService.setItem(LMStorageConstant.TOKENS_STORAGE_KEY,[token,...tokens]);
    await LMStorageService.setItem(LMStorageConstant.CUSTOM_TOKENS_STORAGE_KEY,[token,...customs]);
}
async function getTokens(name) {
    const {data} = await axios.get(ApplicationProperties.TOKEN_URLS[name],{timeout : 5000});
    return data;
}
async function getCommonBaseTokens() {
    return await LMStorageService.getItem(LMStorageConstant.COMMON_TOKENS_STORAGE_KEY) || ApplicationProperties.COMMON_TOKENS;
}
async function isExist(tokenContractAddress) {
    const tokens = await LMStorageService.getItem(LMStorageConstant.TOKENS_STORAGE_KEY) || [];
    const index = _.find(tokens,function(token){
        return token.address == tokenContractAddress;
    });
    return _.isNil(index)  ? false : true;
}
export const TokenService = {
    getTokens,
    getCommonBaseTokens,
    addCustomToken,
    isExist
};
