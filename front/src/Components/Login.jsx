import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: '',
            errors: []
        };
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit = (e) => {
        e.preventDefault();
        const {email, password} = this.state;
        axios.post('http://localhost:5000/api/login', {email, password})
            .then((result) => console.log(result))
    }
    displayError = (e) => {
        for (let i=0;i<this.errors.length; i++) {
            console.log(this.errors[i])
        }
    }
    render() {
        const { email, password} = this.state;
        return (
            <div className="container">
                <form className="form-group" onSubmit={this.onSubmit}>
                    <label for="email">Email:</label>
                    <input className="form-control" name="email" type="text" required value={email} onChange={this.onChange} />
                    <label for="password">Password:</label>
                    <input className="form-control" type="password" name="password" value={password} onChange={this.onChange} />
                    <button className="btn btn-primary ml-auto" type="submit">Submit</button>
                </form>
                {this.displayError}
            </div>
        );
    }
}

export default Login;