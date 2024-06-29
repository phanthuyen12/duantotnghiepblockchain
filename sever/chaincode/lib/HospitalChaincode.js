'use strict'
const { Contract} = require('fabric-contract-api');

class HospitalContract extends Contract{
    async initLedger(ctx){
        console.log(' đấy là giá trị mẫu ');
        
    }
}