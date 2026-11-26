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
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-5" {...props} />
          );
        },
        // Heading 1 (Page Title)
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-0.045em] leading-[1] text-white mb-10" {...props} />
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
              <div className="flex items-baseline gap-4 mb-4 mt-14 pt-6 border-t border-white/10" {...props}>
                <span className={`font-pixel text-[11px] ${theme.headingText}`}>{num}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-white">{title}</h2>
              </div>
            );
          }

          // Fallback if it doesn't match the numbered pattern
          return <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.03em] text-white mb-4 mt-14 pt-6 border-t border-white/10" {...props}>{children}</h2>;
        },
        // Heading 3
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-bold text-white mt-8 mb-3" {...props} />
        ),
        // Lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-6 space-y-2 text-base md:text-lg text-zinc-300 leading-relaxed mb-6" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-6 space-y-2 text-base md:text-lg text-zinc-300 leading-relaxed mb-6" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="pl-2" {...props} />
        ),
        // Links
        a: ({ node, ...props }) => (
          <a className="text-violet-300 hover:text-white underline decoration-violet-400/40 underline-offset-4 transition-colors break-words" target={props.href?.startsWith('http') ? "_blank" : undefined} rel={props.href?.startsWith('http') ? "noopener noreferrer" : undefined} {...props} />
        ),
        // Bold text
        strong: ({ node, ...props }) => (
          <strong className="font-semibold text-white" {...props} />
        ),
        // Emphasized text
        em: ({ node, ...props }) => (
          <em className="text-zinc-400 italic" {...props} />
        ),
        // Tables
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-left text-base text-zinc-300 border border-white/10" {...props} />
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
