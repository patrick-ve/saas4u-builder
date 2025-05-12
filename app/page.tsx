import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '../components/builder';
import { cookies } from 'next/headers';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: {
    page: string[];
  };
}

export default async function Homepage(props: PageProps) {
  const builderModelName = 'page';
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en-US';

  const content = await builder
    .get(builderModelName, {
      userAttributes: {
        locale,
        urlPath: '/',
      },
    })
    .toPromise();

  console.log(content?.data);

  return (
    <>
      <RenderBuilderContent
        content={content}
        model={builderModelName}
        options={{ enrich: true }}
        locale={locale}
      />
    </>
  );
}
