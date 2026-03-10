import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LegalMarkdownRendererProps {
  content: string;
  themeColor: 'sky' | 'rose';
}

export default function LegalMarkdownRenderer({ content, themeColor }: LegalMarkdownRendererProps) {
  const colorStyles = {
    sky: {
      bracketText: 'text-sky-500',
      bracketBorder: 'border-sky-500/30',
      bracketBg: 'bg-sky-500/5',
      headingText: 'text-sky-400',
    },
    rose: {
      bracketText: 'text-rose-500',
      bracketBorder: 'border-rose-500/30',
      bracketBg: 'bg-rose-500/5',
      headingText: 'text-rose-400',
    }
  };

  const theme = colorStyles[themeColor];

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Global paragraph styling
        p: ({ node, ...props }) => {
          // Check if paragraph contains an img element
          // If it does, render normally to avoid p > block errors
          const childrenArray = React.Children.toArray(props.children);
          const hasImage = childrenArray.some(
            (child: any) => child?.type === 'img'
          );

          if (hasImage) {
             return <p className="mb-6" {...props} />;
          }

          return (
            <p className="text-lg text-zinc-300 font-light leading-relaxed mb-6" {...props} />
          );
        },
        // Heading 1 (Page Title)
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl md:text-5xl font-pixel text-white leading-none tracking-tighter mb-8" {...props} />
        ),
        // Heading 2 (Intercepted for Swiss Industrial bracket style)
        h2: ({ node, children, ...props }) => {
          // Extract the text content
          let text = '';
          React.Children.forEach(children, (child) => {
            if (typeof child === 'string') text += child;
          });

          // Match patterns like "1. Title" or "1.Title"
          const match = text.match(/^(\d+)\.\s*(.*)/);

          if (match) {
            const num = match[1].padStart(2, '0'); // Pad with zero: '1' -> '01'
            const title = match[2];

            return (
              <div className="flex items-center gap-4 mb-4 mt-8" {...props}>
                <span className={`font-mono text-xs ${theme.bracketText} border ${theme.bracketBorder} px-2 py-0.5 ${theme.bracketBg}`}>
                  [ {num} ]
                </span>
                <h2 className={`font-mono text-sm tracking-widest ${theme.headingText} uppercase`}>
                  {title}
                </h2>
              </div>
            );
          }

          // Fallback if it doesn't match the numbered pattern
          return <h2 className={`font-mono text-sm tracking-widest ${theme.headingText} uppercase mb-4 mt-8`} {...props}>{children}</h2>;
        },
        // Heading 3
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-medium text-white mt-6 mb-3" {...props} />
        ),
        // Lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-6 space-y-2 text-lg text-zinc-300 font-light leading-relaxed mb-6" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-6 space-y-2 text-lg text-zinc-300 font-light leading-relaxed mb-6" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="pl-2" {...props} />
        ),
        // Links
        a: ({ node, ...props }) => (
          <a className="text-white hover:text-zinc-300 underline decoration-white/30 underline-offset-4 transition-colors break-words" target={props.href?.startsWith('http') ? "_blank" : undefined} rel={props.href?.startsWith('http') ? "noopener noreferrer" : undefined} {...props} />
        ),
        // Bold text
        strong: ({ node, ...props }) => (
          <strong className="font-medium text-white" {...props} />
        ),
        // Emphasized text
        em: ({ node, ...props }) => (
          <em className="text-zinc-400 italic" {...props} />
        ),
        // Tables
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-left text-lg text-zinc-300 font-light border border-zinc-800" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-zinc-900/30 border-b border-zinc-700 text-white font-medium" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="divide-y divide-zinc-800" {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr className="hover:bg-zinc-900/50 transition-colors" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="py-3 px-4 font-mono text-xs tracking-wide text-zinc-400 uppercase" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="py-3 px-4" {...props} />
        ),
        // Horizontal Rule
        hr: ({ node, ...props }) => (
          <hr className="border-white/10 my-8" {...props} />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
