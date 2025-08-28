import { BlogDetailView } from '@/components/blog/BlogDetailView'
import React from 'react'

const BlogDetailedPage = ({ post, savedPosts, goBack, toggleSavePost, blogPosts, handleReadMore }) => {
    return (
        <div>
            <BlogDetailView
                post={blogPosts.find((p) => p.id === currentPostId)}
                savedPosts={savedPosts}
                toggleSavePost={toggleSavePost}
                goBack={goBack}
                blogPosts={blogPosts}
                handleReadMore={handleReadMore}
            />
        </div>
    )
}

export default BlogDetailedPage
