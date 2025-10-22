/**
 * ✨ BottomBorderAnimation Component
 *
 * Renders a subtle animated bottom border effect that appears on hover.
 * Commonly used as a decorative underline for links or text elements.
 *
 * @component
 * @example
 * ```tsx
 * <div className="relative">
 *   <p>Hover me</p>
 *   <BottomBorderAnimation />
 * </div>
 * ```
 *
 * @remarks
 * The animation is implemented using Tailwind CSS pseudo-elements (`before:`).
 * The border expands horizontally from 0% to 100% width with a smooth transition.
 */


export default function BottomBorderAnimation() {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
      <div
        className="before:ease-in-expo relative h-full w-full
                  before:absolute before:-bottom-px before:w-0 before:border-0 
                  before:border-content-1 before:transition-all before:duration-300
                  hover:before:w-full hover:before:border-b
                  "
      />
    </div>
  );
}
