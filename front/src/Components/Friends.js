import React, { Component } from 'react';
import axios from 'axios';
import AuthService from './AuthService';
import withAuth from './withAuth';

class Friend extends Component {
    checkFriends = () => {
        switch(this.props.flag) {
            case 'friend':
                    return (
                    <div>
                        <button className="btn btn-danger" onClick={() => this.props.handleRemoveFriend(this.props.friend)}>Remove</button>
                        <button className="btn btn-primary" onClick={() => this.props.handleProfileFriend(this.props.friend)}>Profile</button>
                    </div>
                        )
            case 'request':
                return (
                    <div>
                    <button className="btn btn-success" 
                        onClick={() => this.props.handleRequestFriend(this.props.friend, 1)}>Confirm</button>
                    <button className="btn btn-danger" 
                        onClick={() => this.props.handleRequestFriend(this.props.friend, 0)}>Deny</button>
                    </div>
                )
            case 'requested':
                return (<button className="btn btn-warning" onClick={() => this.props.handleWithdrawFriend(this.props.friend)}>Cancel</button>)
            case 'other':
                return (
                    <button className="btn btn-primary" 
                        onClick={() => this.props.handleAddFriend(this.props.friend._id)}>Add</button>
                )
            default:
                return 1
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
            requested: [],
            requests: [],
            others: []
        }
    }

    componentWillMount() {
        axios.post('http://127.0.0.1:5000/api/friends', null, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               requested: res.data.requested,
                               requests: res.data.requests,
                               others: res.data.others
                            });
            }
        })
    }

    handleAddFriend = (id) => {
        console.log(id)
        axios.post('http://127.0.0.1:5000/api/friends/add', {id:id}, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               requested: res.data.requested,
                               requests: res.data.requests,
                               others: res.data.others
                });
            }
        })
    }

    handleRequestFriend = (friend, reqStatus) => {
        axios.post('http://127.0.0.1:5000/api/friends/confirm', {friend:friend, confirm: reqStatus}, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               requested: res.data.requested,
                               requests: res.data.requests,
                               others: res.data.others
                });
            }
        })
    }

    handleRemoveFriend = (friend) => {
        axios.post('http://127.0.0.1:5000/api/friends/remove', {friend: friend}, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               requested: res.data.requested,
                               requests: res.data.requests,
                               others: res.data.others
                });
            }
        })
    }

    handleWithdrawFriend = (friend) => {
        axios.post('http://127.0.0.1:5000/api/friends/withdraw', {friend: friend}, {headers: {'Authorization': this.Auth.getToken()}})
        .then((res) => {
            console.log(res.data)
            if (res.data.status === 'success') {
                this.setState({friends: res.data.friends,
                               requested: res.data.requested,
                               requests: res.data.requests,
                               others: res.data.others
                });
            }
        })
    }

    handleProfileFriend = (friend) => {
        console.log('made it')
        this.props.history.replace({pathname: '/friends/discs', state: {friend: friend} })
    }


    showFriends = () => {
        const handleRemoveFriend = this.handleRemoveFriend;
        const handleProfileFriend = this.handleProfileFriend;
        return this.state.friends.map(function(friend, i) {
            return <Friend friend={friend} key={i} flag='friend' handleRemoveFriend={handleRemoveFriend} handleProfileFriend={handleProfileFriend} />
        })
    }

    showRequests = () => {
        const handleRequestFriend = this.handleRequestFriend;
        return this.state.requests.map(function(friend, i) {
            return <Friend friend={friend} key={i} flag='request' handleRequestFriend={handleRequestFriend}/>
        })
    }

    showRequested = () => {
        const handleWithdrawFriend = this.handleWithdrawFriend;
        return this.state.requested.map(function(friend, i) {
            return <Friend friend={friend} key={i} flag='requested' handleWithdrawFriend={handleWithdrawFriend} />
        })
    }

    showOthers = () => {
        const handleAddFriend = this.handleAddFriend
        return this.state.others.map(function(friend, i) {
            return <Friend friend={friend} key={i} flag='other' handleAddFriend={handleAddFriend}/>
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
                <h2>Requests</h2>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Number of Discs</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.showRequests()}
                    </tbody>
                </table>
                <h2>Requested</h2>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Number of Discs</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.showRequested()}
                    </tbody>
                </table>
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