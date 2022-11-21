import {LMStorageService} from '../storage/LMStorageService';
import _ from 'lodash';

async function addAsset(address,chainId,token) {
    const assets = await LMStorageService.getItem(`LMStorageConstant.ASSET_STORAGE_KEY_${address}_${chainId}`) || [];
    let flag = false;
    for(let i = 0 ; i < assets.length; i++){
        if(token.address == assets[i].address){
            flag = true;
            break;
        }
    }
    if(!flag){
        assets.push(token);
        await LMStorageService.setItem(`LMStorageConstant.ASSET_STORAGE_KEY_${address}_${chainId}`,assets);
    }
    return !flag;
}
async function removeAsset(address,chainId,token) {
    const assets = await LMStorageService.getItem(`LMStorageConstant.ASSET_STORAGE_KEY_${address}_${chainId}`) || [];
    _.remove(assets,function(asset){
        return asset.address == token.address;
    });
    await LMStorageService.setItem(`LMStorageConstant.ASSET_STORAGE_KEY_${address}_${chainId}`,assets);
    return assets;
}
async function list(address,chainId) {
    const assets = await LMStorageService.getItem(`LMStorageConstant.ASSET_STORAGE_KEY_${address}_${chainId}`) || [];
    return assets;
}
async function isExist(tokenContractAddress) {

}
export const AssetService = {
    addAsset,
    removeAsset,
    list,
    isExist
};
