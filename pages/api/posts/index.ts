import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';

type ResponseData = {
  success: boolean;
  posts?: any[];
  total?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 10;
      const skip = (pageNum - 1) * limitNum;

      // Build search query
      let searchQuery: any = { published: true };
      if (search) {
        searchQuery.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } },
        ];
      }

      const posts = await Post.find(searchQuery)
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      const total = await Post.countDocuments(searchQuery);

      // Get comment count for each post
      const postsWithComments = await Promise.all(
        posts.map(async (post) => {
          const commentCount = await Comment.countDocuments({
            post: post._id,
            approved: true,
          });
          return { ...post, commentCount };
        })
      );

      res.status(200).json({
        success: true,
        posts: postsWithComments,
        total,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching posts',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
