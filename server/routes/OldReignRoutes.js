const express = require('express');
const router = express.Router();
const OldReignController = require('../controllers/OldReignController');
const { tokenLookupValidation } = require('../middleware/validate');

router.post("/oldreign", OldReignController.Old);

router.get("/oldreign",(req,res)=>{
res.send("It is working");
});

router.post("/oldbody", tokenLookupValidation, OldReignController.Oldbody);

module.exports = router;