import Image from "next/image";
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex-1 flex justify-center items-center w-full">
      <div className="relative w-24 h-24 animate-bounce">
        <Image src="/images/Logo.svg" alt="Logo" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};

export default LoadingScreen;
