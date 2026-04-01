import type { JSX } from "react";
import type { ServiceVisualType } from "@/data/services";

export default function ServiceVisual({
  visual,
}: {
  visual: ServiceVisualType;
}): JSX.Element {
  if (visual === "windows") {
    return (
      <div className="flex h-full items-center justify-center overflow-hidden rounded-xl pb-2">
        <div className="relative h-[11.75rem] w-full max-w-[16rem]">
          <div className="service-window absolute right-0 top-0 h-[146px] w-[210px] bg-gradient-to-tr from-black/20 to-gray-600/20">
            <div className="h-full w-full">
              <div className="h-6 w-full border-b border-white/8">
                <svg data-fill="true" fill="none" height="60" viewBox="145 5 300 80" width="160">
                  <circle cx="175" cy="8.5" fill="red" opacity="0.2" r="8" />
                  <circle cx="200" cy="8.5" fill="gold" opacity="0.3" r="8" />
                  <circle cx="225" cy="8.5" fill="green" opacity="0.2" r="8" />
                </svg>
              </div>
              <div className="flex h-full w-full items-center justify-center pb-3">
                <svg data-fill="true" fill="none" height="88" viewBox="0 0 184 88" width="184">
                  <circle cx="174" cy="8.5" fill="white" opacity="0.2" r="8" />
                  <path
                    d="M36.5858 4.91421L0.585786 40.9142C0.210714 41.2893 0 41.798 0 42.3284V85.5C0 86.6046 0.89543 87.5 2 87.5H182C183.105 87.5 184 86.6046 184 85.5V50.8284C184 49.0466 181.846 48.1543 180.586 49.4142L179.586 50.4142C179.211 50.7893 179 51.298 179 51.8284V59.1716C179 59.702 178.789 60.2107 178.414 60.5858L177.586 61.4142C177.211 61.7893 176.702 62 176.172 62H165.328C164.798 62 164.289 62.2107 163.914 62.5858L155.914 70.5858C155.133 71.3668 153.867 71.3668 153.086 70.5858L133.914 51.4142C133.133 50.6332 131.867 50.6332 131.086 51.4142L127.914 54.5858C127.133 55.3668 125.867 55.3668 125.086 54.5858L119 48.5L90.4142 19.9142C89.6332 19.1332 88.3668 19.1332 87.5858 19.9142L72.4142 35.0858C71.6332 35.8668 70.3668 35.8668 69.5858 35.0858L39.4142 4.91421C38.6332 4.13317 37.3668 4.13316 36.5858 4.91421Z"
                    fill="white"
                    opacity="0.2"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="service-window absolute right-16 top-11 h-[118px] w-[174px] bg-gradient-to-bl from-black/20 to-gray-600/20">
            <div className="h-full w-full">
              <div className="h-6 w-full border-b border-white/8">
                <svg data-fill="true" fill="none" height="60" viewBox="145 5 300 80" width="160">
                  <circle cx="175" cy="8.5" fill="red" opacity="0.2" r="8" />
                  <circle cx="200" cy="8.5" fill="gold" opacity="0.3" r="8" />
                  <circle cx="225" cy="8.5" fill="green" opacity="0.2" r="8" />
                </svg>
              </div>
              <div className="flex h-full w-full items-center justify-center px-3 pb-6">
                <svg data-fill="true" fill="none" height="88" viewBox="0 0 184 88" width="184">
                  <circle cx="174" cy="8.5" fill="white" opacity="0.2" r="8" />
                  <path
                    d="M36.5858 4.91421L0.585786 40.9142C0.210714 41.2893 0 41.798 0 42.3284V85.5C0 86.6046 0.89543 87.5 2 87.5H182C183.105 87.5 184 86.6046 184 85.5V50.8284C184 49.0466 181.846 48.1543 180.586 49.4142L179.586 50.4142C179.211 50.7893 179 51.298 179 51.8284V59.1716C179 59.702 178.789 60.2107 178.414 60.5858L177.586 61.4142C177.211 61.7893 176.702 62 176.172 62H165.328C164.798 62 164.289 62.2107 163.914 62.5858L155.914 70.5858C155.133 71.3668 153.867 71.3668 153.086 70.5858L133.914 51.4142C133.133 50.6332 131.867 50.6332 131.086 51.4142L127.914 54.5858C127.133 55.3668 125.867 55.3668 125.086 54.5858L119 48.5L90.4142 19.9142C89.6332 19.1332 88.3668 19.1332 87.5858 19.9142L72.4142 35.0858C71.6332 35.8668 70.3668 35.8668 69.5858 35.0858L39.4142 4.91421C38.6332 4.13317 37.3668 4.13316 36.5858 4.91421Z"
                    fill="white"
                    opacity="0.2"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="service-window absolute left-0 top-[4.15rem] h-[112px] w-[72px] bg-gradient-to-bl from-black/20 to-gray-600/20">
            <div className="h-full w-full">
              <div className="h-6 w-full border-b border-white/8" />
              <div className="flex h-full w-full items-center justify-center px-1 pb-0">
                <svg data-fill="true" fill="none" height="88" viewBox="0 0 184 88" width="184">
                  <circle cx="174" cy="8.5" fill="white" opacity="0.2" r="8" />
                  <path
                    d="M36.5858 4.91421L0.585786 40.9142C0.210714 41.2893 0 41.798 0 42.3284V85.5C0 86.6046 0.89543 87.5 2 87.5H182C183.105 87.5 184 86.6046 184 85.5V50.8284C184 49.0466 181.846 48.1543 180.586 49.4142L179.586 50.4142C179.211 50.7893 179 51.298 179 51.8284V59.1716C179 59.702 178.789 60.2107 178.414 60.5858L177.586 61.4142C177.211 61.7893 176.702 62 176.172 62H165.328C164.798 62 164.289 62.2107 163.914 62.5858L155.914 70.5858C155.133 71.3668 153.867 71.3668 153.086 70.5858L133.914 51.4142C133.133 50.6332 131.867 50.6332 131.086 51.4142L127.914 54.5858C127.133 55.3668 125.867 55.3668 125.086 54.5858L119 48.5L90.4142 19.9142C89.6332 19.1332 88.3668 19.1332 87.5858 19.9142L72.4142 35.0858C71.6332 35.8668 70.3668 35.8668 69.5858 35.0858L39.4142 4.91421C38.6332 4.13317 37.3668 4.13316 36.5858 4.91421Z"
                    fill="white"
                    opacity="0.2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visual === "pulse") {
    return (
      <div className="relative flex h-48 w-full items-center justify-center overflow-hidden">
        <div className="service-pulse-ring service-pulse-ring-outer" />
        <div className="service-pulse-ring service-pulse-ring-inner" />
        <div className="service-pulse-core" />
      </div>
    );
  }

  return (
    <div className="service-workflow h-48 w-full">
      <div className="service-workflow-row">
        <span className="service-node service-node-active" />
        <div className="service-line" />
        <span className="service-node" />
        <div className="service-line service-line-dim" />
      </div>
      <div className="service-workflow-panel">
        <div className="service-workflow-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="space-y-3 px-4 py-4">
          <div className="service-workflow-log w-[82%]" />
          <div className="service-workflow-log w-[68%]" />
          <div className="service-workflow-log w-[76%]" />
        </div>
      </div>
    </div>
  );
}
