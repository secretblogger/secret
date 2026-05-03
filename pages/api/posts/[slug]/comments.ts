import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';

type ResponseData = {
  success: boolean;
  message?: string;
  comment?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await dbConnect();
  const { slug } = req.query;

  if (req.method === 'POST') {
    try {
      const { userId, guestName, guestEmail, content } = req.body;

      // Find post
      const post = await Post.findOne({ slug });
      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post not found',
        });
      }

      // Validate input
      if (!content) {
        return res.status(400).json({
          success: false,
          error: 'Comment content is required',
        });
      }

      if (!userId && (!guestName || !guestEmail)) {
        return res.status(400).json({
          success: false,
          error: 'Either login or provide guest name and email',
        });
      }

      const comment = await Comment.create({
        post: post._id,
        user: userId || null,
        guestName: guestName || null,
        guestEmail: guestEmail || null,
        content,
        approved: false, // Comments need approval
      });

      res.status(201).json({
        success: true,
        message: 'Comment submitted for review',
        comment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error creating comment',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
