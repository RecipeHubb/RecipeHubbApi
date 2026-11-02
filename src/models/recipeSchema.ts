import { model, Schema, Model,  Document } from 'mongoose';
import {ObjectId, Timestamp} from 'mongodb'

interface RecipeModel extends Document {
    name: String,
    ownerId: ObjectId,
    ingredients: [Object],
    instructions: String,
    recipeImage: String,
    servingSize: Number,
    soEasyRating: Number,
    tags: [String],
    favorited: Boolean,
    dateCreated: Timestamp,
    public: Boolean
}

const RecipeSchema: Schema = new Schema({
        name: {
            type: String,
            default: null
        }, 
        ownerId: {
            type: ObjectId,
            default: null
        },
        ingredients: {
            type: Array,
            default: []
        },
        instructions: {
            type: String,
            default: null
        },
        recipeImage: {
            type: String,
            default: null
        },
        servingSize: {
            type: Number,
            default: null
        },
        soEasyRating: {
            type: Number,
            default: null
        },
        tags: {
            type: Array,
            default: []
        },
        favorited: {
            type: Boolean,
            default: false
        },
        dateCreated: {
            type: Date,
            default: Date.now()
        },
        public: {
            type: Boolean,
            default: false
        },
},{timestamps: true});

// Hot query paths: fetching a user's recipes, and the public feed/search
RecipeSchema.index({ ownerId: 1 });
RecipeSchema.index({ public: 1, ownerId: 1 });



// exporting user model
export const RecipeModel = model<RecipeModel>('Recipes', RecipeSchema);

// exporting interface / querying
export interface IUserModel extends Model<RecipeModel> {
    findById(id, cb);
}
