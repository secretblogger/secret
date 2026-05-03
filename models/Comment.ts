import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  guestName: string;
  guestEmail: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestName: {
      type: String,
      trim: true,
    },
    guestEmail: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      minlength: [1, 'Comment must not be empty'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Validation: Either user is logged in OR guest info is provided
CommentSchema.pre('save', function (next) {
  if (!this.user && (!this.guestName || !this.guestEmail)) {
    next(new Error('Either login or provide guest name and email'));
  } else {
    next();
  }
});

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
