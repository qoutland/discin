import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';
import AuthService from './AuthService';
import withAuth from './withAuth';
import _ from 'underscore';
import DatePicker from 'react-date-picker';

class EditDisc extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        this.state = {
            brand: '',
            name: '',
            color: '',
            weight: '',
            type: '',
            speed: '',
            glide: '',
            turn: '',
            fade: '',
            purchase_date: '',
            error: ''
        }
    }
    onChange = e => {this.setState({[e.target.name]: e.target.value });}
    onSubmit = e => {
        e.preventDefault();
        
        const newDisc = {
            brand: this.state.brand,
            name: this.state.name,
            color: this.state.color,
            weight: this.state.weight,
            type: this.state.type,
            speed: this.state.speed,
            glide: this.state.glide,
            turn: this.state.turn,
            fade: this.state.fade,
            purchase_date: this.state.purchase_date
        }
        axios.post('http://localhost:5000/api/disc/'+ this.props.location.state.disc._id+'/update', newDisc, {headers: {'Authorization': this.Auth.getToken()}})
        .then(res => {
            if (res.status === 'failed') {
                return this.setState({error: res.error})
            }
            this.props.history.replace('/');
        })
    }

    DateonChange = date => {this.setState({purchase_date: date})}

    componentWillMount() {
        console.log('props below: ')
        console.log(this)
        if (this.props.location.state) {
            axios.post('http://localhost:5000/api/disc/'+ this.props.location.state.disc._id, null, {headers: {'Authorization': this.Auth.getToken()}})
            .then((res) => {
                console.log(res.data)
                if (res.data.status === 'success') {
                    console.log('got disc')
                    this.setState({
                        brand: res.data.disc.brand,
                        name: res.data.disc.name,
                        color: res.data.disc.color,
                        weight: res.data.disc.weight,
                        type: res.data.disc.type,
                        speed: res.data.disc.speed,
                        glide: res.data.disc.glide,
                        turn: res.data.disc.turn,
                        fade: res.data.disc.fade,
                        purchase_date: res.data.disc.purchase_date
                    })
                }
            })
        } else {
            this.props.history.replace('/');
        }
    }

    createOptions = (min, max) => {
        return _.range(min,max+1).map(function(val, i){
            return <option value={val} key={i}>{val}</option>
        })
    }

    render() {
        return (
            <div className="container">
            <form className="form-group" onSubmit={this.onSubmit}>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label htmlFor="brand">Brand:</label>
                        <input className="form-control" name="brand" value={this.state.brand} onChange={this.onChange} type="text" required />
                    </div>
                    <div class="form-group col-md-6">
                        <label htmlFor="name">Name:</label>
                        <input className="form-control" name="name" value={this.state.name} onChange={this.onChange} type="text" required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-5">
                        <label htmlFor="color">Color:</label>
                        <input className="form-control" name="color" value={this.state.color} onChange={this.onChange} type="text" required />
                    </div>
                    <div class="form-group col-md-4">
                        <label htmlFor="weight">Weight:</label>
                        <input className="form-control" name="weight" value={this.state.weight} onChange={this.onChange} type="text" required />
                    </div>
                    <div class="form-group col-md-3">
                        <label htmlFor="type">Type:</label>
                        <select className="form-control" placeholder="Select Type" name="type" required value={this.state.type} onChange={this.onChange}>
                        <option value="Distance Driver">Distance Driver</option>
                        <option value="Fairway Driver">Fairway Driver</option>
                        <option value="Mid-Range">Mid-Range</option>
                        <option value="Putter">Putter</option>
                    </select>
                    </div>
                </div>
                    <div class="form-row">
                    <div class="form-group col-md-3">
                    <label htmlFor="speed">Speed:</label>
                    <select className="form-control" name="speed" value={this.state.speed} onChange={this.onChange} required >
                        <option value="" disabled>Speed...</option>
                        {this.createOptions(1,13)}
                    </select>
                    </div>
                    <div class="form-group col-md-3">
                    <label htmlFor="glide">Glide:</label>
                    <select className="form-control" name="glide" value={this.state.glide} onChange={this.onChange} required>
                        <option value="" disabled>Glide...</option>
                        {this.createOptions(1,7)}
                    </select>
                    </div>
                    <div class="form-group col-md-3">
                    <label htmlFor="turn">Turn:</label>
                    <select className="form-control" name="turn" value={this.state.turn} onChange={this.onChange} required>
                        <option value="" disabled>Turn...</option>
                        {this.createOptions(-5,1)}
                    </select>
                    </div>
                    <div class="form-group col-md-3">
                    <label htmlFor="fade">Fade:</label>
                    <select className="form-control" name="fade" value={this.state.fade} onChange={this.onChange} required>
                        <option value="" disabled>Fade...</option>
                        {this.createOptions(0,6)}
                    </select>
                    </div>
                    </div>
                    <br />
                    <label htmlFor="purchase_date">Purchase Date:&nbsp;</label>
                    <DatePicker name="purchase_date" value={this.state.purchase_date} onChange={this.DateonChange} />
                <br />
                <button className="btn btn-warning" type="submit">Edit Disc</button>
            </form>
            </div>
        )
    }
}

export default withAuth(withRouter(EditDisc));