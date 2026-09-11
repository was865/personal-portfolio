import React from "react";
import { IoDocumentText, IoLogoGithub, IoLogoLinkedin, IoMail } from "react-icons/io5";

import { Dock, DockIcon } from "@/components/Dock";
import { siteConfig } from "@/config/site";

export type IconProps = React.HTMLAttributes<SVGElement>;

interface DockDemoProps {
  resumeUrl: string;
}

export function DockDemo({ resumeUrl }: DockDemoProps) {
  return (
    // グリッドのドラッグを止めたいだけなので button である必要はない。
    // button の中に link を入れるのは不正な HTML で、Tab 順も読み上げも壊れる。
    <div className="self-end" onMouseDown={(e) => e.stopPropagation()}>
      <Dock>
        <DockIcon url={resumeUrl}>
          <IoDocumentText className="h-5 w-5" />
        </DockIcon>
        <DockIcon url={siteConfig.links.github}>
          <IoLogoGithub className="h-5 w-5" />
        </DockIcon>
        {/* <DockIcon url={siteConfig.links.linkedin}>
          <IoLogoLinkedin className="h-5 w-5" />
        </DockIcon> */}
        <DockIcon url={siteConfig.links.email}>
          <IoMail className="h-5 w-5" />
        </DockIcon>
      </Dock>
    </div>
  );
}
