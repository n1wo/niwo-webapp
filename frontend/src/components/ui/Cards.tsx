import { ReactNode } from "react";

interface CardProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  // Custom properties go here
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="flex flex-col  h-full w-full border rounded-xl border-borderc-1/60 p-6 justify-center bg-bkg-2 transition-opacity duration-700 hover:border-borderc-1/80  hover:bg-gradient-to-t from-bkg-3/10">
      {/* Show Case */}
      {children}
    </div>
  );
};

export default Card;
