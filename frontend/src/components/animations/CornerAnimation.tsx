export default function CornerAnimation() {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        className="before:border-content before:ease-in-expo after:border-content after:ease-in-expo 
        relative z-0 h-full w-full before:absolute before:-bottom-1 
        before:-right-2 before:h-2 before:w-2 before:border-b before:border-r 
        before:transition-all before:duration-300
        after:absolute after:-left-2 
        after:-top-1 after:h-2 after:w-2 after:border-l after:border-t after:transition-all after:duration-300 hover:before:h-[calc(100%+8px)]
        hover:before:w-[calc(100%+16px)]  hover:after:h-[calc(100%+8px)] 
        hover:after:w-[calc(100%+16px)]"
      />
    </div>
  );
}
