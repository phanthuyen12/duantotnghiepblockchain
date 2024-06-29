const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '..', '..', 'network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function connectToNetwork() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'user2', // Thay đổi từ 'user1' thành 'user2'
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('student');

    return { contract, gateway };
}

exports.addStudent = async (req, res) => {
    const { id, name, email } = req.body;
    console.log(req.body);
    try {
        const { contract, gateway } = await connectToNetwork();
        await contract.submitTransaction('createStudent', id, name, email);
        await gateway.disconnect();
        res.status(200).send('Student has been added');
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send('Failed to add student');
    }
};

exports.getStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const { contract, gateway } = await connectToNetwork();
        const result = await contract.evaluateTransaction('queryStudent', id);
        await gateway.disconnect();
        if (!result || result.length === 0) {
            res.status(404).json({ error: `Student with id ${id} not found` });
        } else {
            res.status(200).json(JSON.parse(result.toString()));
        }
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).send('Failed to get student');
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const { contract, gateway } = await connectToNetwork();
        const result = await contract.evaluateTransaction('queryAllStudents');
        await gateway.disconnect();
        res.status(200).json(JSON.parse(result.toString()));
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).send('Failed to get all students');
    }
};