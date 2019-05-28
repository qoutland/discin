import decode from 'jwt-decode';

export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost:5000/api';
    }
    login = (email, password) => {
        return this.fetch(`${this.domain}/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => {
            console.log(res)
            if(res.token){ this.setToken(res.token); }
            return Promise.resolve(res);
        })
    };

    signup = (email, username, password) => {
        return this.fetch(`${this.domain}/signup`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                username,
                password
            })
        }).then(res => {
            console.log(res)
            if(res.token){ this.setToken(res.token); }
            return Promise.resolve(res);
        })
    };
    //Creates a var tken and assignes it tok getToken()
    loggedIn = () => {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    };
    //Check if token is still valid
    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() /1000) {
                return true;
            } else return false;
        }
        catch (err) {
            console.log('expired check failed! Line 33 AuthService.js');
        }
    };

    setToken = idToken => {
        localStorage.setItem('id_token', idToken);
    };

    getToken = () => {
        return localStorage.getItem('id_token');
    };

    logout = () => {
        localStorage.removeItem('id_token');
    }
    //Get saved data that was stored in webtoken
    getConfirm = () => {
        let answer = decode(this.getToken());
        console.log('Recieved answer');
        return answer;
    }

    getProfile = () => {
        return decode((this.getToken()))
    }
    //Sets headers before sending to server
    fetch = (url, options) => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        if (this.loggedIn()){
            headers['Authorization'] = 'Bearer ' + this.getToken();
        }
        return fetch(url, {
            headers,
            ...options
        })
        .then(this._checkStatus)
        .then(res => res.json());
    };

    _checkStatus = res => {
        if (res.status >= 200 && res.status < 300 ) {
            return res;
        } else {
            var error = new Error(res.statusText);
            error.response = res;
            throw error;
        }
    };
}