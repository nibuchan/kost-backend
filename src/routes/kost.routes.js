const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const BoardingHouse = require("../models/kost.model");

router.post("/", auth, async (req, res) => {
  try {
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
      image_url_list,
    } = req.body;

    const thumbnail =
      Array.isArray(image_url_list) && image_url_list.length > 0
        ? image_url_list[0]
        : "";

    const kos = await BoardingHouse.createKos(req.user.id, {
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
      image_url: thumbnail,
    });

    if (Array.isArray(image_url_list) && image_url_list.length > 0) {
      await BoardingHouse.addImages(kos.id, image_url_list);
    }

    res
      .status(201)
      .json({ message: "Berhasil menambahkan kos", kos_id: kos.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await BoardingHouse.getAllKos();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { city = "", minPrice = 0, maxPrice = 10000000 } = req.query;
  try {
    const data = await BoardingHouse.searchKos({ city, minPrice, maxPrice });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await BoardingHouse.getKosById(req.params.id);
    if (!data) return res.status(404).json({ error: "Kos tidak ditemukan" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/owner", auth, async (req, res) => {
  try {
    const kosList = await BoardingHouse.getKosByOwner(req.user.id);
    res.json(kosList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await BoardingHouse.updateKos(
      req.params.id,
      req.user.id,
      req.body,
    );
    if (!updated)
      return res
        .status(403)
        .json({ error: "Tidak ada izin atau kos tidak ditemukan" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await BoardingHouse.deleteKos(req.params.id, req.user.id);
    if (!deleted)
      return res
        .status(403)
        .json({ error: "Tidak ada izin atau kos tidak ditemukan" });
    res.json({ message: "Berhasil menghapus kos" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
