const pool = require("../db");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })

const createKos = async (data) => {
  const {
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
    image_url,
  } = data;

  const result = await pool.query(
    `INSERT INTO boarding_houses (
    user_id, name, description, address, city, price, gender, has_wifi, has_ac, has_private_bathroom, latitude, longitude, image_url
    ) VALUES (
    $1, $2, $3, $4, $5, $6, $7,
    $8, $9, $10, $11, $12, $13
    ) RETURNING *`,
    [
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
      image_url,
    ],
  );
  return result.rows[0];
};

const getAllKos = async () => {
  const result = await pool.query(
    `SELECT * FROM boarding_houses ORDER BY created_at DESC`,
  );
  return result.rows;
};

const getKosById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM boarding_houses WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

const getKosByOwner = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM boarding_houses WHERE user_id = ?", [userId]);
  return rows;
}

const searchKos = async ({ city, minPrice, maxPrice }) => {
  const result = await pool.query(
    `
    SELECT * FROM boarding_houses
    WHERE city ILIKE $1 AND price BETWEEN $2 AND $3
  `,
    [`%${city}%`, minPrice, maxPrice],
  );
  return result.rows;
};

const updateKos = async (id, userId, data) => {
  const {
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
    image_url,
  } = data;

  const result = await pool.query(
    `
    UPDATE boarding_houses SET
      name = $1,
      description = $2,
      address = $3,
      city = $4,
      price = $5,
      gender = $6,
      has_wifi = $7,
      has_ac = $8,
      has_private_bathroom = $9,
      latitude = $10,
      longitude = $11,
      image_url = $12
    WHERE id = $13 AND user_id = $14
    RETURNING *;
    `,
    [
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
      image_url,
      id,
      userId,
    ],
  );
  return result.rows[0];
};

const deleteKos = async (id, userId) => {
  const result = await pool.query(
    `
    DELETE FROM boarding_houses
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `,
    [id, userId],
  );
  return result.rows[0];
};

const addImages = async (boardingHouseId, imageUrlArray) => {
  if (!boardingHouseId || imageUrlArray.length) {
    throw new Error("boardingHouseId dan array image URL diperlukan");
  }

  const values = imageUrlArray
    .map((url) => `(${boardingHouseId}, '${url}')`)
    .join(", ");

    const query = `
      INSERT INTO boarding_houses (id, image_url)
      VALUES ${values}
      RETURNING *;
  `;

  const result = await pool.query(query);
  return result.rows;
};

const getImageByKosId = async (id) => {
  const result = await pool.query(
    `
    SELECT id, image_url
    FROM boarding_houses
    WHERE id = $1
  `,
    [id],
  );
  return result.rows;
};

module.exports = {
  createKos,
  getAllKos,
  getKosById,
  getKosByOwner,
  searchKos,
  updateKos,
  deleteKos,
  addImages,
  getImageByKosId
};
