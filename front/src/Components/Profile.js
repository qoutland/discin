import React, { Component } from 'react';
import axios from 'axios';
import AuthService from './AuthService';
import withAuth from './withAuth';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
    }

    handleLogout = () => {
        this.Auth.logout()
        this.props.history.replace('/login');
    }

    componentDidMount() {
        console.log(this.Auth.getToken())
        axios.post('http://localhost:5000/api/profile', null, {headers: {'Authorization': this.Auth.getToken()}})
        .then(res => console.log(res.data))
    }
    render() {
        console.log(this)
        return (
            <div>
                <br />
                <p>This is your profile</p>
                <button className="btn btn-danger" onClick={this.handleLogout} >Logout</button>
            </div>

        )
    }
}

export default withAuth(Profile);