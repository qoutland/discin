import React, { Component } from 'react';
import axios from 'axios';
import AuthService from './AuthService';
import withAuth from './withAuth';
import _ from 'underscore';
import DatePicker from 'react-date-picker';

class AddDisc extends Component {
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
            purchase_date: this.state.purchase_date ? this.state.purchase_date : Date.now()
        }
        axios.post('http://localhost:5000/api/disc/create', newDisc, {headers: {'Authorization': this.Auth.getToken()}})
        .then(res => {
            console.log(res)
            if (res.data.status === 'failed') {
                return this.setState({error: res.data.error})
            }
            this.props.history.replace('/');
        })
    }

    DateonChange = date => {this.setState({purchase_date: date})}

    createOptions = (min, max) => {
        return _.range(min,max+1).map(function(val, i){
            return <option value={val} key={i}>{val}</option>
        })
    }

    displayError() {
        console.log('made it to error')
        return <p>{this.state.error}</p> 
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
                            <option value="" disabled>Type...</option>
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
                    <button className="btn btn-primary" type="submit">Add Disc</button>
                </form>
                    {this.displayError()}
                </div>
        )
    }
}

export default withAuth(AddDisc);