import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: { username: string; email: string };
  createdAt: string;
  viewCount: number;
}

interface Comment {
  _id: string;
  guestName?: string;
  user?: { username: string };
  content: string;
  createdAt: string;
}

const BlogPost: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    guestName: '',
    guestEmail: '',
    content: '',
  });
  const [user, setUser] = useState<any>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/posts/${slug}`);
      setPost(res.data.post);
      setComments(res.data.comments);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.content) return;

    try {
      setSubmittingComment(true);
      await axios.post(`/api/posts/${slug}/comments`, {
        userId: user?.id || null,
        guestName: commentForm.guestName || null,
        guestEmail: commentForm.guestEmail || null,
        content: commentForm.content,
      });
      setCommentForm({ guestName: '', guestEmail: '', content: '' });
      alert('Comment submitted for review!');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Posts
          </Link>
        </nav>
      </header>

      {/* Post Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex justify-between text-gray-600 mb-8 pb-8 border-b">
            <div>
              <p className="font-medium">By {post.author.username}</p>
              <p className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{post.viewCount} views</p>
              <p className="text-sm">{comments.length} comments</p>
            </div>
          </div>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 pb-8 border-b">
            {!user && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={commentForm.guestName}
                      onChange={(e) =>
                        setCommentForm({
                          ...commentForm,
                          guestName: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={commentForm.guestEmail}
                      onChange={(e) =>
                        setCommentForm({
                          ...commentForm,
                          guestEmail: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                value={commentForm.content}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, content: e.target.value })
                }
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Share your thoughts..."
              />
            </div>
            <button
              type="submit"
              disabled={submittingComment}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              {submittingComment ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-l-4 border-blue-600 pl-4">
                  <p className="font-medium text-gray-900">
                    {comment.user?.username || comment.guestName}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
