import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export const HowItWorksSection = (): JSX.Element => {
  // Team members data for easier mapping
  const teamMembers = [
    {
      name: "Joseph",
      role: "Product Manager",
      image: "/figmaAssets/02-png.png",
    },
    {
      name: "Sadiq",
      role: "Blockchain Engineer",
      image: "/figmaAssets/03-png.png",
    },
    {
      name: "Samkitsoni",
      role: "Full-stack Engineer",
      image: "/figmaAssets/01-png.png",
    },
    {
      name: "D. Aslam",
      role: "Product Designer",
      image: "/figmaAssets/03-png-1.png",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-[75px] w-full max-w-[1230px]">
      <div className="w-full max-w-[790px] flex items-center justify-center" />

      <div className="w-full flex flex-wrap items-start justify-center">
        {teamMembers.map((member, index) => (
          <div
            key={`team-member-${index}`}
            className={`flex w-full max-w-[307.5px] items-start px-[15px] py-[30px] ${
              index % 2 !== 0 ? "pb-[60px] pt-0" : ""
            }`}
          >
            <Card className="flex flex-col w-[277.5px] items-center bg-transparent border-none">
              <CardContent className="p-0">
                <div className="flex max-w-40 w-40 items-center justify-center p-[9px] bg-[#ffffff33] rounded-[32px] border border-solid border-[#ffffff40]">
                  <Avatar className="w-[142px] h-[142px] rounded-none">
                    <AvatarImage
                      src={member.image}
                      alt={`${member.name} profile`}
                      className="object-cover w-full h-full"
                    />
                  </Avatar>
                </div>

                <div className="relative w-[277.5px] h-[147px]">
                  <div className="absolute h-[22px] top-[23px] left-0 right-0 [font-family:'Montserrat',Helvetica] font-semibold text-white text-[22px] text-center tracking-[0] leading-[22px]">
                    {member.name}
                  </div>

                  <div className="absolute h-4 top-[60px] left-0 right-0 [font-family:'Montserrat',Helvetica] font-normal text-[#ffffffa3] text-[15px] text-center tracking-[0] leading-4">
                    {member.role}
                  </div>

                  <div className="absolute w-[230px] h-4 top-[107px] left-6 flex justify-center space-x-8">
                    <div className="inline-flex items-start">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Font_Awesome_5_Brands-Regular',Helvetica] font-normal text-white text-[15px] text-center tracking-[0] leading-[15px]"></div>
                    </div>
                    <div className="inline-flex items-start">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Font_Awesome_5_Brands-Regular',Helvetica] font-normal text-white text-[15px] text-center tracking-[0] leading-[15px]"></div>
                    </div>
                    <div className="inline-flex items-start">
                      <div className="relative w-fit mt-[-1.00px] [font-family:'Font_Awesome_5_Brands-Regular',Helvetica] font-normal text-white text-[15px] text-center tracking-[0] leading-[15px]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
