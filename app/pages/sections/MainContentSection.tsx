import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const MainContentSection = (): JSX.Element => {
  // Data for the feature cards
  const featureCards = [
    {
      icon: "/figmaAssets/vector.svg",
      iconWidth: "w-[43.75px]",
      iconHeight: "h-[40.62px]",
      title: "Mint",
      description: "A user mint an INFT.",
    },
    {
      icon: "/figmaAssets/vector-3.svg",
      iconWidth: "w-[43.73px]",
      iconHeight: "h-[43.73px]",
      title: "Interact",
      description:
        "The user interacts with the AI by leveraging the Atoma network.",
    },
    {
      icon: "/figmaAssets/vector-2.svg",
      iconWidth: "w-[39.06px]",
      iconHeight: "h-[46.88px]",
      title: "Generation",
      description: "NFT is created and updated via a smart contract.",
    },
  ];

  return (
    <section className="flex flex-col w-full max-w-[1230px] items-center gap-20 pb-[3.05e-05px] pt-0 px-[15px] relative">
      <div className="flex w-[790px] items-center justify-center relative" />

      <div className="relative w-full">
        {/* Decorative elements */}
        <img
          className="h-4 w-4 absolute top-[-116px] left-[111px]"
          alt="Circle png"
          src="/figmaAssets/circle-01-png-1.png"
        />

        <img
          className="absolute w-7 h-7 top-[282px] left-[-81px]"
          alt="X png"
          src="/figmaAssets/x-png-1.png"
        />

        <img
          className="absolute w-6 h-6 top-[287px] left-[1000px]"
          alt="Circle png"
          src="/figmaAssets/circle-02-png-1.png"
        />

        {/* Cards container */}
        <div className="flex flex-wrap gap-[0px_40px] justify-center">
          {featureCards.map((card, index) => (
            <Card
              key={index}
              className="w-[277.5px] rounded-3xl border border-solid border-[#e7e7e740] bg-transparent"
            >
              <CardContent className="flex flex-col items-start gap-[34px] px-8 py-12">
                <div className="flex w-[50px] items-start">
                  <img
                    className={`relative ${card.iconWidth} ${card.iconHeight}`}
                    alt={card.title}
                    src={card.icon}
                  />
                </div>

                <div className="flex flex-col w-[211.5px] items-start gap-[24px]">
                  <div className="w-full">
                    <h3 className="font-['Montserrat',Helvetica] font-semibold text-white text-[28px] leading-[30.8px]">
                      {card.title}
                    </h3>
                  </div>

                  <div className="w-full">
                    <p className="font-['Montserrat',Helvetica] font-normal text-[#ffffffa3] text-base leading-[27px]">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
