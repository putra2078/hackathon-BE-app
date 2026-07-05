const fileService = require('./service');

const get = async (req, res) => {
  try {
    const { filename } = req.params;
    const stream = await fileService.getFile(filename);
    stream.pipe(res);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const filename = await fileService.uploadFile(req.file);
    return res.status(201).json({ success: true, data: { filename } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { filename } = req.params;
    await fileService.updateFile(filename, req.file);
    return res.status(200).json({ success: true, message: 'File updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { filename } = req.params;
    await fileService.deleteFile(filename);
    return res.status(200).json({ success: true, message: 'File deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  get,
  upload,
  update,
  remove,
};
