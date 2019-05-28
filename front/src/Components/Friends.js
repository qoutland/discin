import React, { Component } from 'react';
import axios from 'axios';
import AuthService from './AuthService';
import withAuth from './withAuth';

class Friend extends Component {
    constructor(props) {
        super(props);

        this.state={
            friends: this.props.friends
        }
    }

    checkFriends = () => {
        if(this.state.friends) {
            return (
                <button className="btn btn-primary" 
                    onClick={() => this.props.handleAddFriends(this.props.friend._id)}>Add</button>
            )
        }
        if (this.props.friend.status === 'pending_confirm') {
            return (
                <div>
                <button className="btn btn-success" 
                    onClick={() => this.props.handleRequestFriends(this.props.friend._id, 1)}>Confirm</button>
                <button className="btn btn-danger" 
                    onClick={() => this.props.handleRequestFriends(this.props.friend._id, 0)}>Deny</button>
                </div>
            )
        }
        if (this.props.friend.status === 'pending') {
            return (
                <button className="btn btn-warning">Pending</button>
            )
        }
        if (this.props.friend.status === 'confirmed') {
            return (
                <button className="btn btn-danger" 
                    onClick={() => this.props.handleAddFriends(this.props.friend._id)}>Remove</button>
            )
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.friend.username}</td>
                <td>{this.props.friend.num_discs}</td>
                <td>{this.checkFriends()}</td>
            </tr>
        )
    }
}



class Friends extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            friends: [],
            others: []
        }
    }

    componentWillMount() {
        axios.post('http://127.0.0.1:5000/api/friends', null, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               others: res.data.others
                            });
            }
        })
    }

    handleAddFriends = (id) => {
        axios.post('http://127.0.0.1:5000/api/friends/add', {id:id}, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               others: res.data.others
                            });
            }
        })
    }

    handleRequestFriends = (id, reqStatus) => {
        axios.post('http://127.0.0.1:5000/api/friends/confirm', {id:id, confirm: reqStatus}, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            console.log(res)
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               others: res.data.others
                            });
            }
        })
    }

    showFriends = () => {
        var handleRequestFriends = this.handleRequestFriends;
        return this.state.friends.map(function(friend, i) {
            return <Friend friend={friend} key={i} handleRequestFriends={handleRequestFriends}/>
        })
    }

    showOthers = () => {
        var handleAddFriends  = this.handleAddFriends;
        return this.state.others.map(function(friend, i) {
            return <Friend  friend={friend} key={i} friends="true" handleAddFriends={handleAddFriends}/>
        })
    }

    render() {
        return(
            <div className="container">
                <br />
                <h2>Friends</h2>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Number of Discs</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.showFriends()}
                    </tbody>
                </table>
                <br />
                <h2>Recomended Friends</h2>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Number of Discs</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.showOthers()}
                    </tbody>
                </table>
            </div>
        )
    }

}

export default withAuth(Friends)