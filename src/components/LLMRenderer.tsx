import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import DOMPurify from 'dompurify';
// import { ClipboardIcon, ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

type LLMRendererProps = {
  markdown: string | null;
  className?: string;
  onQuestionClick?: (question: string) => void;
  isLoading?: boolean;
  error?: string | null;
};


export const LLMRenderer: React.FC<LLMRendererProps> = ({
  markdown,
  className = '',
  onQuestionClick,
  isLoading = false,
  error = null,
}) => {
  // Preprocess markdown with enhanced sanitization
  const preprocessMarkdown = (input: string | null): string => {
    if (!input) return '';
    
    // Enhanced cleaning with multiple edge cases
    const cleaned = input
      .replace(/^```(markdown|md)?\n([\s\S]*?)\n```$/g, '$2') // Remove markdown code wrappers
      .replace(/^---\n([\s\S]*?)\n---/g, '') // Remove YAML frontmatter
      .replace(/\[!NOTE\]/g, 'ℹ️ NOTE:') // Convert admonitions
      .replace(/\[!WARNING\]/g, '⚠️ WARNING:')
      .replace(/\[!IMPORTANT\]/g, '❗ IMPORTANT:')
      .trim();

    return DOMPurify.sanitize(cleaned, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'em', 'strong', 'code', 'pre',
        'ul', 'ol', 'li', 'a', 'img', 'blockquote',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span', 'hr'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target'],
    });
  };

  // Enhanced follow-up questions extraction
  const extractFollowUpQuestions = (input: string): string[] => {
    const patterns = [
      /## Follow-Up Questions\n\n([\s\S]*?)(?=\n## |\n$)/i,
      /## Suggested Questions\n\n([\s\S]*?)(?=\n## |\n$)/i,
      /## You Might Ask\n\n([\s\S]*?)(?=\n## |\n$)/i,
    ];

    for (const pattern of patterns) {
      const followUpSection = input.match(pattern);
      if (followUpSection) {
        return followUpSection[1]
          .split('\n')
          .filter(line => line.trim().match(/^[-*•]?\s*(.+?)\s*$/))
          .map(line => line.replace(/^[-*•]\s*/, '').trim())
          .filter(q => q.length > 0);
      }
    }
    return [];
  };

  const sanitizedMarkdown = preprocessMarkdown(markdown);
  const followUpQuestions = extractFollowUpQuestions(sanitizedMarkdown);
  const markdownWithoutQuestions = sanitizedMarkdown.replace(
    /## (Follow-Up|Suggested|You Might Ask) Questions?\n\n([\s\S]*?)(?=\n## |\n$)/gi,
    ''
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-5/6 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`rounded-xl bg-red-50 dark:bg-red-900/20 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400 dark:text-red-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Error rendering response
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <ReactMarkdown
        components={{
          // Headings with smooth scroll-margin
          h1: ({ children, node }) => (
            <h1
              id={node?.position?.start?.line?.toString()}
              className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-8 mb-6 scroll-mt-24 tracking-tight"
            >
              {children}
            </h1>
          ),
          h2: ({ children, node }) => (
            <h2
              id={node?.position?.start.line.toString()}
              className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-7 mb-5 scroll-mt-24 tracking-tight border-b border-gray-100 dark:border-gray-800 pb-2"
            >
              {children}
            </h2>
          ),
          h3: ({ children, node }) => (
            <h3
              id={node?.position?.start.line.toString()}
              className="text-xl font-medium text-gray-700 dark:text-gray-200 mt-6 mb-4 scroll-mt-24"
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mt-5 mb-3">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-medium text-gray-600 dark:text-gray-400 mt-4 mb-2">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-gray-500 dark:text-gray-500 mt-3 mb-2 uppercase tracking-wider">
              {children}
            </h6>
          ),
          
          // Paragraph with optimized readability
          p: ({ children }) => (
            <p className="mb-5 leading-relaxed text-gray-700 dark:text-gray-300 text-[15px]">
              {children}
            </p>
          ),
          
          // Emphasis and strong
          em: ({ children }) => (
            <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-200">
              {children}
            </strong>
          ),
          
          // Links with hover effects
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-200 dark:decoration-blue-800 hover:decoration-blue-400 dark:hover:decoration-blue-600 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Lists with better spacing
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-2 mb-6 marker:text-gray-400 dark:marker:text-gray-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-2 mb-6 marker:text-gray-400 dark:marker:text-gray-600">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-2 text-gray-700 dark:text-gray-300">
              {children}
            </li>
          ),
          
          // Code blocks with enhanced UX
          code(props) {
            const { className, children, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !node?.position;
            
            return isInline ? (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
                {...rest}
              >
                {children}
              </code>
            ) : match ? (
              <div className="group relative my-6 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {match[1]}
                  </span>
                  <button
                    className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => navigator.clipboard.writeText(String(children))}
                  >
                    {/* <ClipboardIcon className="h-3.5 w-3.5" /> */}
                    Copy
                  </button>
                </div>
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="pre"
                  showLineNumbers
                  wrapLines
                  lineNumberStyle={{ color: '#6b7280', minWidth: '2.25em' }}
                  className="!bg-gray-900 !m-0 text-sm"
                  // Do not spread {...rest} to avoid passing an incompatible ref
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
                <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  {children}
                </code>
              </pre>
            );
          },
          
          // Tables with better responsiveness
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-800">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),
          
          // Blockquotes with elegant styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400 my-6 py-1">
              {children}
            </blockquote>
          ),
          
          // Horizontal rule with subtle styling
          hr: () => (
            <hr className="my-6 border-t border-gray-200 dark:border-gray-800" />
          ),
          
          // Images with proper sizing and captions
          img: ({ src, alt, title }) => (
            <figure className="my-6">
              <img
                src={src}
                alt={alt}
                title={title}
                className="rounded-lg shadow-sm mx-auto max-h-[80vh] object-contain border border-gray-200 dark:border-gray-800"
                loading="lazy"
              />
              {title && (
                <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                  {title}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {markdownWithoutQuestions}
      </ReactMarkdown>

      {followUpQuestions.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-6">
            {/* <SparklesIcon className="h-5 w-5 text-blue-500" /> */}
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 tracking-tight">
              Continue Exploring
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.map((question, index) => (
              <button
                key={index}
                className="group md:max-w-[400px] cursor-pointer relative w-full text-left flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                onClick={() => onQuestionClick?.(question)}
                aria-label={`Explore ${question}`}
              >
                <span className="text-gray-800 dark:text-gray-200 font-medium text-[15px] leading-snug">
                  {question}
                </span>
                {/* <ChevronRightIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-200" /> */}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};