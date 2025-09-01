import React from 'react'
import { BlogDetailView } from '@/components/blog/BlogDetailView'
import { getABlog } from '@/service/user/blogPage'
import { NavbarDemo } from '@/components/landingpage/navbar/navbar'
import FooterSection from '@/components/landingpage/footer/footer'
import CommonHeroSection from '@/components/common/CommonHeroSection'

type BlogDetailedPageProps = {
    params: { id: string }
}

const BlogDetailedPage = async ({ params }: BlogDetailedPageProps) => {
    const post = await getABlog(params.id).catch(() => null)

    return (
        <div>
            {/* Navbar */}
            <NavbarDemo />
            
            {/* Hero section */}
            <section className="pb-10 md:pb-10">
                <CommonHeroSection className="h-[15vh]" />
            </section>

            <BlogDetailView post={post?.data} />

            {/* Footer */}
            <FooterSection />
        </div>
    )
}

export default BlogDetailedPage
