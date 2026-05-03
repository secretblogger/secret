# Secret Blog

A modern, feature-rich blog website built with Next.js, TypeScript, and MongoDB.

## Features

- ✅ **Public Blog** - Read published posts without authentication
- ✅ **User Authentication** - Optional sign-in/registration system
- ✅ **Comments Section** - Readers can leave comments (with approval system)
- ✅ **Admin Panel** - Manage posts, comments, and moderation
- ✅ **Search Functionality** - Search posts by title, content, and tags
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- ✅ **View Tracking** - Track post views and engagement

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js with bcrypt
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone https://github.com/secretblogger/secret.git
cd secret
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file and configure:
```
MONGODB_URI=mongodb://localhost:27017/secret-blog
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
.
├── models/              # MongoDB models (User, Post, Comment, SearchLog)
├── pages/
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── posts/      # Post management endpoints
│   │   ├── admin/      # Admin panel endpoints
│   │   └── search.ts   # Search functionality
│   ├── admin.tsx       # Admin dashboard
│   ├── blog/
│   │   └── [slug].tsx  # Individual blog post page
│   ├── index.tsx       # Home page with post listing
│   ├─��� login.tsx       # Login page
│   ├── register.tsx    # Registration page
│   └── _app.tsx        # Next.js app wrapper
├── lib/
│   └── mongodb.ts      # Database connection
├── styles/
│   └── globals.css     # Global styles
└── public/             # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all published posts with search
- `GET /api/posts/[slug]` - Get single post
- `POST /api/admin/posts` - Create post (admin only)
- `PUT /api/admin/posts` - Update post (admin only)
- `DELETE /api/admin/posts` - Delete post (admin only)

### Comments
- `POST /api/posts/[slug]/comments` - Create comment
- `GET /api/admin/comments` - Get all comments (admin only)
- `PUT /api/admin/comments` - Approve/reject comment (admin only)
- `DELETE /api/admin/comments` - Delete comment (admin only)

### Search
- `GET /api/search?q=query` - Search posts

## Usage

### For Readers
1. Browse posts on the home page
2. Click on any post to read full content
3. Leave comments (as guest or registered user)
4. Search for posts using the search bar
5. (Optional) Create an account to track comments

### For Admins
1. Register/login with admin account
2. Access admin dashboard at `/admin`
3. Create, edit, and publish posts
4. Approve/reject pending comments
5. View post analytics (views, comments)

## Environment Variables

Required environment variables in `.env.local`:

```
MONGODB_URI=<your-mongodb-uri>
NEXTAUTH_SECRET=<random-secret-string>
NEXTAUTH_URL=http://localhost:3000
```

## Next Steps

- [ ] Add image uploads for posts
- [ ] Implement email notifications
- [ ] Add post categories
- [ ] Create RSS feed
- [ ] Add social media sharing
- [ ] Implement dark mode
- [ ] Add analytics dashboard
- [ ] Set up automated testing
- [ ] Deploy to production

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for personal and commercial purposes.
