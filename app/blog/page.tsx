import React from 'react';
import { builder } from '@builder.io/sdk';
import Link from 'next/link'; // Use Next.js Link for navigation

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: {
    page: string[];
  };
}

const ARTICLES_PER_PAGE = 30;

// Helper function to get value from potentially object or string field
const getFieldValue = (field: any): string => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  // If it's an object with Default property
  if (field.Default) return field.Default;
  // If it's an object with another structure
  return (Object.values(field)[0] as string) || '';
};

export default async function Blog(props: PageProps) {
  // Get the page number from the path or query parameter
  // In this example we are hardcoding it as 1
  const pageNumber = 1;
  const articles = await builder.getAll('blog-article', {
    // Include references, like the `author` ref
    options: { includeRefs: true },
    // For performance, don't pull the `blocks` (the full blog entry content)
    // when listing out all blog articles
    omit: 'data.blocks',
    limit: ARTICLES_PER_PAGE,
    offset: (pageNumber - 1) * ARTICLES_PER_PAGE,
  });

  console.dir(articles, { depth: null });

  return (
    <div>
      {articles.map((item) => {
        const handle = getFieldValue(item?.data?.handle);
        const title = getFieldValue(item?.data?.title);
        const image = getFieldValue(item?.data?.image);
        const description = getFieldValue(item?.data?.description);

        return (
          <Link
            href={`/blog/${handle || '#'}`}
            key={handle || item.id}
          >
            <div style={{ overflow: 'hidden', width: 300 }}>
              <div
                style={{ width: 300, height: 200, display: 'block' }}
              >
                <img src={image || ''} alt={title || ''} />
              </div>
              {title}
              {description}
            </div>
          </Link>
        );
      })}
      <div
        style={{
          padding: 20,
          width: 300,
          margin: 'auto',
          display: 'flex',
        }}
      >
        {pageNumber > 1 && (
          <a href={`/blog/page/${pageNumber - 1}`}>‹ Previous page</a>
        )}

        {articles.length > ARTICLES_PER_PAGE && (
          <a href={`/blog/page/${pageNumber + 1}`}>Next page ›</a>
        )}
      </div>
    </div>
  );
}
