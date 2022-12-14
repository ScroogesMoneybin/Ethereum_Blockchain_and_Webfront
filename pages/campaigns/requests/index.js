import React,{Component} from "react";
import Layout from "../../../components/layout";
import { Button, Table } from 'semantic-ui-react';
import {Link} from "../../../routes";
import campaignFunction from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const {address} = props.query;
        const campaign = campaignFunction(address);
        const requestCount= await campaign.methods.getRequestsCount().call();
        const approversCount= await campaign.methods.approversCount().call();

        const requests=await Promise.all(Array(parseInt(requestCount)).fill().map((element, index)=>{
            return campaign.methods.requests(index).call(); 
        }));
        console.log(requests);
        return {address: address, 
            requests: requests, 
            requestCount: requestCount, 
            approversCount: approversCount
        };
    }

    renderRow() {
        return this.props.requests.map((request,index)=>{
            return <RequestRow key={index} 
            id={index} 
            request={request} 
            address={this.props.address} 
            approversCount={this.props.approversCount}
            />;
        })
    }
    render() {
        
        return (
            <Layout>
            <h3>Request List</h3>
            <Link route={`/campaigns/${this.props.address}/requests/new`}>
                <Button primary floated="right" style={{marginBottom: 10}}>Add Request</Button>
            </Link>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount in Ether</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approval Count</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{this.renderRow()}</Table.Body>
            </Table>
            <div> Found {this.props.requestCount} request(s).</div>
            </Layout>
        )
    }
}

export default RequestIndex;