import type { MDXComponents } from 'mdx/types';
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Customizing the a tag with class names for styling and hover effects
    a: ({ children, ...props }) => (
      <a className="custom-link" {...props}>
        {children}
      </a>
    ),
    ...components,
  }
}