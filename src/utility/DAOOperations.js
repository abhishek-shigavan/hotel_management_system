const fileSystem = require('fs');
const pt = require("prompt-sync")();
const writeInXlsx = require('xlsx');
const io = require('./InputOutputMethods');
const order = require('./OrderDetails');

const ioMethods = new io.IOMethods();

const orderArray = [];

class DAOOperations {

    getJsonDataObj(filePath) {
        const userRegister = fileSystem.readFileSync(filePath);
        const userRegisterObj = JSON.parse(userRegister);
        return userRegisterObj;
    }

    writeDataInFile(filePath, data) {
        const jsonStringOfData = fileSystem.readFileSync(filePath);
        let tempData;
        if (jsonStringOfData.length === 0) {
            tempData = data;
        }
        else {
            const objOfData = JSON.parse(jsonStringOfData);
            objOfData.push(data);
            tempData = objOfData;
        }

        const dataJsonString = JSON.stringify(tempData, null, 2);
        fileSystem.writeFileSync(filePath, dataJsonString);
    }

    loginUserToSystem() {
        const userKey = ioMethods.showLoginOptions();
        if (userKey === "Admin9876") {
            const adminChoice = ioMethods.showAdminLoginMenu();
            switch (adminChoice) {
                case 1:
                    this.printReportInXlsx();
                    break;
                case 2:
                    console.log('Sucessfully Logged Out From System...!!!');
                    break;
                default:
                    break;
            }
        }
        else {
            const isUserPresent = this.checkUserPresent(userKey);
            if (isUserPresent) {
                const userDetailsObj = this.getUserByKey(userKey);
                this.registerUserOperations(userDetailsObj);
            }
        }
    }

    printReportInXlsx() {
        const reportData = this.getJsonDataObj('./reports/report.json');
        //creating a workbook
        let workBook = writeInXlsx.utils.book_new();
        //creting worksheet
        let workSheet = writeInXlsx.utils.json_to_sheet(reportData);
        writeInXlsx.utils.book_append_sheet(workBook, workSheet, 'UserOrderHistory');
        writeInXlsx.writeFile(workBook, './reports/reportPrint.xlsx');
        console.log(`\nReport Created Sucessfully...!!!`);
    }

    checkUserPresent(userId) {
        let flag = false;
        const userRegisterObj = this.getJsonDataObj('./json/userRegister.json');
        for (let user in userRegisterObj) {
            if (userRegisterObj[user].userID === userId) {
                console.log(`\nLogin Sucessfully...!!!`);
                flag = true;
            }
        }

        if (!flag) {
            console.log(`\nInvalid Key...!!!`);
            this.loginUserToSystem();
        }
        return flag;
    }

    getUserByKey(userId) {
        const userRegisterObj = this.getJsonDataObj('./json/userRegister.json');
        for (let user in userRegisterObj) {
            if (userRegisterObj[user].userID === userId) {
                const userDetailsObj = userRegisterObj[user];
                return userDetailsObj;
            }
        }
        return null;
    }

    registerUserOperations(registerUserDetails) {
        const nameOfUser = registerUserDetails.firstName +" "+ registerUserDetails.lastName;
        let flag = true;
        while (flag) {
            console.log(`\n**** Hotel Management System ****`);
            console.log(`\nWelcome ${nameOfUser}`);
            ioMethods.userOperationMenu();
            const selectedOption = + pt(`Enter Your Option Here (1/2/3) : `);
            let selectedItem;
            if (selectedOption === 1) {
                selectedItem = ioMethods.showFoodOrderMenu();
                this.takeFoodOrder(selectedItem);
            }
            else if (selectedOption === 2) {
                selectedItem = ioMethods.showStuffOrderMenu();
                this.takeStuffOrder(selectedItem);
            }
            else if (selectedOption === 3) {
                const userID = registerUserDetails.userID;
                const orderHistory = this.getOrderArrayInString(orderArray);
                this.generateReport(nameOfUser, userID, orderHistory);
                console.log(`\n **** Bill ****\n`);
                console.log(`Customer Name : ${nameOfUser}\n`);
                this.generateFinalBill(orderArray);
                flag = false;
            }
        }
    }

    getOrderDetailsObj(name, quantity, price, amount) {
        const orderDetailsObj = new order.OrderDetails();
        orderDetailsObj.setItemName = name;
        orderDetailsObj.setItemQuantity = quantity;
        orderDetailsObj.setItemPrice = price;
        orderDetailsObj.setTotalAmount = amount;
        return orderDetailsObj;
    }

    takeFoodOrder(selectedItem) {
        const itemQuantity =+ pt('Enter Quantity : ');
        let totalAmount;
        let gst = 0.18;
        switch (selectedItem) {
            case 1:
                totalAmount = (itemQuantity * 25);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails1 = this.getOrderDetailsObj("Tea", itemQuantity, 25, totalAmount);
                this.generateBill(orderDetails1);
                this.addOrderToOrderArray(orderDetails1);
                break;
            case 2:
                totalAmount = (itemQuantity * 150);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails2 = this.getOrderDetailsObj("Breakfast", itemQuantity, 150, totalAmount);
                this.generateBill(orderDetails2);
                this.addOrderToOrderArray(orderDetails2);
                break;
            case 3:
                totalAmount = (itemQuantity * 250);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails3 = this.getOrderDetailsObj("Lunch", itemQuantity, 250, totalAmount);
                this.generateBill(orderDetails3);
                this.addOrderToOrderArray(orderDetails3);
                break;
            case 4:
                totalAmount = (itemQuantity * 300);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails4 = this.getOrderDetailsObj("Dinner", itemQuantity, 300, totalAmount);
                this.generateBill(orderDetails4);
                this.addOrderToOrderArray(orderDetails4);
                break;
            default :
                break;    
        }
    }

    takeStuffOrder(selectedItem) {
        const itemQuantity =+ pt('Enter Quantity : ');
        let totalAmount;
        let gst = 0.18;
        switch (selectedItem) {
            case 1:
                totalAmount = (itemQuantity * 40);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails1 = this.getOrderDetailsObj("Soap", itemQuantity, 40, totalAmount);
                this.generateBill(orderDetails1);
                this.addOrderToOrderArray(orderDetails1);
                break;
            case 2:
                totalAmount = (itemQuantity * 300);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails2 = this.getOrderDetailsObj("Bedsheet", itemQuantity, 300, totalAmount);
                this.generateBill(orderDetails2);
                this.addOrderToOrderArray(orderDetails2);
                break;
            case 3:
                totalAmount = (itemQuantity * 400);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails3 = this.getOrderDetailsObj("Blanket", itemQuantity, 400, totalAmount);
                this.generateBill(orderDetails3);
                this.addOrderToOrderArray(orderDetails3);
                break;
            case 4:
                totalAmount = (itemQuantity * 150);
                totalAmount = totalAmount + (totalAmount * gst);
                const orderDetails4 = this.getOrderDetailsObj("Pillow", itemQuantity, 150, totalAmount);
                this.generateBill(orderDetails4);
                this.addOrderToOrderArray(orderDetails4);
                break;
        }   
    }

    addOrderToOrderArray(orderObj) {
        let status = true;
        while(status) {
            console.log(`\nTo Confirm Order Enter Y / y & To Cancel Enter N / n`);
            let confirmOrder = pt(`Enter Here : `).toLowerCase();
            if(confirmOrder === 'y') {
                console.log(`Order Placed Sucessfully...!!!`);
                orderArray.push(orderObj);
                status = false;
            }
            else if(confirmOrder === 'n') {
                console.log(`\nGoing Back To Dashboard...!!!`);
                status = false;
            }
        }
    }

    getOrderArrayInString(orderArray) {
        let orderHistory = "";
        let count = 1;
        for(let element in orderArray) {
            const orderDetailsObj = orderArray[element];
            const nameOfItem = orderDetailsObj.itemName;
            const quantityOfItem = orderDetailsObj.itemQuantity;
            const priceOfItem = orderDetailsObj.itemPrice;
            const totalBill = orderDetailsObj.totalAmount;
            orderHistory += count +". "+ "Name Of Item : " +nameOfItem+ ", " +"Quantity : " +quantityOfItem+ ", "+
                            "Price : " +priceOfItem+ ", "+ "TotalAmount : " +totalBill+ " | ";
            count++;                  
        }
        return orderHistory;
    }

    generateReport(nameOfUser, idOfUser, ordersOfUser) {
        const User = {
            NameOfUser: nameOfUser,
            UserID: idOfUser,
            OrdersOfUser: ordersOfUser
        }
        this.writeDataInFile('./reports/report.json', User)
    }

    generateBill(userOrderObj) {
        console.log(`\nItem Name : ${userOrderObj.itemName}`);
        console.log(`Item Quantity : ${userOrderObj.itemQuantity}`);
        console.log(`Item Price : Rs.${userOrderObj.itemPrice}\n`);
        console.log(`Total Amount : Rs.${userOrderObj.totalAmount}`);
    }

    generateFinalBill(ordersOfUser) {
        let totalBill = 0;
        for (let key in ordersOfUser) {
            console.log(`Item Name : ${ordersOfUser[key].itemName}`);
            console.log(`Item Quantity : ${ordersOfUser[key].itemQuantity}`);
            console.log(`Item Price : Rs.${ordersOfUser[key].itemPrice}`);
            console.log(`Total Amount : Rs.${ordersOfUser[key].totalAmount}\n`);
            totalBill += ordersOfUser[key].totalAmount;
        }
        console.log(`Total Bill : Rs.${totalBill}`);
    }
}

exports.DAOOperations = DAOOperations;