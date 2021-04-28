const RecipePublic = require('../../models/recipeSchema');
const UserPublic = require('../../models/userSchema');
module.exports = {
    async get(req, res) {
        try {
            // return all public recipes
            const recipes = await RecipePublic.RecipeModel.find({ public: true })
            res.status(200).json(recipes)
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    },
    async search(req, res) {
        try {
            // grab userId
            const user = req.body.query.userName ? await UserPublic.UserModel.findOne({ userName: req.body.query.userName }) : null
            // agg is either req.body or added userId
            let agg = req.body.query
            if(user) {
                //remove userName
                const {userName, ...rest} = req.body.query
                //update ..rest with ownerId
                agg = {...rest, ownerId: user._id }
            }
            // query gets passed in by frontend returns recipes    

            const recipes = await RecipePublic.RecipeModel.find(agg)
            
            res.status(200).json(recipes)
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    }
}