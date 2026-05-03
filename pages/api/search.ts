import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import SearchLog from '@/models/SearchLog';
import Post from '@/models/Post';

type ResponseData = {
  success: boolean;
  results?: any[];
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
      const { q, userId } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
      }

      // Search posts
      const results = await Post.find({
        published: true,
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } },
        ],
      })
        .select('title slug excerpt viewCount createdAt')
        .limit(20)
        .lean();

      // Log search
      await SearchLog.create({
        query: q,
        results: results.length,
        user: userId || null,
      });

      res.status(200).json({
        success: true,
        results,
        total: results.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error performing search',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}
