const express = require("express");
const { PostModel } = require("../models/post.model")
const jwt = require("jsonwebtoken");
const postRouter = express.Router();


postRouter.get("/", async (req, res) => {
  const {token} = req.cookies;
  const decoded = jwt.verify(token, "accessToken");
  try {
    if (decoded) {
      const post = await PostModel.find();
        res.status(200).send(post);
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

postRouter.post("/add", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(200).send({ msg: "Post added" });
  } catch (error) {
    res.status(400).send({ msg: "Failed to add post" });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const payLoad = req.body;
  try {
    await PostModel.findByIdAndUpdate({ _id: id }, payLoad);
    res.status(200).send({ msg: "post updated" });
  } catch (error) {
    res.status(400).send(error);
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await PostModel.findByIdAndDelete({ _id: id });
    res.status(200).send({ msg: "post deleted" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = {
    postRouter
}