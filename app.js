const pmpt = require("prompt-sync")();
const io = require('./src/utility/InputOutputMethods');
const dao = require('./src/utility/DAOOperations');

const ioMethods = new io.IOMethods();
const daoOperations = new dao.DAOOperations();

console.log(`\n**** Welcome To Hotel Management System ****\n`);

let flag = true;
while (flag) {
    const userResponse = pmpt(`Are You Register User (Y/N) : `);

    if (userResponse.toLowerCase() === 'n') {
        const userDetails = ioMethods.registerUser();
        daoOperations.writeDataInFile('./json/userRegister.json', userDetails);
        daoOperations.loginUserToSystem();
        flag = false;
    }
    else if (userResponse.toLowerCase() === 'y') {
        daoOperations.loginUserToSystem();
        flag = false;
    }
    else {
        console.log(`\nIncorrect Input....Enter Y / N`);
        flag = true;
    }
}
