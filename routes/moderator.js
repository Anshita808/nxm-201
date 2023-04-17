const express = require("express");
const { PostModel } = require("../models/post.model");
const jwt = require("jsonwebtoken");
const { checkRole } = require("../middleware/authorise");
const moderatorRouter = express.Router();

moderatorRouter.get(
  "/getAllUser",
  checkRole(["moderator"]),
  async (req, res) => {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, "accessToken");
    try {
      if (decoded) {
        const post = await PostModel.find();
        res.status(200).send(post);
      }
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  }
);

moderatorRouter.post("/add", checkRole(["moderator"]), async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(200).send({ msg: "Post added" });
  } catch (error) {
    res.status(400).send({ msg: "Failed to add post" });
  }
});

moderatorRouter.patch(
  "/update/:id",
  checkRole(["moderator"]),
  async (req, res) => {
    const { id } = req.params;
    const payLoad = req.body;
    try {
      await PostModel.findByIdAndUpdate({ _id: id }, payLoad);
      res.status(200).send({ msg: "post updated" });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

moderatorRouter.delete(
  "/delete/:id",
  checkRole(["moderator"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      await PostModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ msg: "post deleted" });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

module.exports = {
  moderatorRouter,
};