const pt = require("prompt-sync")();
const user = require('./UserDetails');

const userDetailsObj = new user.UserDetails();

class InputOutputMethods {

    generateKeyForUser(firstName, userMobile) {
        const userKey = firstName.substring(0, 4) + userMobile.substring(0, 4);
        return userKey;
    }

    registerUser() {
        console.log(`\n**** Hotel Management System ****`);
        console.log(`\n**** Registration ****\n`);
        userDetailsObj.setFirstName = pt(`Enter First Name : `);
        userDetailsObj.setLastName = pt(`Enter Last Name : `);
        userDetailsObj.setUserGender = pt('Enter Gender : ')
        userDetailsObj.setUserMobNo = pt('Enter Mobile Number : ');
        const userKey = this.generateKeyForUser(userDetailsObj.getFirstName, userDetailsObj.getUserMobNo);
        userDetailsObj.setUserID = userKey;
        console.log(`\nRegistration Is Sucessfull...!!!`);
        console.log(`Here Is Your UserID For Login : ${userKey}`);
        return userDetailsObj;
    }

    showAdminLoginMenu() {
        let flag = true;
        console.log(`\n**** Hotel Management System ****\n`);
        console.log(`Welcome Admin To Hotel Management System\n`);
        while(flag) {    
            console.log('1. Print Report');
            console.log(`2. Logout`);
            const adminChoice = + pt(`Enter 1 / 2 : `);
            if (adminChoice > 0 && adminChoice < 3) {
                flag = false;
                return adminChoice;
            }
            else {
                console.log('Incorrect Option...Enter Only 1 / 2');
            }
        }
        return null;
    }

    showLoginOptions() {
        let flag = true;
        let userLoginId = 0;
        let loginChoice = 0;
        while (flag) {
            console.log(`\n**** Hotel Management System ****\n\n 1. Admin Login \n 2. User Login\n`);
            loginChoice = pt(`Enter Login Type (1/2) : `);
            switch (loginChoice) {
                case "1":
                    console.log(`\n**** Admin Login ****\n`);
                    userLoginId = pt(`Enter Your Key : `);
                    flag = false;
                    break;
                case "2":
                    console.log(`\n**** User Login ****\n`);
                    userLoginId = pt(`Enter Your Key : `);
                    flag = false;
                    break;
                default:
                    console.log(`\nEnter 1 / 2 only`);
                    break;
            }
        }
        return userLoginId;
    }

    userOperationMenu() {
        console.log(`\n1. Order Food`);
        console.log(`2. Order Other Stuff`);
        console.log(`3. Checkout\n`);
    }

    showFoodOrderMenu() {
        let flag = true;
        while (flag) {
            console.log(`\n**** Food Menu ****`);
            console.log(`\n FoodItem        Price`);
            console.log(`\n 1. Tea          Rs.25`);
            console.log(` 2. Breakfast    Rs.150`);
            console.log(` 3. Lunch        Rs.250`);
            console.log(` 4. Dinner       Rs.300\n`);
            const selectedItem =+ pt(`Press 1 - 4 According To FoodItem : `);
            if (selectedItem > 0 && selectedItem < 5) {
                flag = false;
                return selectedItem;
            }
        }
        return null;
    }

    showStuffOrderMenu() {
        let flag = true;
        while (flag) {
            console.log(`\n**** Other Stuff Menu ****`);
            console.log(`\n Item            Price`);
            console.log(`\n 1. Soap         Rs. 40`);
            console.log(` 2. Bedsheet     Rs. 300`);
            console.log(` 3. Blanket      Rs. 400`);
            console.log(` 4. Pillow       Rs. 150\n`);
            const selectedItem = + pt(`Press 1 - 4 According To Item : `);
            if (selectedItem > 0 && selectedItem < 5) {
                flag = false;
                return selectedItem;
            }
        }
        return null;
    }
}

exports.IOMethods = InputOutputMethods;
