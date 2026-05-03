import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: mongoose.Types.ObjectId;
  published: boolean;
  featured: boolean;
  tags: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
      maxlength: [500, 'Excerpt cannot be more than 500 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
