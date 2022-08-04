import React,{Component} from "react";
import Layout from "../../components/layout";
import { Input, Form, Button, Message } from 'semantic-ui-react';
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Router} from "../../routes";

class CampaignNew extends Component {
    state={
        minimumContribution: "",
        errorMessage: "",
        loading: false
    };

    onSubmit=async (event)=>{
        event.preventDefault();
        this.setState({loading:true, errorMessage: ""});
        try {
            let accounts=await web3.eth.getAccounts();  //get list of accounts
            await factory.methods.createCampaign(this.state.minimumContribution)
            .send({
                from: accounts[0] //assumes user has at least one account to use to send transaction
            });
            Router.pushRoute("/");
        }
        catch (error) {
            this.setState({errorMessage: error.message})
        }
        this.setState({loading:false});
    }

    render() {
        return (
        <Layout>
            <h3>Create a Campaign</h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                    label="wei" 
                    labelPosition="right"
                    value={this.state.minimumContribution}
                    onChange={event=>this.setState({minimumContribution: event.target.value})}/>
                </Form.Field>
                <Message error header="Uh-oh!" content={this.state.errorMessage}/>
                <Button loading={this.state.loading} primary>Create!</Button>
            </Form>
        </Layout>
        );
    }
}

export default CampaignNew;