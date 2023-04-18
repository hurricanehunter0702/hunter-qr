const bcrypt = require("bcrypt");
const saltRound = 12;
const memberModel = require("../models/memberModel");
const schema = require("../schema/schema");
var { graphql } = require("graphql");

const getAllMembers = async (req, res) => {
  let query = "{allMembers {firstname,lastname,email}}";
  graphql(schema, query).then((result) => {
    res.send(result);
  });
};

const getMemberById = async (req, res) => {
  let query = `{memberById(id:"${req.params.id}"){firstname,lastname,email}}`;
  graphql(schema, query).then((result) => {
    res.json(result);
  });
};

const addMember = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, saltRound);
    req.user = {
      email: req.body.email,
      password: hash,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      organization: req.body.organization,
    };
    let user = new memberModel(req.user);
    const result = await user.save();
    delete result.password;
    const userCreated = {
      full_name: result.firstname + result.lastname,
    };
    res.json({
      message: "User created",
      userCreated,
    });
  } catch (e) {
    res.status(500).json(e);
  } 
};

module.exports = {
  getAllMembers,
  getMemberById,
  addMember,
};
