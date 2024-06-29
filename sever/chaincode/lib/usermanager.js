// File: userManagement.js

const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');

class UserManagementContract extends Contract {

    // Initialize the ledger with admin users of each organization
    async initLedger(ctx) {
        console.log('Initializing the ledger with admin users...');
        const organizations = ['Org1', 'Org2', 'Org3']; // Replace with your organization names
        for (let org of organizations) {
            await this.createUser(ctx, org, 'admin', 'adminpassword', true);
        }
    }

    // Create a new user for an organization and return a token
    async createUser(ctx, organization, username, password, isAdmin = false) {
        console.log(`Creating user ${username} for organization ${organization}...`);
        
        // Generate a random token
        const token = crypto.randomBytes(16).toString('hex');

        const user = {
            username: username,
            password: password,
            isAdmin: isAdmin,
            token: token  // Save the token with user details
        };

        await ctx.stub.putState(`${organization}_${username}`, Buffer.from(JSON.stringify(user)));
        return token;  // Return the token
    }

    // Get user details by token
    async getUserByToken(ctx, token) {
        // Iterate through all users to find the one with matching token
        const iterator = await ctx.stub.getStateByRange('', '');
        let user = null;
        let found = false;

        while (!found) {
            const result = await iterator.next();
            if (result.value && result.value.value.toString()) {
                const userObj = JSON.parse(result.value.value.toString());
                if (userObj.token === token) {
                    user = userObj;
                    found = true;
                }
            }
            if (result.done) {
                await iterator.close();
                break;
            }
        }

        if (!user) {
            throw new Error(`User with token ${token} does not exist`);
        }
        
        return JSON.stringify(user);
    }
}

module.exports = UserManagementContract;
