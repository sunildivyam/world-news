"use client";
import React, { forwardRef } from "react";
import Link, { LinkProps } from "next/link";

/**
 * Props for NoPrefetchLink.
 * We omit 'prefetch' from the original LinkProps because this component
 * explicitly forces it to false.
 */
interface NoPrefetchLinkProps extends Omit<LinkProps, "prefetch"> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  id?: string;
  target?: string;
  rel?: string;
  // Add other standard HTML attributes if needed,
  // or use React.AnchorHTMLAttributes<HTMLAnchorElement>
}

/**
 * NoPrefetchLink
 * * A specialized wrapper around Next.js Link that disables prefetching.
 * Useful for large-scale applications to reduce server load and
 * client-side bandwidth on pages with many links.
 */
const NoPrefetchLink = forwardRef<HTMLAnchorElement, NoPrefetchLinkProps>(
  ({ children, href, ...props }, ref) => {
    return (
      <Link {...props} href={href} prefetch={false} ref={ref}>
        {children}
      </Link>
    );
  },
);

// Setting the displayName is a best practice when using forwardRef
// for better debugging in React DevTools.
NoPrefetchLink.displayName = "NoPrefetchLink";

export default NoPrefetchLink;
