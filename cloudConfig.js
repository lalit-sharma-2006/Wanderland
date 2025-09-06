const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.mimetype.split('/')[1]; // e.g., 'jpeg', 'png'
    return {
      folder: 'wanderlust_DEV',
      format: ext, // pass a single format string
      public_id: 'computed-filename-using-request',
    };
  },
});

module.exports={
    cloudinary,
    storage,
}