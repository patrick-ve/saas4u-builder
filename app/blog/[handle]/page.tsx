import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '../../../components/builder';
import { cookies } from 'next/headers';
import Image from 'next/image';

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Helper function for date formatting
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface PageProps {
  params: {
    handle: string;
  };
}

export default async function BlogArticle(props: PageProps) {
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en-US';

  try {
    const content = await builder
      .get('blog-article', {
        userAttributes: { locale },
        options: {
          includeRefs: true,
        },
      })
      .toPromise();

    const articleData = content?.data;
    const publishDate = articleData?.date
      ? new Date(articleData.date)
      : new Date();

    return (
      <div className="max-w-3xl mx-auto px-0 py-4">
        {/* Also keep the Builder rendering for any additional components */}
        <RenderBuilderContent
          content={content}
          model="blog-article"
          options={{ enrich: true }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog article:', error);
    return <div>Error loading content</div>;
  }
}
