const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const compiledFactory=require('../ethereum/compiled/CampaignFactory.json');
const compiledCampaign=require('../ethereum/compiled/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts=await web3.eth.getAccounts();
    factory=await new web3.eth.Contract(compiledFactory.abi)
    .deploy({data: compiledFactory.evm.bytecode.object}).send({from:accounts[0],gas:"1400000"});
    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas:'1000000'
    });
    const addresses=await factory.methods.getDeployedCampaigns().call();
    campaignAddress=addresses[0];
    campaign=await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),campaignAddress
        //citing address of contract we just deployed
        //Already deployed, so we don't include .deploy or .send
    );
})

describe('Campaigns',()=>{
    it('deploys a factory and campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('identifies caller of function as campaign manager',async ()=>{
        const manager=await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });
    it('allows contributions and marks contributers as approvers',async ()=>{
        await campaign.methods.contribute().send({
            value:'101',
            from:accounts[1]
        });
        const isContributor=await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });
    it('requires a minimum contribution',async ()=>{
        try{
            await campaign.methods.contribute().send({
                value:'99',
                from:accounts[2]
            });
            assert(false);
        }
        catch(err) {
            assert(err);

        }
    });
    it('allows a manager to make a payment request',async ()=>{
        await campaign.methods.createRequest("Buy batteries",'100',accounts[3]).send({
            from:accounts[0],
            gas:'1000000'
        });
        const request=await campaign.methods.requests(0).call();
        assert.equal('Buy batteries',request.description);
    });
    it('processes requests',async ()=>{
        await campaign.methods.contribute().send({
            from:accounts[0],
            value:web3.utils.toWei('10','ether')
        });
        await campaign.methods.createRequest("A",web3.utils.toWei('5','ether'),accounts[1]).send({
            from:accounts[0],
            gas:'1000000'
        });
        await campaign.methods.approveRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });
        await campaign.methods.finalizeRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });
        let balance = await web3.eth.getBalance(accounts[1]);
        balance=web3.utils.fromWei(balance,'ether');
        balance=parseFloat(balance);
        console.log(balance);
        assert(balance>103);
    });
});