export {};
const { AuthModel } = require("../models/auth.ts");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userSchema");
const jwt = require("../util/jwt.ts");

module.exports = {
  async create(req, res) {
    try {
      const { password, email, userName, firstName, lastName, city, bio } =
        req.body;
      // take user password
      // hash password
      // save to auth database
      // verification: email -> password: characters/symbols, email isn't stored in db
      const saltRounds = process.env.SALT; // store in env
      const hash = await bcrypt.hash(password, Number(saltRounds));
      const save = {
        email,
        userName,
        firstName,
        lastName,
        bio,
        city,
      };

      await AuthModel.create({ userName, email, password: hash });
      const user = await UserModel.create(save);

      res.status(200).json({ user, success: true });
    } catch (err) {
      console.log(err);
      // duplicate userName/email (unique index violation) → 409, everything else → 500
      const isDuplicate = err && err.code === 11000;
      const status = isDuplicate ? 409 : 500;
      const message = isDuplicate
        ? "Username or email already in use"
        : "Unable to create account";
      return res.status(status).json({ success: false, message });
    }
  },

  async read(req, res) {
    try {
      const authUser = await AuthModel.find({});
      res.json(authUser);
    } catch (err) {
      res.status(404).send(`Error Showing auth user: ${err}`);
    }
  },
  async login(req, res) {
    try {
      // if they pass in either email or userName
      const authUser = await AuthModel.findOne(req.body.query);

      if (!authUser) {
        return res.status(401).json({ success: false, message: "Unable to login" });
      }

      // compare provided password with stored password
      const userExists = await bcrypt.compare(
        req.body.password,
        authUser.password
      );

      if (!userExists) {
        return res.status(401).json({ success: false, message: "Unable to login" });
      }

      const token = jwt.create(authUser);
      res.json({ message: "Login Successful", success: true, token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Unable to login" });
    }
  },

  async update(req, res) {
    try {
      // see if new username is being used
      const userNameBeingUsed = await AuthModel.findOne({
        userName: req.body.newUserName,
      });

      // if username not being used, update the current auth user
      if (!userNameBeingUsed) {
        const updatedUser = await AuthModel.updateOne(
          { userName: req.body.oldUserName },
          {
            userName: req.body.newUserName,
            email: req.body.newEmail,
          }
        );
        return res.status(200).json(updatedUser);
      }
      // else, update new email
      else if (req.body.oldUserName === req.body.newUserName) {
        const updatedUser = await AuthModel.updateOne(
          { email: req.body.oldEmail },
          {
            userName: req.body.newUserName,
            email: req.body.newEmail,
          }
        );
        return res.status(200).json(updatedUser);
      }
      // else return res.status(404).send('username already used')
    } catch (err) {
      console.log(err);
      return res.status(404).send("username already used");
    }
  },

  async findUser(req, res) {
    try {
      const authUser = (await AuthModel.findOne(req.body.query)) ? true : false;
      return res.status(200).json({ exists: authUser });
    } catch (err) {
      console.log(err);
      return res.status(404).send("username or email doesnt exists");
    }
  },
  async reset(req, res) {
    try {
      const authUser = await AuthModel.findOne(req.body.query);
      if (authUser) {
        const saltRounds = process.env.SALT; // store in env
        const hash = await bcrypt.hash(req.body.password, Number(saltRounds));
        await AuthModel.updateOne(authUser, { password: hash });
        return res.status(200).json({ success: true });
      }

      return res.status(200).json({ success: false });
    } catch (err) {
      console.log(err);
      return res.status(404).send("Not succeessfully change password");
    }
  },
};
