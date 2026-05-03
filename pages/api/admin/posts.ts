import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

type ResponseData = {
  success: boolean;
  message?: string;
  post?: any;
  error?: string;
};

// Middleware to check admin
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

  if (req.method === 'POST') {
    try {
      const { title, content, excerpt, tags } = req.body;

      if (!title || !content || !excerpt) {
        return res.status(400).json({
          success: false,
          error: 'Title, content, and excerpt are required',
        });
      }

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const post = await Post.create({
        title,
        slug,
        content,
        excerpt,
        author: userId,
        tags: tags || [],
        published: false,
      });

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error creating post',
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { postId, title, content, excerpt, tags, published, featured } = req.body;

      const post = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          content,
          excerpt,
          tags,
          published,
          featured,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        post,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error updating post',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { postId } = req.body;

      await Post.findByIdAndDelete(postId);

      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error deleting post',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
