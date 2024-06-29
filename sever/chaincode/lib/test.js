const { Contract } = require('fabric-contract-api');

class TestContract extends Contract {
    async instantiate(ctx) {
        console.log('Chaincode instantiation');
    }

    async createHospital(ctx, hospitalId, name, location) {
        let hospital = {
            id: hospitalId,
            name: name,
            location: location,
            clinics: []
        };

        await ctx.stub.putState(hospitalId, Buffer.from(JSON.stringify(hospital)));
        return JSON.stringify(hospital);
    }
    async getHospital(ctx,hospitalId){
        let hospitaAsBytes = await ctx.stub.getState(hospitalId);
        if(!hospitaAsBytes || hospitaAsBytes.length === 0){
            throw new error('không nhận được giá trị ');

        }
        return hospitaAsBytes.tostring();
    }
}

module.exports = TestContract;
