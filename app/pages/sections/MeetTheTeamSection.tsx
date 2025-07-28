import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const MeetTheTeamSection = (): JSX.Element => {
  // Decorative elements data for easier mapping
  const decorativeElements = [
    {
      className: "absolute w-4 h-[17px] top-[51px] left-[97px]",
      alt: "Circle png",
      src: "/figmaAssets/circle-01-png-3.png",
    },
    {
      className: "absolute w-8 h-[34px] top-[205px] left-[193px]",
      alt: "Dcoin png",
      src: "/figmaAssets/dcoin-png.png",
    },
    {
      className: "absolute w-6 h-[23px] top-[51px] left-[983px]",
      alt: "X png",
      src: "/figmaAssets/x-png-3.png",
    },
    {
      className: "absolute w-11 h-11 top-[220px] left-[1059px]",
      alt: "Ethereum png",
      src: "/figmaAssets/ethereum-02-png.png",
    },
  ];

  return (
    <Card className="relative w-full px-[57px] py-[61px] rounded-[32px] border border-solid border-[#f3f3f340]">
      {/* Decorative elements */}
      {decorativeElements.map((element, index) => (
        <img
          key={`decorative-element-${index}`}
          className={element.className}
          alt={element.alt}
          src={element.src}
        />
      ))}

      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center">
          <p className="text-center font-medium text-base text-[#ffffffa3] tracking-[-0.32px] leading-8 font-['Montserrat',Helvetica] mb-4">
            Subscribe to our super-rare and exclusive newsletter.
          </p>

          <div className="flex items-center justify-center gap-2.5 mt-4 max-w-[510px] w-full">
            <div className="flex-1 bg-[#ffffff0a] rounded-[44px] px-6 py-2">
              <Input
                className="border-0 bg-transparent font-['Montserrat',Helvetica] font-semibold text-[#ffffff52] text-sm tracking-[-0.28px] leading-7 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#ffffff52]"
                placeholder="Enter your email"
              />
            </div>

            <Button className="bg-white text-[#3e4654] hover:bg-white/90 rounded-[44px] px-6 py-2 font-['Montserrat',Helvetica] font-semibold text-sm tracking-[-0.28px] leading-7">
              Subscribe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
