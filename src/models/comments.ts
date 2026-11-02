import { model, Schema, Model,  Document } from 'mongoose';
import {ObjectId} from 'mongodb'
import { NumberOfAutoScalingGroups } from 'aws-sdk/clients/autoscaling';

interface CommentsModel extends Document {
    recipeId: ObjectId,
    commentOwnerId: String,
    commentOwnerUserName: String,
    dateCreated: Date,
    rating: Number,
    body: [Object]
}

const CommentsSchema: Schema = new Schema({
        recipeId: {
            type: ObjectId,
            default: null
        },
        commentOwnerId: {
            type: ObjectId,
            default: null
        },
        commentOwnerUserName: {
            type: String,
            default: null
        },
        dateCreated: {
            type: Date,
            default: Date.now()
        },
        rating: {
            type: Number,
            default: null
        },
        body: {
            type: String,
            default: null
        },
    }, {timestamps: true}  );

// Comments are always fetched per recipe
CommentsSchema.index({ recipeId: 1 });



// exporting user model
export const CommentModel = model<CommentsModel>('Comments', CommentsSchema);

// exporting interface / querying
export interface IUserModel extends Model<CommentsModel> {
    findByEmail(id, cb);
}