const express = require("express");
const router = express.Router();
const TaxController = require("../controllers/TaxController");
const { taxCalculationValidation, tokenLookupValidation } = require("../middleware/validate");

//@description http://localhost:8000/api/v1/tax/calculations

router.post("/calculations", taxCalculationValidation, TaxController.Tax);

router.get("/calculations", (req, res) => {
  res.send("It is working");
});

router.post("/calculationbody", tokenLookupValidation, TaxController.Taxbody);

router.post("/history", TaxController.getUserTaxHistory);

router.post("/generate-itr1", TaxController.generateITR1);

module.exports = router;