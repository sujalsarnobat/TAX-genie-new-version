const express = require("express");
const router = express.Router();
const PersonalInfoController = require('../controllers/PersonalInfoController');
const { personalInfoValidation } = require('../middleware/validate');

// save in database route
router.post("/personalInfosave", personalInfoValidation, PersonalInfoController.PersonalInfoSave);

// access from database route
router.post("/personalInfoaccess", PersonalInfoController.PersonalInfoAccess);

module.exports = router;
