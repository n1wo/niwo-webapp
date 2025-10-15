export default function BottomBorderAnimation() {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        className="before:ease-in-expo relative h-full w-full
                  before:absolute before:-bottom-1 before:w-0 before:border-0 
                  before:border-content-1 before:transition-all before:duration-300
                  hover:before:w-full hover:before:border-b
                  "
      />
    </div>
  );
}
