import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import ethScan, { BalanceMap } from '@mycrypto/eth-scan';
import Web3 from "web3";

const IAN_WALLET = '0x587376ed782a73966c1b9d9a00635613a6e539dd';
const CONTRACT_ADDRESS = '0x8Fc0D90f2C45a5e7f94904075c952e0943CFCCfd';

const app = express();

app.use(cors({ origin: true }));
app.set('Access-Control-Allow-Origin', '*');

const web3 = new(Web3 as any)(
  'https://mainnet.infura.io/v3/a9762c27cfd24cafa37eb38c1ab9b4e1'
);

app.get('/:wallet', async (req, res) => {
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', 'GET, POST');

  if (req.method === "OPTIONS") { // stop preflight requests here
    res.status(204).send('');

    return;
  }

  const wallet = req.params.wallet as string;

  try {
    const balanceResponse: BalanceMap < bigint > = await ethScan
      .getTokensBalance(
        web3,
        wallet,
        [CONTRACT_ADDRESS]
      );
    console.log(balanceResponse);

    const entries = Object.entries(balanceResponse).map(([key, value]) => {
      return {
        contract: key,
        balance: +value.toString()
      };
    });

    res.status(200).send(entries[0]);
  } catch (error) {
    res.status(400).send('ERROR GETTING BALANCE FOR WALLET ' + IAN_WALLET);
  }

});

export const getMiladyBalance = functions.https.onRequest(app);