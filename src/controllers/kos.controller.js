const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Fungsi upload + createKos
const createKosHandler = async (req, res) => {
  try {
    const file = req.file;
    const {
      name, description, address, city, price,
      gender, has_wifi, has_ac, has_private_bathroom,
      latitude, longitude, user_id
    } = req.body;

    const cloudinaryResult = await cloudinary.uploader.upload_stream(
      { folder: "kos-app" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        const data = {
          user_id,
          name,
          description,
          address,
          city,
          price,
          gender,
          has_wifi,
          has_ac,
          has_private_bathroom,
          latitude,
          longitude,
          image_url: result.secure_url
        };

        const newKos = await createKos(data);
        res.status(201).json(newKos);
      }
    );

    file.stream.pipe(cloudinaryResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createKosHandler,
  upload
};
