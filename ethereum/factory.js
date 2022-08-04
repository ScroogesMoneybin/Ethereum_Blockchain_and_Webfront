import web3 from "./web3"; //import instance of web3 from ./web file
import CampaignFactory from "./compiled/CampaignFactory.json";
const instance= new web3.eth.Contract(
    CampaignFactory.abi,
    "0x10e912c6792B2a57a8c1a16ddf4Ff777b088bF24"
);

export default instance;