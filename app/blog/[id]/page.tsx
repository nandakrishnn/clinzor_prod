import React from 'react'
import { BlogDetailView } from '@/components/blog/BlogDetailView'
import { getABlog } from '@/service/user/blogPage'
import { NavbarDemo } from '@/components/landingpage/navbar/navbar'
import FooterSection from '@/components/landingpage/footer/footer'

type BlogDetailedPageProps = {
    params: { id: string } // from dynamic route
}

const BlogDetailedPage = async ({ params }: BlogDetailedPageProps) => {

    console.log(params)
    const post = await getABlog(params.id).catch(() => null)

    console.log(post, "detailed view of a blog")

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
