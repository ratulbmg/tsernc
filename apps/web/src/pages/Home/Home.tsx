import React from "react";
import { cn } from "../../utils";

const Home: React.FC = () => {
  return (
    <div
      className={cn(
        "m-auto w-full min-h-screen h-full flex justify-center items-center bg-home-background dark:bg-home-background-dark",
      )}
    >
      <div
        className={cn(
          "w-auto h-auto flex justify-center items-center flex-col gap-8 px-2",
        )}
      >
        <h1
          className={cn(
            "text-center text-text-300 dark:text-text-dark-100 text-[clamp(30px,9vw,72px)] capitalize font-bold",
          )}
        >
          This is a scleton of a<br className="hidden sm:block" /> React Website
        </h1>
      </div>
    </div>
  );
};

export default Home;
