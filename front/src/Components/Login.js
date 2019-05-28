import React, { Component } from 'react';
import AuthService from './AuthService';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            email: '',
            password: '',
            error: '',
            token: '',
            redirectTo: ''
        };
    }
    onChange = (e) => { this.setState({ [e.target.name]: e.target.value }); }
    onSubmit = (e) => {
        e.preventDefault();
            this.Auth.login(this.state.email, this.state.password)
            .then(res => {
                console.log(res)
                if (res.status ==='failed') {
                    return this.setState({ error: res.error})
                }
                this.props.history.replace({pathname:this.state.redirectTo ? this.state.redirectTo : '/', state: {auth:true}});
            })
            .catch(err => {
                alert(err);
            })
    }
    displayError() {
        return <p>{this.state.error}</p> 
    }
    componentWillMount() {
        console.log(this.props)
        if (this.props.location.state !== undefined) {
            this.setState({ redirectTo: this.props.location.state.redirectTo});
        }
        console.log('redirect to: ' + this.state.redirectTo)
        if (this.Auth.loggedIn()) { this.props.history.replace('/');}
    }
    render() {
        const { email, password} = this.state;
        return (
            <div className="container">
                <form className="form-group" onSubmit={this.onSubmit}>
                    <label htmlFor="email">Username or Email:</label>
                    <input className="form-control" name="email" type="text" required value={email} onChange={this.onChange} />
                    <label htmlFor="password">Password:</label>
                    <input className="form-control" type="password" name="password" value={password} onChange={this.onChange} />
                    <button className="btn btn-primary ml-auto" type="submit">Submit</button>
                </form>
                {this.displayError()}
            </div>
        );
    }
}