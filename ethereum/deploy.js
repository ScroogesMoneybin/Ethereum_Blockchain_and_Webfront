const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./compiled/CampaignFactory.json');

const provider = new HDWalletProvider(

  'express keep oppose paper typical apology lyrics cup distance goddess garment chef',
  'https://rinkeby.infura.io/v3/49f0969f9d9a49f7adafd73089ce0fa5'
  
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object})
    .send({ gas: '1400000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();