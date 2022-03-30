const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const isValid = function (value) {
  if (typeof value === "undefined" || typeof value == "null") {
    return false;
  }

  if (typeof value === ("string" || "Array") && value.trim().length > 0) {
    return true;
  }
};

isvalidRequesbody = function (requestbody) {
  if (Object.keys(requestbody).length > 0) {
    return true;
  }
};

const isvalidTitle = function (title) {
  return ["Mr", "mrs", "miss"].indexOf(title) !== -1;
};

const UserRegister = async function (req, res) {
  try {
    const requestbody = req.body;

    if (!isvalidRequesbody(requestbody)) {
      return res
        .status(400)
        .send({ status: false, msg: "request body is required" });
    }

    const { title, name, phone, email, password } = requestbody;

    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: "title is required" });
    }

    if (!isvalidTitle(title)) {
      return res.status(400).send({ status: false, msg: "title is not valid" });
    }

    if (!isValid(name)) {
      return res.status(400).send({ status: false, msg: "name is required" });
    }

    if (!isValid(phone)) {
      return res.status(400).send({ status: false, msg: "phone is required" });
    }

    if (!/^([+]\d{2})?\d{10}$/.test(requestbody.phone)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide a valid phone Number" });
    }

    let duplicatephone = await UserModel.findOne({ phone: requestbody.phone });

    if (duplicatephone) {
      return res
        .status(400)
        .send({ status: false, msg: "phone Number already exists" });
    }

    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: "email is required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, msg: `Invalid email address!` });
    }

    const isemailAlreadyUsed = await UserModel.findOne({
      email: requestbody.email,
    });

    if (isemailAlreadyUsed) {
      return res
        .status(400)
        .send({ status: false, message: "email is already registred" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    }

    if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)){
        return    res.status(400).send({status : false, message : "password min length is 8 should contain atleast one letter "})
        }

    let saveUser = await UserModel.create(requestbody);
    res.status(201).send({ status: true, data: saveUser });
  } catch (err) {
    res.status(500).send({ status: true, error: err.message });
  }
};
// ========================================================================================================================================================================================================================
const login = async function (req, res) {
  try {
    const requestbody = req.body;

    if (!isvalidRequesbody(requestbody)) {
      return res
        .status(400)
        .send({ status: false, msg: "request body is required" });
    }

    let username = requestbody.email;
    if (!username) {
      return res.status(400).send({ status: false, msg: "please enter email" });
    }
    let password = requestbody.password;
    if (!password) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter password" });
    }
    let savelogin = await UserModel.findOne({
      email: username,
      password: password,
    });
    if (!savelogin) {
      return res
        .status(400)
        .send({ status: false, msg: "username or password is incorrect" });
    }
    let token = await jwt.sign(
      {
        userId: savelogin._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 60 * 60,
      },
      "shubham kumar"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true,msg:"sucess",data: token });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports.UserRegister = UserRegister;
module.exports.login = login;
