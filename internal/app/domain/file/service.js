const minioClient = require('../../../pkg/minio');

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'uploads';

const ensureBucket = async () => {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
  }
};

const getFile = async (objectName) => {
  return await minioClient.getObject(BUCKET_NAME, objectName);
};

const uploadFile = async (file) => {
  await ensureBucket();
  const metaData = { 'Content-Type': file.mimetype };
  await minioClient.putObject(BUCKET_NAME, file.originalname, file.buffer, file.size, metaData);
  return file.originalname;
};

const updateFile = async (objectName, file) => {
  // S3 update is simply overwriting the existing object
  return await uploadFile(file);
};

const deleteFile = async (objectName) => {
  return await minioClient.removeObject(BUCKET_NAME, objectName);
};

module.exports = {
  getFile,
  uploadFile,
  updateFile,
  deleteFile,
};
