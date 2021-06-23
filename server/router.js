const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render("home", {
		meta: req.app.get('meta')
	});
});

module.exports = router;
