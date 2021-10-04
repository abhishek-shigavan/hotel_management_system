const fileSystem = require('fs');
const pt = require('prompt-sync')();
const writeInXlsx = require('xlsx');
const io = require('./InputOutputMethods');
const order = require('./OrderDetails');
const register = require('./HotelRegister')

const ioMethods = new io.IOMethods();

const orderArray = [];

class DAOOperations {

    getObjOfJsonFileData(filePath) {
        const jsonFileData = fileSystem.readFileSync(filePath);
        const objOfJsonFileData = JSON.parse(jsonFileData);
        return objOfJsonFileData;
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
            const isUserPresent = this.checkUserInRegisteredUsers(userKey);
            if (isUserPresent) {
                this.loggedInUserOperations(userKey);
            }
        }
    }

    printReportInXlsx() {
        const reportData = this.getObjOfJsonFileData('./reports/report.json');
        //creating a workbook
        let workBook = writeInXlsx.utils.book_new();
        //creting worksheet
        let workSheet = writeInXlsx.utils.json_to_sheet(reportData);
        writeInXlsx.utils.book_append_sheet(workBook, workSheet, 'UserOrderHistory');
        writeInXlsx.writeFile(workBook, './reports/reportPrint.xlsx');
        console.log(`\nReport Created Sucessfully...!!!`);
    }

    checkUserInRegisteredUsers(userId) {
        let flag = false;
        const registeredUsersObj = this.getObjOfJsonFileData('./json/registeredUsers.json');
        for (let user in registeredUsersObj) {
            if (registeredUsersObj[user].userID === userId) {
                console.log(`\nLogin Sucessfully...!!!`);
                flag = true;
            }
        }

        if (!flag) {
            console.log(`\nInvalid Key...!!!\nIf You Dont Have Key Register First...!!!`);
            this.loginUserToSystem();
        }
        return flag;
    }

    getUserDetailsByKey(userKey) {
        const registeredUsersObj = this.getObjOfJsonFileData('./json/registeredUsers.json');
        for (let user in registeredUsersObj) {
            if (registeredUsersObj[user].userID === userKey) {
                const userDetailsObj = registeredUsersObj[user];
                return userDetailsObj;
            }
        }
        return null;
    }

    loggedInUserOperations(userKey) {
        const loggedInUserDetails = this.getUserDetailsByKey(userKey);
        const nameOfUser = loggedInUserDetails.firstName + " " + loggedInUserDetails.lastName;

        // 0 => HotelRegisterObj, 1 => CheckInInMs, 2 => CheckOutInMs, 
        // 3 => StayDurationInDays, 4 => StayDurationInHours, 5 => chargesOfStay 
        const registerArray = [];
        this.addCheckInDataIntoRegister(loggedInUserDetails, nameOfUser, registerArray);
        
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
                this.addCheckOutIntoRegister(registerArray);
                this.calculateStayDurationAndCharges(registerArray);
                this.addDataToRegister(registerArray);
                const totalBill = this.generateFinalBill(registerArray, orderArray);
                const orderHistory = this.getOrderArrayInString(orderArray);
                this.generateReport(registerArray, orderHistory, totalBill);
                
                flag = false;
            }
        }
    }

    addCheckInDataIntoRegister(loggedInUserDetails, nameOfUser, arrayOfRegister) {
        const hotelRegister = new register.HotelRegister();
        const date = new Date();

        hotelRegister.setCustomerName = nameOfUser;
        hotelRegister.setCustomerGender = loggedInUserDetails.gender;
        hotelRegister.setCustomerID = loggedInUserDetails.userID;
        hotelRegister.setCustomerMobNo = loggedInUserDetails.mobNo;
        const checkInDate = this.getFormatedDate(date);
        hotelRegister.setCheckInDate = checkInDate;
        const checkInTime = this.getFormatedTimeInHourMin(date);
        hotelRegister.setCheckInTime = checkInTime;
        const checkInTimeInMS = date.getTime();
        arrayOfRegister.push(hotelRegister);
        arrayOfRegister.push(checkInTimeInMS);
    }

    addCheckOutIntoRegister(arrayOfRegister) {
        const date = new Date();
        const checkOutDate = this.getFormatedDate(date);
        const checkOutTime = this.getFormatedTimeInHourMin(date);
        const checkOutTimeInMS = date.getTime();
        arrayOfRegister[0].setCheckOutDate = checkOutDate;
        arrayOfRegister[0].setCheckOutTime = checkOutTime;
        arrayOfRegister.push(checkOutTimeInMS);
    }

    getFormatedDate(regularDate) {
        let day = regularDate.getDate();
        let month = regularDate.getMonth() + 1;
        const year = regularDate.getFullYear();

        if(day < 10) {
            day = '0' + day;
        }
        if(month < 10) {
            month = '0' + month;
        }
        const formatedDate = month + '/' + day + '/' + year;
        return formatedDate;
    }

    getFormatedTimeInHourMin(regularDate) {
        const hour = regularDate.getHours();
        const minutes = regularDate.getMinutes();
        const hourMinutes = hour +" : "+ minutes;
        return hourMinutes;
    }

    calculateStayDurationAndCharges(arrayOfRegister) {
        const checkOutTime = arrayOfRegister[2];
        const checkInTime = arrayOfRegister[1];
        const diffInTime = checkOutTime - checkInTime;
        const stayDurationInDay = ~~(diffInTime / (1000 * 3600 * 24));
        const stayDurationInHour = ~~(diffInTime / (1000 * 3600));
        const gst = 0.18;
        let chargeOfStay;
        if(stayDurationInDay > 0) {
            const perDayCharge = 1000;
            chargeOfStay = stayDurationInDay * perDayCharge;
            chargeOfStay = chargeOfStay + (chargeOfStay * gst);
            arrayOfRegister.push(stayDurationInDay);
            arrayOfRegister.push(0);
            arrayOfRegister.push(chargeOfStay)
        }

        if(stayDurationInHour <= 12) {
            const halfDayCharge = 500;
            chargeOfStay = halfDayCharge + (halfDayCharge * gst);
            arrayOfRegister.push(0);
            arrayOfRegister.push(stayDurationInHour);
            arrayOfRegister.push(chargeOfStay);
        }
        else if(stayDurationInHour > 12 && stayDurationInHour <= 24) {
            const chargeForDay = 1000;
            chargeOfStay = chargeForDay + (chargeForDay * gst);
            arrayOfRegister.push(0);
            arrayOfRegister.push(stayDurationInHour);
            arrayOfRegister.push(chargeOfStay);
        }
    }

    addDataToRegister(arrayOfRegister) {
        const data = arrayOfRegister[0];
        const registerObj = {
            "Name Of Customer" : data.getCustomerName,
            "Gender" : data.getCustomerGender,
            "UserID" : data.getCustomerID,
            "Mobile No" : data.getCustomerMobNo,
            "CheckIn Date" : data.getCheckInDate,
            "CheckIn Time" : data.getCheckInTime,
            "CheckOut Date" : data.getCheckOutDate,
            "CheckOut Time" : data.getCheckOutTime
        }
        this.writeDataInFile('./json/hotelRegister.json', registerObj)
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
        const itemQuantity = + pt('Enter Quantity : ');
        let totalAmount;
        const gst = 0.18;
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
            default:
                break;
        }
    }

    takeStuffOrder(selectedItem) {
        const itemQuantity = + pt('Enter Quantity : ');
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
        while (status) {
            console.log(`\nTo Confirm Order Enter Y / y & To Cancel Enter N / n`);
            let confirmOrder = pt(`Enter Here : `).toLowerCase();
            if (confirmOrder === 'y') {
                console.log(`Order Placed Sucessfully...!!!`);
                orderArray.push(orderObj);
                status = false;
            }
            else if (confirmOrder === 'n') {
                console.log(`\nGoing Back To Dashboard...!!!`);
                status = false;
            }
        }
    }

    getOrderArrayInString(orderArray) {
        let orderHistory = "";
        let count = 1;
        for (let element in orderArray) {
            const orderDetailsObj = orderArray[element];
            const nameOfItem = orderDetailsObj.itemName;
            const quantityOfItem = orderDetailsObj.itemQuantity;
            const priceOfItem = orderDetailsObj.itemPrice;
            const totalBill = orderDetailsObj.totalAmount;
            orderHistory += count + ". " + "Name Of Item : " + nameOfItem + ", " + "Quantity : " + quantityOfItem + ", " +
                "Price : " + priceOfItem + ", " + "TotalAmount : " + totalBill + " | ";
            count++;
        }
        return orderHistory;
    }

    generateBill(userOrderObj) {
        console.log(`\nItem Name : ${userOrderObj.itemName}`);
        console.log(`Item Quantity : ${userOrderObj.itemQuantity}`);
        console.log(`Item Price : Rs.${userOrderObj.itemPrice}\n`);
        console.log(`Total Amount : Rs.${userOrderObj.totalAmount}`);
    }

    generateFinalBill(arrayOfRegister, ordersOfUser) {
        let totalBill = 0;
        const customerName = arrayOfRegister[0].getCustomerName;
        const stayDurationInDay = arrayOfRegister[3];
        const stayDurationInHour = arrayOfRegister[4];
        const charges = arrayOfRegister[5];
        const stayDuration = stayDurationInDay +" Day "+ stayDurationInHour +" Hours";
        console.log(`\n **** Bill ****\n`);
        console.log(`Customer Name : ${customerName}\n`);
        console.log(`Duration Of Stay : ${stayDuration}\n`);
        console.log(`Charges Of Stay : Rs.${charges}\n`);
        console.log(`Your Orders : \n`);

        for (let key in ordersOfUser) {
            console.log(`Item Name : ${ordersOfUser[key].itemName}`);
            console.log(`Item Quantity : ${ordersOfUser[key].itemQuantity}`);
            console.log(`Item Price : Rs.${ordersOfUser[key].itemPrice}`);
            console.log(`Total Amount : Rs.${ordersOfUser[key].totalAmount}\n`);
            totalBill += ordersOfUser[key].totalAmount;
        }
        totalBill = totalBill + charges;
        console.log(`Total Bill : Rs.${totalBill}\n`);
        console.log('Thank You...Visit Us Again...!!!');

        return totalBill;
    }

    generateReport(arrayOfRegister, ordersOfUser, totalBill) {
        const nameOfUser = arrayOfRegister[0].getCustomerName;
        const idOfUser = arrayOfRegister[0].getCustomerID;
        const checkInDate = arrayOfRegister[0].getCheckInDate;
        const checkOutDate = arrayOfRegister[0].getCheckOutDate;
        const stayDurationInDay = arrayOfRegister[3];
        const stayDurationInHour = arrayOfRegister[4];
        const stayDuration = stayDurationInDay +" Day "+ stayDurationInHour +" Hours"; 
        const charges = arrayOfRegister[5];

        const User = {
            NameOfUser : nameOfUser,
            UserID : idOfUser,
            CheckInDate : checkInDate,
            CheckOutDate : checkOutDate,
            StayDuration : stayDuration,
            ChargesOfStay : charges, 
            OrdersOfUser : ordersOfUser,
            TotalBill : totalBill
        }

        this.writeDataInFile('./reports/report.json', User)
    }
}

exports.DAOOperations = DAOOperations;