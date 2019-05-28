import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from './AuthService';
import axios from 'axios';
import Moment from 'react-moment';
import withAuth from './withAuth';

class Disc extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.disc._id}</td>
                <td>{this.props.disc.name}</td>
                <td>{this.props.disc.color}</td>
                <td>{this.props.disc.weight}</td>
                <td>{this.props.disc.type}</td>
                <td>{this.props.disc.speed}</td>
                <td>{this.props.disc.glide}</td>
                <td>{this.props.disc.turn}</td>
                <td>{this.props.disc.fade}</td>
                <td><Moment format="MM/DD/YYYY">{this.props.disc.purchase_date}</Moment></td>
                <td><button className="btn btn-warning" onClick={() => this.props.handleEdit(this.props.disc)}>Edit</button></td>
                <td><button className="btn btn-danger" onClick={() => this.props.handleDelete(this.props.disc._id)}>Delete</button></td>
            </tr>
        )
    }
}


class ListDisc extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this)
        this.state = {
            discs: []
        }
    }
    componentDidMount() {
        axios.post('http://localhost:5000/api/disc/', null, {headers: {'Authorization': this.Auth.getToken()}})
        .then(res => this.setState({discs: res.data}))
    }

    handleEdit(disc) {
        console.log(disc)
        this.props.history.replace({pathname: '/edit', state: {disc: disc, something: 'something'} })
    }

    handleDelete(id) {
        axios.post('http://127.0.0.1:5000/api/disc/'+id+'/delete', null, {headers: {'Authorization': this.Auth.getToken()}})
        .then(() =>  axios.post('http://localhost:5000/api/disc/', null, {headers: {'Authorization': this.Auth.getToken()}})
            .then(res => this.setState({discs: res.data}))
        )
    }

    showDiscs = () => {
        var handleEdit = this.handleEdit;
        var handleDelete = this.handleDelete;
        return this.state.discs.map(function(disc, i) {
            return <Disc disc={disc} key={i} handleEdit={handleEdit} handleDelete={handleDelete}/>
        })
    }
    render() {
        return(
            <div className="container">
            <br />
            <Link to="/add" className="btn btn-success" style={{marginBottom: 10}}>Add Disc</Link>
            <Link to="/friends" className="btn btn-primary ml-auto" style={{marginBottom: 10}}>Friends</Link>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Weight</th>
                        <th>Type</th>
                        <th>Speed</th>
                        <th>Glide</th>
                        <th>Turn</th>
                        <th>Fade</th>
                        <th>Date purchased</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.showDiscs()}
                </tbody>
            </table>
            </div>
        )
    }
}

export default withAuth(ListDisc);