require("dotenv").config();
const User = require("../models/user");
const repository = require("../repositories/base.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    try {
      const userData = await repository.findOne(
        { email: req.body.email },
        User
      );
      const user = { email: userData.email };

      if (await bcrypt.compare(userData.password, req.body.password)) {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({
          accessToken: accessToken,
        });
      } else {
        res.status(405).send({
          message: "WRONG PASSWORD",
        });
      }
    } catch (e) {
      res.status(400).json({
        error: error,
      });
    }
  },

  signup: async (req, res) => {
    try {
      let userData = req.body;
      userData.password = await bcrypt.hash(userData.password, 10);
      const user = await repository.save(userData, User);
      res.status(201).send({ message: "Created!" });
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
};
