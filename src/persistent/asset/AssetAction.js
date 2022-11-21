import {AssetService} from './AssetService';
import {addAssetSuccess, getAssetsSuccess, removeAssetSuccess} from './AssetReducer';
import PancakeswapModule from '../../module/pancakeswap/PancakeswapModule';


export const AssetAction = {
    addAsset,
    removeAsset,
    list
};

function addAsset(wallet,chainId,token) {
    return async dispatch => {
        const balance = await PancakeswapModule.tokenBalance(wallet,token);
        const success = await AssetService.addAsset(wallet.address, chainId,{...token,balance});
        if(success){
            dispatch(addAssetSuccess({...token,balance}));
        }
    };
}
function removeAsset(wallet,chainId,token) {
    return async dispatch => {
        const assets = await AssetService.removeAsset(wallet.address,chainId,token);
        dispatch(removeAssetSuccess(assets));
    };
}
function list(wallet,chainId) {
    return async dispatch => {
        const assets = await AssetService.list(wallet.address,chainId);
        for(let i = 0 ; i < assets.length ; i++){
            assets[i].balance = await PancakeswapModule.tokenBalance(wallet, assets[i]);
        }
        dispatch(getAssetsSuccess(assets));
    };
}
