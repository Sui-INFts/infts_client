import { CheckIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const UseCasesSection = (): React.ReactElement => {
  // Define use case data for mapping
  const useCases = [
    {
      id: 1,
      title: "Credit & Lending",
      gradient:
        "bg-[linear-gradient(135deg,rgba(21,192,234,1)_0%,rgba(80,126,223,1)_100%)]",
      points: [
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">INFTs act as </span>
              <span className="font-medium text-white">
                soulbound credit agents.
              </span>
            </>
          ),
        },
        {
          text: "Credit scores evolve via on-chain transactions and behavioral tasks.",
        },
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">
                Lending dApps can plug into INFT&apos;s API to make{" "}
              </span>
              <span className="font-medium text-white">
                automated loan decisions.
              </span>
            </>
          ),
        },
      ],
    },
    {
      id: 2,
      title: "Education & Health",
      gradient:
        "bg-[linear-gradient(134deg,rgba(114,73,238,1)_0%,rgba(107,67,198,1)_100%)]",
      points: [
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">INFTs can be </span>
              <span className="font-medium text-white">
                learning companions,
              </span>
              <span className="text-[#ffffffa3]">
                {" "}
                storing progress, verifying course completions.
              </span>
            </>
          ),
        },
        {
          text: "In healthcare, INFTs may act as secure patient agents for data access (with permission).",
        },
      ],
    },
    {
      id: 3,
      title: "AI Wallet Agents",
      gradient:
        "bg-[linear-gradient(134deg,rgba(249,96,107,1)_0%,rgba(232,54,63,1)_100%)]",
      points: [
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">Each INFT can act as a </span>
              <span className="font-medium text-white">
                smart wallet companion.
              </span>
            </>
          ),
        },
        {
          text: "AI evaluates risk, optimizes DeFi strategies, and even offers personalized tips.",
        },
      ],
    },
    {
      id: 4,
      title: "SocialFi & Missions",
      gradient:
        "bg-[linear-gradient(134deg,rgba(38,225,88,1)_0%,rgba(1,146,49,1)_100%)]",
      points: [
        {
          text: "Protocols can onboard users through tiered INFT missions.",
        },
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">Users complete </span>
              <span className="font-medium text-white">engagement tasks</span>
              <span className="text-[#ffffffa3]">
                {" "}
                (e.g., staking, quizzes) to level up their INFTs.
              </span>
            </>
          ),
        },
      ],
    },
    {
      id: 5,
      title: "Digital Identity",
      gradient:
        "bg-[linear-gradient(135deg,rgba(21,192,234,1)_0%,rgba(80,126,223,1)_100%)]",
      points: [
        {
          text: (
            <>
              <span className="text-[#ffffffa3]">Serve as </span>
              <span className="font-medium text-white">
                on-chain, verifiable, evolving identity
              </span>
              <span className="text-[#ffffffa3]">
                {" "}
                with emotion/personality layers.
              </span>
            </>
          ),
        },
        {
          text: "Integrate into KYC-lite services and DAO onboarding flows.",
        },
      ],
    },
    {
      id: 6,
      title: "Gaming & Metaverse",
      gradient:
        "bg-[linear-gradient(134deg,rgba(114,73,238,1)_0%,rgba(107,67,198,1)_100%)]",
      points: [
        {
          text: "INFTs can evolve with gameplay or user choices.",
        },
        {
          text: "Traits, lore, or skills change based on in-game interactions or external actions.",
        },
      ],
    },
    {
      id: 7,
      title: "Marketplace & Collectibles",
      gradient:
        "bg-[linear-gradient(134deg,rgba(249,96,107,1)_0%,rgba(232,54,63,1)_100%)]",
      points: [
        {
          text: "Trade INFTs with full history, interaction scores, and personality states.",
        },
        {
          text: "Tokenized trainers or collectible characters evolve through usage.",
        },
      ],
    },
  ];

  return (
    <section className="flex flex-col items-center gap-20 py-10 px-4 w-full max-w-7xl mx-auto relative">
      <div className="flex flex-col gap-4 max-w-3xl items-center justify-center text-center">
        <p className="font-['Montserrat',Helvetica] font-medium text-white text-base">
          INFTs are versatile and programmable.
          <br />
          Here&apos;s how developers, protocols, and users can utilize them:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        {useCases.map((useCase) => (
          <Card
            key={useCase.id}
            className="flex flex-col items-start gap-10 p-8 rounded-[32px] border border-solid border-[#fcfcfc57] bg-transparent"
          >
            <div className={`w-10 h-10 rounded-[20px] ${useCase.gradient}`} />

            <h3 className="font-['Montserrat',Helvetica] font-bold text-white text-[32px] leading-normal w-full">
              {useCase.title}
            </h3>

            <Separator className="w-20 h-px bg-[#fcfcfc57]" />

            <CardContent className="flex flex-col items-start gap-6 p-0 w-full">
              {useCase.points.map((point, index) => (
                <div key={index} className="flex items-start gap-2 w-full">
                  <div className="flex-shrink-0">
                    <CheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="mt-[-1px] font-['Montserrat',Helvetica] text-base leading-normal text-[#ffffffa3]">
                    {point.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decorative elements */}
      <img
        className="h-4 w-4 absolute top-[620px] left-1/2 -translate-x-1/2"
        alt="Circle png"
        src="/figmaAssets/circle-01-png-2.png"
      />

      <img
        className="w-7 h-7 absolute bottom-4 left-16"
        alt="X png"
        src="/figmaAssets/x-png-2.png"
      />

      <img
        className="w-6 h-6 absolute bottom-4 right-16"
        alt="Circle png"
        src="/figmaAssets/circle-02-png-2.png"
      />
    </section>
  );
};
