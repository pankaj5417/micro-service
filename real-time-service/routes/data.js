const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.send('Real-time data service is running');
});

module.exports = router;
