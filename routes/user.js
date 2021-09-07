const express = require('express');
const { getProfile } = require('../controllers/users');

const router = express.Router();

router.get('/me', getProfile);

module.exports = router;
