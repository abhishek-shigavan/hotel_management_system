const assert = require('chai').assert;
const dao = require('../utility/DAOOperations');
const daoOpeartions = new dao.DAOOperations();

const date = new Date();
// Actual Results
getFormatedDateResult = daoOpeartions.getFormatedDate(date);
getFormatedTimeInHourMinResult = daoOpeartions.getFormatedTimeInHourMin(date);
getOrderDetailsObjResult = daoOpeartions.getOrderDetailsObj('Tea', 2, 40, 80);
itemNameResult = getOrderDetailsObjResult.itemName;
itemQuantityResult = getOrderDetailsObjResult.itemQuantity;
itemPriceResult = getOrderDetailsObjResult.itemPrice;
totalAmountResult = getOrderDetailsObjResult.totalAmount;

describe('DAOOerations Test Cases', function(){

    describe('getFormatedDate()', function(){
        it('getFormatedDate() should return date in mm/dd/yyyy format', function(){
            assert.equal(getFormatedDateResult, '10/04/2021');
        });

        it('getFormatedDate() should return date of type string', function(){
            assert.typeOf(getFormatedDateResult, 'string')
        });
    });
    
    describe('getFormatedTimeHour()', function(){
        it('getFormatedTimeHour() should return time of type string', function(){ 
            assert.typeOf(getFormatedTimeInHourMinResult, 'string');
        });
    });

    describe('getOrderDetailsObj()', function(){
        it('getOrderDetailsObj() should return object', function(){
            assert.typeOf(getOrderDetailsObjResult, 'object');
        });
    });

    describe('checking getOrderDetailsObj() create object with given data / not', function(){
        it('itemName property of object should be Tea', function(){
            assert.equal(itemNameResult, 'Tea')
        });
        
        it('itemQuantity property of object should be 2', function(){
            assert.equal(itemQuantityResult, 2);
        });

        it('itemPrice property of object should be 40', function(){
            assert.equal(itemPriceResult, 40);
        });

        it('totalAmount property of object should be 80', function(){
            assert.equal(totalAmountResult, 80);
        });
    });
});

