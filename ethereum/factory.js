import web3 from "./web3"; //import instance of web3 from ./web file
import CampaignFactory from "./compiled/CampaignFactory.json";
const instance= new web3.eth.Contract(
    CampaignFactory.abi,
    "0xBcBB894E9278f87a3b68cC9b1D9435405973c57A"
);

export default instance;
