export const LogoWhite = () => (
  <img
    src="/assets/logo/logo-white.png"
    alt="Clinzor"
    width={100}
    height={50}
    className="h-10 w-auto"
  />
);

const navigationLinks = [
  { title: "Home", href: "/" },
  { title: "Service", href: "/service" },
  { title: "Blog", href: "/blog" },
  { title: "About Us", href: "/about" },
  { title: "Contact Us", href: "/contact" }
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/clinzorofficial?igsh=MWd6anp5NXUyNHU0cA==",
    icon: (
      <path
        fill="currentColor"
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
      />
    )
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/clinzor/",
    icon: (
      <path
        fill="currentColor"
        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
      />
    )
  },
  {
    label: "Twitter/X",
    href: "https://x.com/clinzorofficial?s=21",
    icon: (
      <path
        fill="currentColor"
        d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
      />
    )
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@clinzor?si=4KEc0Ae4Wm-hHSuL",
    icon: (
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z"
      />
    )
  }
];

export default function FooterSection() {
  return (
    <footer className="bg-gradient-to-b from-[#1C3455] to-[#1C3455] pb-8 sm:px-6">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-white pt-16 pb-8">
          {/* Main Footer Content */}
          <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-5">
            {/* Logo and Description */}
            <div className="md:col-span-3 lg:col-span-2">
              <a href="/" aria-label="go home" className="inline-block mb-5">
                <LogoWhite />
              </a>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Your trusted partner in Physiotherapy. Finding the right care has
                never been easier.
              </p>
              
              {/* Contact Information */}
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:contact@clinzor.com" className="hover:text-white transition">
                    contact@clinzor.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+917411096006" className="hover:text-white transition">
                    +91 7411096006
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Mantri Web City, Kothanur<br />Bangalore, Karnataka</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1 lg:col-span-1">
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <nav className="space-y-3">
                {navigationLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    {link.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Connect With Us */}
            <div className="md:col-span-2 lg:col-span-2">
              <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
              <p className="text-gray-300 text-sm mb-5">
                Follow us on social media for health tips, updates, and more.
              </p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="transition"
                  >
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Clinzor. All rights reserved</p>
          {/* <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition">
              Terms of Service
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}