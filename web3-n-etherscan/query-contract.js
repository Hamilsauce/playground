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

const UserModel = {
  wallet: String,
  orders: {
    order: {
      id: String,
      tokenId: String,
      jerseySize: String,
      shipping: 'ShippingAddress',
    },
  },
  mi777: {
    tokens: {},
    balance: Number,
  },
}

const JAKE_03 = '0x03Fc7F4a35451856CA4386C7b170003EB5c59ED5';

const exUrl2 = 'https://api.etherscan.io/api?module=account&action=addresstokennftinventory&address=0x123432244443b54409430979df8333f9308a6040&contractaddress=0xed5af388653567af2f388e6224dc7c4b3241c544&page=1&offset=100&apikey=G53PIHUXWBH8236CNV2V87VDC1ET7JHIZ8'

const outputEl = document.querySelector('pre');

const fetchAbi = async (url = './pixellady-abi.json') => JSON.parse((await (await fetch(url)).json()).result);

const buildTokenHoldingQuery = (wallet, token, apiNetwork = MAINNET_BASE) => {
  return `${apiNetwork}/api?module=account&action=addresstokennftinventory&address=${wallet}&contractaddress=${token}&page=1&offset=100&apikey=${ETHERSCAN_APIKEY}`;
};

const createMi777User = async (wallet, token) => {
  const ENDPOINT = buildTokenHoldingQuery(wallet, token, MAINNET_BASE)

  const tokens = (await (await fetch(ENDPOINT)).json())

  const user = {
    wallet,
    mi777Balance,
    tokens: (await (await fetch(ENDPOINT)).json())
  }

  outputEl.innerHTML = JSON.stringify(data, null, 2);
};

const renderData = (data) => {
  outputEl.innerHTML = JSON.stringify(data, null, 2);
};


const ENDPOINT = buildTokenHoldingQuery(JAKE_03, PIXELLADY_ADDRESS, MAINNET_BASE)

// document.querySelector('pre').append(ENDPOINT);
renderData(await (await fetch(ENDPOINT)).json())


const web3 = new Web3(INFURA_MAIN).eth
const pxlAbi = await fetchAbi();
const pixelLady = new web3.Contract(pxlAbi, PIXELLADY_ADDRESS, );
console.log('web3', web3)
pixelLady.defaultAccount = IAN_WALLET

// const Web3Eth = require("web3-eth");
const URL = INFURA_MAIN;
// const web3Eth = new web3(web3.givenProvider || URL);
const smartContractAddress = PIXELLADY_ADDRESS;
const contract = new web3.Contract(pxlAbi, smartContractAddress);

contract.methods.totalSupply().call((err, result) => { console.log('totalSupply', result) })
contract.methods.name().call((err, result) => { console.log('name', result) })
contract.methods.symbol().call((err, result) => { console.log('symbol', result) })
contract.methods.balanceOf(JAKE_03).call((err, result) => { console.log('balanceOf', result) })
contract.getPastEvents('Transfer', {
  fromBlock: 7600,
  toBlock: 7800,
}, ).then((err, result) => { console.log('GETPASTEVENTS', { err, result }) })


console.log('tsup', contract.methods.totalSupply())

// const tsup = contract.totalSupply();
async function fetchTokens() {
  console.log('IN FETCH TOKEBS');
  return contract.getPastEvents(
    "Transfer",
    {
      fromBlock: 0,
      toBlock: 200,
    },
    function(error, events) {
      console.log('IN FETCH TOKEBS > GET PAST RVR');

      console.warn({ error })
      console.warn({ events })
      if (!error) {
        for (var i = 0; i < events.length; i++) {
          console.warn(events[i].returnValues.tokenId);
        }
      }
    }
  );
}
fetchTokens();