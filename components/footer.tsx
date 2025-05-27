"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../assets/logo/Logo.png";

export default function FooterSection() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" aria-label="go home" className="inline-block">
              <Image
                className="h-8 w-8"
                src={Logo}
                alt="Logo"
                height={32}
                width={32}
                priority
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Intelligent NFTs that Learn, Evolve and remember you on Sui blockchain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/comingsoon" className="text-muted-foreground hover:text-primary transition-colors">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://gigantic-filament-cf8.notion.site/INFTs-Protocol-1bbfa3d81a4880e7996cd616a4e17cc5" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="https://docs.google.com/forms/d/e/1FAIpQLSf2LTv-LwtA_hsPRNawxB6nSlCIZeECal9uUtbA_Jht5F6cTA/viewform" className="text-muted-foreground hover:text-primary transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="https://inftsprotocol.medium.com/" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://x.com/inftsprotocol?s=21"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X/Twitter"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                  />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/inftsprotocol/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                  />
                </svg>
              </Link>
              <Link
                href="https://discord.gg/dnZxx8bHHN"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} INFTs Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}