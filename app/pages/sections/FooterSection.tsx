import React from "react";
import { Separator } from "@/components/ui/separator";

export const FooterSection = (): JSX.Element => {
  // Footer link data for mapping
  const footerLinks = [
    {
      title: "Quick Links",
      links: ["Home", "Profile", "Marketplace"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Feedback", "Blog"],
    },
  ];

  return (
    <footer className="flex flex-col items-center gap-10 pt-20 pb-10 px-20 w-full">
      <div className="flex justify-between w-full">
        {/* Logo and description */}
        <div className="flex flex-col w-80 items-start gap-5">
          <img
            className="w-10 h-[39px] object-cover"
            alt="Logo"
            src="/figmaAssets/logo-1.png"
          />
          <p className="font-['Montserrat',Helvetica] font-medium text-[#ffffffa3] text-sm tracking-[-0.28px] leading-[22.4px]">
            Intellgient NFTs that Learn. Evolve and remember you on Sui
            blockchain.
          </p>
        </div>

        {/* Footer links section */}
        <div className="flex items-start justify-end gap-20">
          {/* Map through the footer links data */}
          {footerLinks.map((section, index) => (
            <div
              key={`section-${index}`}
              className="flex flex-col items-start gap-6"
            >
              <h3 className="font-['Montserrat',Helvetica] font-semibold text-white text-sm tracking-[-0.28px] leading-[22.4px]">
                {section.title}
              </h3>
              <div className="flex flex-col items-start gap-4">
                {section.links.map((link, linkIndex) => (
                  <a
                    key={`link-${linkIndex}`}
                    href="#"
                    className="font-['Montserrat',Helvetica] font-medium text-[#ffffffa3] text-sm tracking-[-0.28px] leading-[22.4px]"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* Connect section with social links */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="font-['Montserrat',Helvetica] font-semibold text-white text-sm tracking-[-0.28px] leading-[22.4px]">
              Connect
            </h3>
            <img alt="Social Links" src="/figmaAssets/links.svg" />
          </div>
        </div>
      </div>

      {/* Separator line */}
      <Separator className="w-full bg-[#ffffff33]" />

      {/* Copyright text */}
      <p className="font-['Montserrat',Helvetica] font-medium text-[#ffffffa3] text-sm tracking-[-0.28px] leading-[22.4px]">
        © 2025 INFTs Protocol. All rights reserved.
      </p>
    </footer>
  );
};
