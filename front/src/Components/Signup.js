import React, { Component } from 'react';
import AuthService from './AuthService';

export default class Signup extends Component {
    Auth = new AuthService();
    constructor(props) {
        super(props);
        console.log('props'+props)
        this.state = {
            email: '',
            username: '',
            password: '',
            password_confirm: '',
            error: '',
            token: ''
        };
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit = (e) => {
        e.preventDefault();
            this.Auth.signup(this.state.email, this.state.username, this.state.password)
            .then(res => {
                console.log(res)
                if (res.status === 'failed') {
                    return this.setState({ error: res.error})
                }
                this.props.history.replace({pathname:'/', state: {auth:true}});
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
        const { email, password, password_confirm, username} = this.state;
        return (
            <div className="container">
                <form className="form-group" onSubmit={this.onSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input className="form-control" name="email" type="text" required value={email} onChange={this.onChange} />
                    <label htmlFor="email">Username:</label>
                    <input className="form-control" name="username" type="text" required value={username} onChange={this.onChange} />
                    <label htmlFor="password">Password:</label>
                    <input className="form-control" type="password" name="password" value={password} onChange={this.onChange} />
                    <label htmlFor="password">Confirm Password:</label>
                    <input className="form-control" type="password" name="password_confirm" value={password_confirm} onChange={this.onChange} />
                    <button className="btn btn-primary ml-auto" type="submit">Submit</button>
                </form>
                {this.displayError()}
            </div>
        );
    }
}