const express = require('express');
const router = express.Router();
const fileHandler = require('./handler');
const uploadMiddleware = require('../../middleware/upload');
const JWTMiddleware = require('../../../pkg/middleware/jwt');

// All file routes are protected
router.use(JWTMiddleware);

router.get('/:filename', fileHandler.get);
router.post('/', uploadMiddleware.single('file'), fileHandler.upload);
router.put('/:filename', uploadMiddleware.single('file'), fileHandler.update);
router.delete('/:filename', fileHandler.remove);

module.exports = router;
