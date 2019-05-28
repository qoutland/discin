import React, { Component } from 'react';
import AuthService from './AuthService';

/* A higher order component is frequently written as a function that returns a class. */
export default function withAuth(AuthComponent) {
    
    const Auth = new AuthService('http://localhost:5000/api');

    return class AuthWrapped extends Component {
        constructor(props) {
            super(props);
            
            this.state = {
                user: null
            }
        }

        /* In the componentDidMount, we would want to do a couple of important tasks in order to verify the current users authentication status
        prior to granting them enterance into the app. */
        componentWillMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace({pathname: '/login', state: {redirectTo: this.props.location.pathname} })
            }
            else {
                /* Try to get confirmation message from the Auth helper. */
                try {
                    const profile = Auth.getProfile()
                    //console.log("confirmation is:", profile);
                    this.setState({
                        user: profile
                    })
                }
                /* Oh snap! Looks like there's an error so we'll print it out and log the user out for security reasons. */
                catch (err) {
                    console.log(err);
                    Auth.logout()
                    this.props.history.replace('/login');
                }
            }
        }

        render() {
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} />
                )
            } else {
                    return null
            }
        }
    }
}