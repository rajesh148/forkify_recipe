// export default 'I am an exported string.';

import axios from 'axios';

import {proxy , service} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        // const proxy = 'https://cors-anywhere.herokuapp.com/';
        // const service = 'https://forkify-api.herokuapp.com/api/search?q=';
        try{
            const res = await axios(`${proxy}${service}${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        }catch(error){
            alert(error);
        }
    }


}