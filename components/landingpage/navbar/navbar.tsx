"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu
} from "./navbarhelper";
import { useState } from "react";

export function NavbarDemo() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Service", link: "/service" },
    { name: "Blog", link: "/blog" },
    { name: "About us", link: "/aboutus" },
    { name: "Contact us", link: "/contact-us" }
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      <NavBody>
        <NavItems items={navItems} visible={isMobileMenuOpen ? true : false} />
        <div className="flex items-center gap-4">
          <NavbarButton href={"/auth"}>Login</NavbarButton>
          <NavbarButton href={"/booking"} variant="primary">
            Book a call
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <></>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-black text-lg font-bold px-4 py-2"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              href={"/auth"}
              variant="primary"
              className="w-full cursor-pointer"
            >
              Login
            </NavbarButton>
            <NavbarButton
              href={"/booking"}
              variant="primary"
              className="w-full"
            >
              Book a call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
