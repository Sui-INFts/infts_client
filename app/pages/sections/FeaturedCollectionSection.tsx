import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const FeaturedCollectionSection = (): JSX.Element => {
  // Collection data for mapping
  const collections = [
    {
      id: 1,
      image: "/figmaAssets/link---art-01-jpg.png",
      title: "#Metaverse",
      creator: "By TheSalvare",
    },
    {
      id: 2,
      image: "/figmaAssets/link---art-02-jpg.png",
      title: "#Polly Doll",
      creator: "By TheNative",
    },
    {
      id: 3,
      image: "/figmaAssets/link---art-03-jpg.png",
      title: "#Alec Art",
      creator: "By GeorgZvic",
    },
    {
      id: 4,
      image: "/figmaAssets/link---art-04-jpg.png",
      title: "#Toxic Poeth",
      creator: "By YazoiLup",
    },
  ];

  // Pagination dots data
  const paginationDots = [
    { active: true },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
  ];

  return (
    <section className="flex flex-col items-center gap-16 py-0 px-[15px]">
      <div className="flex w-full max-w-[1200px] items-center justify-center relative">
        <Carousel className="w-full">
          <CarouselContent className="flex items-start gap-12">
            {collections.map((collection) => (
              <CarouselItem key={collection.id} className="basis-1/4 pl-0">
                <Card className="border-none">
                  <CardContent className="flex flex-col items-start p-0">
                    <img
                      className="w-full h-[352px] object-cover"
                      alt={`${collection.title} artwork`}
                      src={collection.image}
                    />
                    <div className="flex flex-col items-center w-full gap-2.5 py-6 px-4">
                      <h3 className="font-['Montserrat',Helvetica] font-semibold text-white text-[28px] text-center leading-7 whitespace-nowrap">
                        {collection.title}
                      </h3>
                      <p className="font-['Montserrat',Helvetica] font-normal text-[#ffffffa3] text-[15px] text-center leading-6 whitespace-nowrap">
                        {collection.creator}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-[20px] border border-solid border-[#83838340] shadow-[0px_3px_8px_-1px_#00000014] opacity-40">
            <ChevronLeftIcon className="h-4 w-4 text-[#b7b4bb]" />
          </CarouselPrevious>

          <CarouselNext className="absolute -right-5 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-[20px] border border-solid border-[#83838340] shadow-[0px_3px_8px_-1px_#00000014]">
            <ChevronRightIcon className="h-4 w-4 text-[#b7b4bb]" />
          </CarouselNext>
        </Carousel>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-[22px]">
        {paginationDots.map((dot, index) => (
          <div
            key={`dot-${index}`}
            className={`w-2.5 h-2.5 bg-white rounded-[5px] ${dot.active ? "" : "opacity-30"}`}
          />
        ))}
      </div>

      {/* View all button */}
      <Button
        variant="outline"
        className="px-6 py-3 bg-white rounded-[44px] flex items-center gap-2 border-none"
      >
        <span className="font-['Montserrat',Helvetica] font-semibold text-[#3e4654] text-sm tracking-[-0.28px] leading-7 whitespace-nowrap">
          View all iNFTs
        </span>
        <ArrowUpRightIcon className="w-6 h-6" />
      </Button>
    </section>
  );
};
