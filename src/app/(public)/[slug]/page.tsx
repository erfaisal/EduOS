import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/services/cms';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.title,
    description: page.meta_description,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="hero-section mb-12">
        <h1 className="text-4xl font-bold text-primary mb-8">{page.title}</h1>
      </section>

      <article
        className="prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}