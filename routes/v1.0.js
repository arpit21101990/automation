

    var router = require('express').Router();
    /**Order request */
    var orderData = require('../controller/classes/order.js');
    router.post('/order', orderData.saveOrderdata);

    /**Bling request */
    var blingsData = require('../controller/classes/blings.js');
    router.post('/blings', blingsData.saveBlingsdata);

    /**Ticket request */
    var ticketsData = require('../controller/classes/tickets.js');
    router.post('/tickets', ticketsData.saveTicketsData);

    /**Winning request */
    var winningsData = require('../controller/classes/winnings.js');
    router.post('/winnings', winningsData.saveWinningsData);

    /**Withdrawal request */
    var withdrawalsData = require('../controller/classes/withdrawals.js');
    router.post('/withdrawals', withdrawalsData.saveWithdrawalsData);

    /**Refund request */
    var refundData = require('../controller/classes/refund.js');
    router.post('/refund', refundData.saveRefundData);

    /**Signup request */
    var signupData = require('../controller/classes/signup.js');
    router.post('/signup', signupData.saveSignupData);
    router.post('/stateUpdate', signupData.stateUpdate);
    router.post('/panUpdate', signupData.panUpdate);

    /**Routes for frontend */
    var main = require('../controller/classes/app.js');
    router.post('/user/login', main.checkLogin);
    router.get('/user/blings', main.getBlings);
    router.get('/user/withdrawals', main.getWithdrawals);
    router.get('/user/winnings', main.getWinnings);
    router.get('/user/tickets', main.getTickets);
    router.get('/user/signup', main.getSignup);
    router.get('/user/refund', main.getRefunds);

    module.exports = router;

