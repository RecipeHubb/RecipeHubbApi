

const {  UserModel} = require('../models/userSchema')
const awss3 = require('../util/s3')

module.exports = {
  async create(req, res) {
    try {
      const user = await UserModel.create(req.body);
      res.status(201).json(user)
    } catch (err) {
      console.log(err)
      res.status(500).send('Err Creating User')
    }
  },
  async read(req, res) {

    try {
      const user = await UserModel.find({});
      res.json(user)
    } catch (err) {
      res.status(404).send(err)

    }
  },

  async getUserById(req, res) {
    try {
      const user = await UserModel.findOne({_id: req.params.id});
      res.json(user)
    } catch (err) {
      res.status(404).send(err)

    }
  },
  async data(req, res) {
    try {
      const user = {
        userName: req.user.userName,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        profilePic: req.user.profilePic,
        numRecipes: req.user.numRecipes,
        bio: req.user.bio,
        city: req.user.city,
        id: req.user._id
      }
      res.json(user)
    } catch (err) {
      res.status(404).send(err)

    }
  },
  async update(req, res) {
    try {
      //  update AWS image for image
      const image = req.body.profilePic || null
      let userAgg = {...req.body}

      if (image) {
        //JSON.parse image
        const readImage = JSON.parse(image)
        //remove spacees
        const name = (req.body.userName).trim()
        //update image and store  i.e : 10023424-chicken Sandwich
        const s3Image = await awss3.uploadfile(readImage, `${req.user.id}-${name}`)
        //update recipeImage with s3 image
        userAgg = { ...req.body, profilePic: s3Image.Location }
      }

       await UserModel.updateOne({email: req.params.email}, userAgg)
      res.status(200).json(userAgg)
    } catch (err) {
      console.log(err)
      res.status(404).send('Err Updating')
    }
  },
  async delete(req, res) {
    try {
       await UserModel.deleteOne({email: req.params.email}, req.body)
      res.send(`Successfully deleted ${req.params.email}`)
    } catch (err) {
      res.status(404).send('Err Deleting')
    }
  },
}