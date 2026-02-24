import mongoose from 'mongoose';

export interface IPost {
  userId: mongoose.Types.ObjectId;
  topic: string;
  tone: string;
  targetAudience?: string;
  platforms: string[];
  generatedPosts: Array<{
    platform: string;
    content: string;
    hashtags: string[];
    bestTime: string;
  }>;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    tone: { type: String, required: true },
    targetAudience: { type: String },
    platforms: [{ type: String }],
    generatedPosts: [
      {
        platform: String,
        content: String,
        hashtags: [String],
        bestTime: String,
      },
    ],
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for faster queries
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ userId: 1, isFavorite: 1 });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post;