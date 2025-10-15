// Import the necessary module from 'next/link'
import Link from "next/link";
import React from "react";

// Define the prop types for your component
interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  // Custom properties go here
  to: string;
  children: React.ReactNode;
}

// Define your button component
const ButtonLink: React.FC<ButtonProps> = ({ to, children }) => {
  return (
    <Link href={to}>
      <button className="border">{children}</button>
    </Link>
  );
};

export default ButtonLink;
