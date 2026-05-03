import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

type ResponseData = {
  success: boolean;
  post?: any;
  comments?: any[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await dbConnect();
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await Post.findOne({ slug, published: true })
        .populate('author', 'username email')
        .lean();

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Increment view count
      await Post.findByIdAndUpdate(post._id, { $inc: { viewCount: 1 } });

      // Get approved comments
      const comments = await Comment.find({ post: post._id, approved: true })
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        success: true,
        post,
        comments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching post',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
