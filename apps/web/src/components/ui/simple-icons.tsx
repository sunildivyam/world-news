import React from "react";
import * as icons from "simple-icons";

// Define props to match lucide-react behavior
export interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: string | number;
  color?: string;
}

// Reusable Higher-Order Component to wrap simple-icons
const createSimpleIcon = (iconData: icons.SimpleIcon) => {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, color = "currentColor", style, ...props }, ref) => {
      return (
        <svg
          ref={ref}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={color}
          style={{ display: "inline-block", verticalAlign: "middle", ...style }}
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path d={iconData.path} />
        </svg>
      );
    },
  );

  Component.displayName = iconData.title;
  return Component;
};

// Export individual components matching your requested list
export const Facebook = createSimpleIcon(icons.siFacebook);
export const Github = createSimpleIcon(icons.siGithub);
export const Instagram = createSimpleIcon(icons.siInstagram);
export const Mail = createSimpleIcon(icons.siGmail); // simple-icons uses Gmail for standard mail
export const Twitter = createSimpleIcon(icons.siX); // simple-icons updated Twitter to X
export const Youtube = createSimpleIcon(icons.siYoutube);
