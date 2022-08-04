import React,{Component} from "react";
import Layout from "../../components/layout";
import campaignFunction from "../../ethereum/campaign";
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from "../../ethereum/web3"
import ContributionForm from "../../components/ContributionForm";
import {Link} from "../../routes"

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign=campaignFunction(props.query.address);
        const summary=await campaign.methods.getSummary().call();
        
        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: props.query.address
        };
    }
    
    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        }=this.props;

        const items=[{
            header: "Manager's Address",
            meta: manager,
            description: "Manager created campaign and can make monetary requests.",
            style:{overflowWrap:"break-word"}
        },
        {
            header: "Minimum Contribution (Wei)",
            meta: minimumContribution,
            description: "Minimum contribution amount in Wei to participate and become an approver.",
            style:{overflowWrap:"break-word"}
        },
        {
            header: "Number of Requests",
            meta: requestsCount,
            description: "A request tries to withdraw funds from contract to pay for the project's needs. Request must be approved by approvers.",
            style:{overflowWrap:"break-word"}
        },
        {
            header: "Number of Contributors",
            meta: approversCount,
            description: "Number of people who have already donated to this campaign.",
            style:{overflowWrap:"break-word"}
        },
        {
            header: "Campaign Balance in Ether",
            meta: web3.utils.fromWei(balance,"ether"),
            description: "Total campaign balance left to spend (in Ether).",
            style:{overflowWrap:"break-word"}
        }
        ];
        return <Card.Group items={items}/>
    }

    render() {
        return (
        <Layout>
            <h3>Show</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {this.renderCards()}
                        
                    </Grid.Column>
                
                
                    <Grid.Column width={6}>
                        <ContributionForm address={this.props.address}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link route={`/campaigns/${this.props.address}/requests`}>
                            <a>
                                <Button primary>
                                    View Requests
                                </Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        </Layout>
    );}
}
export default CampaignShow;