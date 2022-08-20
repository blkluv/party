import React from "react";
import { LoadingIcon } from "./Icons";

const LoadingScreen = () => {
  return (
    <div className="flex-1 flex justify-center items-center w-full">
      <LoadingIcon className="text-white animate-spin" size={35} />
    </div>
  );
};

export default LoadingScreen;
