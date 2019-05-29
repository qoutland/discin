import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//import HomePage from './Components/HomePage';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Profile from './Components/Profile';
import NavBar from './Components/HeaderComponent/NavBar';
import AuthHelperMethods from './Components/AuthService';
import AddDisc from './Components/AddDisc';
import EditDisc from './Components/EditDisc';
import ListDisc from './Components/ListDisc';
import Friends from './Components/Friends';

class App extends Component {
    Auth = new AuthHelperMethods();
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth
        }
    }
    componentDidMount() {
        this.setState({auth: this.Auth.loggedIn()})
    }
    render() {
        return (
            <Router>
                    <NavBar auth={this.state.auth}/>
                    <Route name="home" exact path="/(|friends/discs)" component={ListDisc} />
                    <Route name="signup" path="/signup" component={Signup} />
                    <Route name="login" path="/login" component={Login} />
                    <Route name="profile" path="/profile" component={Profile} />
                    <Route name="addDisc" path="/add" component={AddDisc} />
                    <Route name="editDisc" path="/edit" component={EditDisc} />
                    <Route name="friends" exact path="/friends" component={Friends} />
            </Router>
         )
    }
}

export default App;