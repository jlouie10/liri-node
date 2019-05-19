const axios = require('axios');

// GET request using Axios 
let axiosGet = (url, callback, params) => {
    axios.get(url)
        .then(function (response) {
            callback(response, params);
        })
        .catch(function (error) {
            console.log('\nLiri could not complete your request. ' + error + '\n');
        });
};

module.exports = {
    axiosGet: axiosGet
};