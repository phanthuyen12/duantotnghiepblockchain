'use strict';

const { Contract } = require('fabric-contract-api');

class StudentContract extends Contract {

    async initLedger(ctx) {
        console.info('Initializing the ledger');
        const students = [
            {
                id: '1',
                name: 'Alice',
                email: 'alice@example.com',
            },
            {
                id: '2',
                name: 'Bob',
                email: 'bob@example.com',
            },
        ];

        for (let i = 0; i < students.length; i++) {
            students[i].docType = 'student';
            await ctx.stub.putState('STUDENT' + i, Buffer.from(JSON.stringify(students[i])));
            console.info('Added <--> ', students[i]);
        }
        console.info('Ledger initialized');
    }

    async createStudent(ctx, id, name, email) {
        console.info('Creating a student');
        const student = {
            id,
            name,
            email,
            docType: 'student',
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(student)));
        console.info('Student created');
    }

    async queryStudent(ctx, id) {
        const studentAsBytes = await ctx.stub.getState(id);
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`Student with ID ${id} does not exist`);
        }
        return studentAsBytes.toString();
    }

    async queryAllStudents(ctx) {
        const startKey = '';
        const endKey = '';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                jsonRes.Key = res.value.key;
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                allResults.push(jsonRes);
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }
}

module.exports = StudentContract;
