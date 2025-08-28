import React from 'react'
import { BlogDetailView } from '@/components/blog/BlogDetailView'
import { getABlog } from '@/service/user/blogPage'
import { NavbarDemo } from '@/components/landingpage/navbar/navbar'
import FooterSection from '@/components/landingpage/footer/footer'

type BlogDetailedPageProps = {
    params: { id: string } // from dynamic route
}

const BlogDetailedPage = async ({ params }: BlogDetailedPageProps) => {
    const post = await getABlog(params.id).catch(() => null)

    return (
        <div>
            {/* Navbar */}
            <NavbarDemo />

            <BlogDetailView post={post?.data} />

            {/* Footer */}
            <FooterSection />
        </div>
    )
}

export default BlogDetailedPage
