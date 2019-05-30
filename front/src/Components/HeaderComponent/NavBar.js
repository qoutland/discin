import React, { Component } from 'react';
import AuthService from '../AuthService';
//import withAuth from './withAuth';

export default class NavBar extends Component {

    constructor(props) {
        super(props);
        //console.log(props)
        this.Auth = new AuthService();
        this.state = {
            auth: props.auth
        }
    }

    handleLogout = () => {
        this.Auth.logout()
        this.props.history.replace('/login');
    }

    navItems = () => {
        if (this.props.auth) {
            return (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a className="nav-link" href="/profile">Profile</a>
                </li>
                <li className="nav-item">
                    <button className="nav-link" href="#" onClick={this.handleLogout} style={{ backgroundColor: 'transparent', border: 'transparent'}}>Logout</button>
                </li>
            </ul>
            )
        } else {
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="/login">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/signup">SignUp</a>
                    </li>
                </ul>
            )
        }
    }

    handleLogout = () => {
        this.Auth.logout();
        // /this.props.history.replace('/login');
    }

    componentDidMount() {
        this.setState({auth: this.Auth.loggedIn()})
        //console.log('Updated')
    }

    render() {
        //console.log('Component Auth: ' + this.state.auth)
        return (
            <header>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">Discin</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {this.navItems()}
                    </div>
                </nav>
            </header>
        )
    }
}