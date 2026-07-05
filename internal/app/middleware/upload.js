const multer = require('multer');

// Standard Industry limit: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    // Optional: Add file type filtering here
    cb(null, true);
  },
});

module.exports = upload;
