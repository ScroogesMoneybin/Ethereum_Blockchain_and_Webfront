import web3 from "./web3"; //import instance of web3 from ./web file
import Campaign from "./compiled/Campaign.json";

const campaignFunction= (address)=> {
    return new web3.eth.Contract(Campaign.abi, address)};

export default campaignFunction;