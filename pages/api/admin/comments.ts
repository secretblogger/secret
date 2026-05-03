import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import User from '@/models/User';

type ResponseData = {
  success: boolean;
  comments?: any[];
  message?: string;
  error?: string;
};

const isAdmin = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId);
  return user?.isAdmin || false;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await dbConnect();
  const { userId } = req.body;

  if (!userId || !(await isAdmin(userId))) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }

  if (req.method === 'GET') {
    try {
      const { approved } = req.query;
      const filter: any = {};
      if (approved !== undefined) {
        filter.approved = approved === 'true';
      }

      const comments = await Comment.find(filter)
        .populate('post', 'title slug')
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        success: true,
        comments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error fetching comments',
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { commentId, approved } = req.body;

      const comment = await Comment.findByIdAndUpdate(
        commentId,
        { approved },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error updating comment',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { commentId } = req.body;

      await Comment.findByIdAndDelete(commentId);

      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error deleting comment',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
