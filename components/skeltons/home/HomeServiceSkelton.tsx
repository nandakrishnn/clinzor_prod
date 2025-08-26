import CardTwoSkeleton from "./HomeServiceCardSketon";

const TitleSkeleton = () => (
  <div className="text-center mb-8 md:mb-16 animate-pulse">
    <div className="h-8 bg-gray-300 rounded-md w-1/3 mx-auto mb-4"></div>
    <div className="h-4 bg-gray-300 rounded-md w-2/3 mx-auto"></div>
    <div className="h-4 bg-gray-300 rounded-md w-1/2 mx-auto mt-2"></div>
  </div>
);

export const CardSkelton = () => {
  return (
    <section className="overflow-hidden">
      <div className="@container mx-auto max-w-7xl px-6 ">
        <TitleSkeleton />

        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-16">
          <CardTwoSkeleton count={6} />
        </div>

        <div className="flex items-center justify-center w-full mt-8">
          <div className="bg-gray-300 p-2.5 text-sm rounded-full px-10 h-10 w-32"></div>
        </div>
      </div>
    </section>
  );
};
