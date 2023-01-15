import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import {
  GOERLI_BASE,
  MAINNET_BASE,
  mi777Address,
  ETHERSCAN_APIKEY,
  test1,
  test2,
  mi777FunctionUrl,
  PIXELLADY_ADDRESS,
  IAN_WALLET,
  INFURA_MAIN,
  INFURA_TEST,
} from './consts.js';

const { template, utils, download } = ham;

console.warn('[].length || null', [].length ? [] : null);



const buildTokenHoldingQuery = (wallet, token, apiNetwork = MAINNET_BASE) => {
  return `${apiNetwork}?module=account&action=addresstokennftinventory&address=${wallet}&contractaddress=${token}&page=1&offset=100&apikey=${ETHERSCAN_APIKEY}`
};


const fetchAndDownload = async (url, type = 'text') => {
  const res = await (await fetch(url))[type]();
  console.log({ res });
  download('./file.' + type === 'text' ? 'txt' : 'json', res)

  return res
}

const web3 = new Web3(INFURA_MAIN)
const pxlAbi = JSON.parse((await (await fetch('./pixellady-abi.json')).json()).result);
const pixelLady = new web3.eth.Contract(pxlAbi, PIXELLADY_ADDRESS,
  // {
  //   from: '0x1234567890123456789012345678901234567891', // default from address
  // }
);

pixelLady.defaultAccount = IAN_WALLET

console.warn('PIXELLADYS', pixelLady)
console.warn('pixelLady.events.allEvents(s', pixelLady.events.allEvents({
  topics: [IAN_WALLET]
}))

const totalSupply = pixelLady.methods.totalSupply()
const tokenURI = pixelLady.tokenURI
const balanceOfIan = pixelLady.methods.balanceOf(IAN_WALLET)
balanceOfIan.call().then(res => {
  console.warn('balanceOfIan Res', res);
})
console.log('balanceOfIan', { balanceOfIan })
console.log('totalSupply', { totalSupply })
console.log('tokenURI', { tokenURI })
const ianQuery = buildTokenHoldingQuery(IAN_WALLET, PIXELLADY_ADDRESS)
console.log('ianQuery', ianQuery)
// const func = await fetchAndDownload(mi777FunctionUrl, 'text')

// console.log(window)
// console.log(window.ethereum)
// console.log('web3', web3)