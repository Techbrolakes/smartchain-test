"use strict";
const express = require("express");
const userCore = require("../core/user.core");
const router = express.Router();
router.post("/register", userCore.register);
module.exports = router;
