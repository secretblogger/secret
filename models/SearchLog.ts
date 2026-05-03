import mongoose, { Schema, Document } from 'mongoose';

interface ISearchLog extends Document {
  query: string;
  results: number;
  user?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SearchLogSchema = new Schema<ISearchLog>(
  {
    query: {
      type: String,
      required: true,
      trim: true,
    },
    results: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const SearchLog = mongoose.models.SearchLog || mongoose.model<ISearchLog>('SearchLog', SearchLogSchema);

export default SearchLog;
