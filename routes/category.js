const express = require("express");
const Category = require("../models/category");
const auth = require("../services/services");
const { route } = require("./admin");
const router = require("express").Router();

router.get("/get-category", auth, async (req, res, next) => {
  const getCategory = await Category.find();
  console.log("res");
  res.status(202).json(getCategory);
});

router.post("/create-category", auth, async (req, res, next) => {
  const categoryExists = await Category.findOne({
    categoryName: req.body.categoryName,
  });
  if (categoryExists) {
    res.status(504).json("ALREADY EXISTS");
  }

  const category = await new Category({
    categoryName: req.body.categoryName,
  });
  category
    .save()
    .then((result) => {
      console.log(result);
      res.status(202).json({
        success: true,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(505).json(err);
    });
});

router.post("/update-category", auth, async (req, res, next) => {
  const thing = req.body;
  Category.updateOne({ _id: req.body.id }, thing)
    .then(() => {
      console.log(thing);
      res.status(202).json(thing);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});
router.post("/delete", auth, async (req, res, next) => {
  const id = { _id: req.body.id };
  Category.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(404).json(err);
    } else {
      res.status(202).json(docs);
    }
  });
});

module.exports = router;
