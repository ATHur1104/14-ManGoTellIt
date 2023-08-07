const router = require('express').Router();
const thoughtRoutes = require('./thoughtRoutes');
const UserRoutes = require('./userRoutes');

router.use('/thoughts', thoughtRoutes);
router.use('/Users', UserRoutes);

module.exports = router;
