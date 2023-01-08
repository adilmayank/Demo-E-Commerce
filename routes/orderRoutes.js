const express =  require("express");
const router = express.Router();
const { authenticateUser, authorizePermissions } = require("../middleware/authentication");

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrder,
    createOrder,
    updateOrder,
} = require("../controllers/orderController");


router.route("/").get([authenticateUser, authorizePermissions("Admin")], getAllOrders)
                 .post([authenticateUser], createOrder);

router.route("/showAllMyOrders").get([authenticateUser], getCurrentUserOrder);

router.route("/:id").get([authenticateUser], getSingleOrder)
                    .patch([authenticateUser], updateOrder);


module.exports = router;