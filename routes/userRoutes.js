const express = require("express");
const router = express.Router();
const { authenticateUser, authorizePermissions } = require("../middleware/authentication");

const { getAllUser, 
        getSingleUser,
        showCurrentUser,
        updateUser,
        updateUserPassword } 
        = require("../controllers/userController");

router.route("/").get(authenticateUser, authorizePermissions("Admin", "User"), getAllUser);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
 
router.route("/:id").get(authenticateUser,authorizePermissions("Admin", "User"), getSingleUser);

module.exports = router;