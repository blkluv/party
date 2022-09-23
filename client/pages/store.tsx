import { Button } from "@conorroberts/beluga";
import { NextPage } from "next";
import MerchItem from "~/components/MerchItem";
import MetaData from "~/components/MetaData";

const Page: NextPage = () => {
  return (
    <div className="mx-auto max-w-5xl w-full flex flex-col gap-8 py-8">
      <MetaData title="Store" />
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-bold text-xl text-center sm:text-2xl md:text-3xl">Merch</h1>
        <a href="https://buy.stripe.com/00g5kZ1dw02A8ak6oq" target="_blank">
          <Button variant="filled" color="gray" rounded>
            Buy Merch
          </Button>
        </a>
      </div>
      <div className="flex flex-wrap gap-4 md:gap-8 items-center justify-center">
        <MerchItem
          images={["/images/merch/hoco_male_black_shirt_front.jpg", "/images/merch/hoco_male_black_shirt_back.jpg"]}
          name="2022 Guelph Hoco Black Tie Dye Shirt (Male)"
          price={40}
        />
        <MerchItem
          images={[
            "/images/merch/hoco_female_animal_spirit_shirt_front.jpg",
            "/images/merch/hoco_female_animal_spirit_shirt_back.jpg",
          ]}
          name="2022 Guelph Hoco Party Animal Spirit Tie Dye Shirt (Female)"
          price={40}
        />
        <MerchItem
          images={["/images/merch/hoco_female_black_shirt_front.jpg", "/images/merch/hoco_female_black_shirt_back.jpg"]}
          name="2022 Guelph Hoco Black Tie Dye Shirt (Female)"
          price={40}
        />
        <MerchItem
          images={[
            "/images/merch/hoco_female_spirit_shirt_front.jpg",
            "/images/merch/hoco_female_spirit_shirt_back.jpg",
          ]}
          name="2022 Guelph Hoco Spirit Tie Dye Shirt (Female)"
          price={40}
        />
        <MerchItem
          images={["/images/merch/hoco_male_animal_shirt_front.jpg", "/images/merch/hoco_male_animal_shirt_back.jpg"]}
          name="2022 Guelph Hoco Party Animal Tie Dye Shirt (Male)"
          price={40}
        />
        <MerchItem
          images={["/images/merch/hoco_male_spidr_shirt_front.jpg", "/images/merch/hoco_male_spidr_shirt_back.jpg"]}
          name="2022 Guelph Hoco Spidr Tie Dye Shirt (Male)"
          price={40}
        />
        <MerchItem
          images={["/images/merch/hoco_male_animal_spirit_shirt_front.jpg", "/images/merch/hoco_male_animal_spirit_shirt_back.jpg"]}
          name="2022 Guelph Hoco Spirit Tie Dye Shirt (Male)"
          price={40}
        />
      </div>
    </div>
  );
};

export default Page;
