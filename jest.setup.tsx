import '@testing-library/jest-dom'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'

// ✅ Mock next/image → behaves like a normal <img> but removes Next-specific props
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { alt = '', priority, fill, ...rest } = props as ImgHTMLAttributes<HTMLImageElement> & {
      priority?: boolean
      fill?: boolean
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />
  },
}))

// Mock next/link to render an anchor that prevents default navigation so jsdom doesn't try to navigate
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      return (
        <a
          href={href ?? '#'}
          onClick={(e) => {
            // Prevent jsdom from trying to navigate which causes the "Not implemented: navigation" error
            e.preventDefault();
          }}
          {...props}
        >
          {children}
        </a>
      );
    },
  };
});

