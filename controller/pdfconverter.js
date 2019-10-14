var async = require("async");
var moment = require("moment-timezone");

// logger
var logger = require('log4js').getLogger("blings");

// mysql connection
const mysql = require('../helpers/Mysql_connection.js');

// mongo db connection
var constantsFile = require('../../routes/constants/v1.0');
var connection = require(constantsFile.urls.mongoconnection);

var stateName;
var blingObj = [];

/**Blings Api */
exports.saveBlingsdata = function (req, res) {
    // parse Json object
    var params = req.body;
    console.log("Data*******************"+params.order_id);
    logger.info("Data*******************" + params.order_id);
    connection.connect(function (err, db) {
        if (err) throw err;
        var dbo = db.db(connection.db);
        blingObj = [];

        //execute query
        dbo.collection("signup").find({ account_id: params.account_id }).limit(50).toArray(function (err, result) {
            if (err) {
                logger.error("Something wrong");
            } else {
                stateName = "";
                async.forEach(result, (value, callback) => {
                    stateName = value.state;
                    callback();
                }, err => {
                    if (err) logger.error(err.message);
                    saveBling(stateName, function (response) {
                        dbo.collection("blings").insertMany(blingObj, function (err, res) {
                            if (err) throw err;
                            logger.info("1 document inserted");
                            
                        });

                    })
                });
            }
        });
    });

    /**save bling */
    function saveBling(stateName, callback) {
        logger.info("state name:- " + stateName);
        blingObj.push({
            order_id: params.order_id,
            account_id: params.account_id,
            State: stateName,
            item_total: params.item_total,
            discount_amount: params.discount_amount,
            subtotal_with_discount: params.subtotal_with_discount,
            sub_total: params.sub_total,
            tax: params.tax,
            Order_Amount: params.Order_Amount,
            gateway_amount: params.gateway_amount,
            payment_gateway: params.payment_gateway,
            Date: params.Date
        });
        return callback(blingObj);
    }
};
