import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "SEO Best Practices for Next.js Applications",
  description:
    "Master Next.js SEO implementation including metadata API, sitemaps, structured data, Open Graph, dynamic routes, and performance optimization.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">SEO Best Practices for Next.js Applications</h1>
    
    <p class="mb-4">Learn comprehensive SEO strategies for Next.js 14+ applications using the App Router and built-in SEO features.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🎯 Metadata API (App Router)</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Static & Dynamic Metadata</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/layout.tsx - Root metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'My Website',
    template: '%s | My Website'
  },
  description: 'The best website for learning backend development',
  keywords: ['backend', 'development', 'api', 'database'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'My Website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Website'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mywebsite',
    creator: '@mywebsite'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    yandex: 'YOUR_YANDEX_CODE'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;html lang="en"&gt;
      &lt;body&gt;{children}&lt;/body&gt;
    &lt;/html&gt;
  );
}

// app/blog/[slug]/page.tsx - Dynamic metadata
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise&lt;Metadata&gt; {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage]
    },
    alternates: {
      canonical: \`https://example.com/blog/\${params.slug}\`
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;div dangerouslySetInnerHTML={{ __html: post.content }} /&gt;
    &lt;/article&gt;
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug
  }));
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🗺️ Sitemap Generation</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/sitemap.ts - Dynamic sitemap
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise&lt;MetadataRoute.Sitemap&gt; {
  const baseUrl = 'https://example.com';
  
  // Get all blog posts
  const posts = await getAllPosts();
  const postUrls = posts.map((post) => ({
    url: \`\${baseUrl}/blog/\${post.slug}\`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));
  
  // Get all products
  const products = await getAllProducts();
  const productUrls = products.map((product) => ({
    url: \`\${baseUrl}/products/\${product.id}\`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: \`\${baseUrl}/about\`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: \`\${baseUrl}/contact\`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7
    }
  ];
  
  return [...staticPages, ...postUrls, ...productUrls];
}

// app/robots.ts - robots.txt
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/']
      }
    ],
    sitemap: 'https://example.com/sitemap.xml'
  };
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Structured Data (JSON-LD)</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// lib/structured-data.ts
export interface ArticleSchema {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate: string;
  image: string;
  url: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
}

export function generateArticleSchema(data: ArticleSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Website',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    },
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    }
  };
}

export function generateProductSchema(data: ProductSchema) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
      availability: \`https://schema.org/\${data.availability}\`
    }
  };
  
  if (data.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: data.brand
    };
  }
  
  if (data.rating && data.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount
    };
  }
  
  return schema;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateOrganizationSchema(
  name: string,
  logo: string,
  url: string,
  socialLinks: string[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: socialLinks
  };
}

// app/blog/[slug]/page.tsx - Using structured data
export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);
  
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    author: post.author,
    publishedDate: post.publishedAt,
    modifiedDate: post.updatedAt,
    image: post.featuredImage,
    url: \`https://example.com/blog/\${params.slug}\`
  });
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://example.com' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: post.title, url: \`https://example.com/blog/\${params.slug}\` }
  ]);
  
  return (
    &lt;&gt;
      {/* JSON-LD Structured Data */}
      &lt;script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      /&gt;
      &lt;script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      /&gt;
      
      &lt;article&gt;
        &lt;h1&gt;{post.title}&lt;/h1&gt;
        &lt;div dangerouslySetInnerHTML={{ __html: post.content }} /&gt;
      &lt;/article&gt;
    &lt;/&gt;
  );
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔗 URL Optimization & Redirects</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// lib/slug.ts
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// middleware.ts - URL normalization
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    url.protocol = 'https:';
    return NextResponse.redirect(url);
  }
  
  // Remove trailing slash (except for homepage)
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }
  
  // Remove www
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4);
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

// next.config.ts - 301 Redirects
import type { NextConfig } from 'next';

const config: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true  // 301 redirect
      },
      {
        source: '/blog/old-post',
        destination: '/blog/new-post',
        permanent: true
      },
      {
        source: '/products/:id',
        destination: '/shop/products/:id',
        permanent: true
      }
    ];
  }
};

export default config;

// Canonical URLs - Already handled by Metadata API
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://example.com/current-page'
  }
};

// Pagination with rel links
// app/blog/page.tsx
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://example.com/blog'
  }
};

export default async function BlogPage({
  searchParams
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { posts, totalPages } = await getPosts(page);
  
  return (
    &lt;&gt;
      {page &gt; 1 && (
        &lt;link rel="prev" href={\`/blog?page=\${page - 1}\`} /&gt;
      )}
      {page &lt; totalPages && (
        &lt;link rel="next" href={\`/blog?page=\${page + 1}\`} /&gt;
      )}
      
      &lt;div&gt;
        {posts.map(post =&gt; (
          &lt;article key={post.id}&gt;{post.title}&lt;/article&gt;
        ))}
      &lt;/div&gt;
    &lt;/&gt;
  );
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Performance & Core Web Vitals</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// next.config.ts - Optimization
import type { NextConfig } from 'next';

const config: NextConfig = {
  // Compression (automatic in production)
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com'
      }
    ]
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lodash', 'date-fns']
  }
};

export default config;

// Optimized images
import Image from 'next/image';

export function OptimizedImage() {
  return (
    &lt;Image
      src="/featured-image.jpg"
      alt="Featured Image"
      width={1200}
      height={630}
      quality={85}
      priority={false}  // Set true for above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    /&gt;
  );
}

// Font optimization (automatic with next/font)
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
});

// Code splitting with dynamic imports
'use client';

import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() =&gt; import('@/components/HeavyComponent'), {
  loading: () =&gt; &lt;p&gt;Loading...&lt;/p&gt;,
  ssr: false  // Don't render on server
});

export default function Page() {
  return (
    &lt;div&gt;
      &lt;HeavyComponent /&gt;
    &lt;/div&gt;
  );
}

// Web Vitals tracking
// app/web-vitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    if (metric.label === 'web-vital') {
      // Google Analytics
      window.gtag?.('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true
      });
      
      // Or send to your own API
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(metric)
      });
    }
  });
  
  return null;
}

// Add to layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;html&gt;
      &lt;body&gt;
        &lt;WebVitals /&gt;
        {children}
      &lt;/body&gt;
    &lt;/html&gt;
  );
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔍 Content Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// lib/content-utils.ts
import { JSDOM } from 'jsdom';

export function extractHeadings(html: string) {
  const dom = new JSDOM(html);
  const headings: Array<{ level: number; text: string; slug: string }> = [];
  
  dom.window.document.querySelectorAll('h2, h3, h4, h5, h6').forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent || '';
    const slug = generateSlug(text);
    
    headings.push({ level, text, slug });
  });
  
  return headings;
}

export function addHeadingIds(html: string): string {
  const dom = new JSDOM(html);
  
  dom.window.document.querySelectorAll('h2, h3, h4, h5, h6').forEach((heading) => {
    const slug = generateSlug(heading.textContent || '');
    heading.id = slug;
  });
  
  return dom.window.document.body.innerHTML;
}

export function calculateReadingTime(html: string, wpm = 200): number {
  const dom = new JSDOM(html);
  const text = dom.window.document.body.textContent || '';
  const wordCount = text.split(/\\s+/).length;
  
  return Math.max(1, Math.ceil(wordCount / wpm));
}

export function generateExcerpt(html: string, length = 160): string {
  const dom = new JSDOM(html);
  const text = (dom.window.document.body.textContent || '')
    .replace(/\\s+/g, ' ')
    .trim();
  
  if (text.length &lt;= length) return text;
  
  const truncated = text.substring(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

// Usage in page
export async function generateMetadata({ params }: Props): Promise&lt;Metadata&gt; {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: generateExcerpt(post.content),
    // ...other metadata
  };
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Next.js SEO Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Metadata API:</strong> Use generateMetadata for dynamic pages</li>
        <li>• <strong>Static Generation:</strong> Pre-render pages at build time when possible</li>
        <li>• <strong>Dynamic sitemap:</strong> Auto-generate from database content</li>
        <li>• <strong>Structured data:</strong> Add JSON-LD for rich search results</li>
        <li>• <strong>Image optimization:</strong> Always use next/image component</li>
        <li>• <strong>Font optimization:</strong> Use next/font for automatic optimization</li>
        <li>• <strong>Code splitting:</strong> Dynamic imports for heavy components</li>
        <li>• <strong>Clean URLs:</strong> Use meaningful slugs in dynamic routes</li>
        <li>• <strong>301 redirects:</strong> Configure in next.config.ts</li>
        <li>• <strong>Canonical URLs:</strong> Set via alternates.canonical</li>
        <li>• <strong>Mobile-first:</strong> Responsive design is essential</li>
        <li>• <strong>Web Vitals:</strong> Monitor and optimize Core Web Vitals</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📈 Analytics & Monitoring</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/layout.tsx - Google Analytics
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;html&gt;
      &lt;body&gt;
        {children}
        
        {/* Google Analytics */}
        &lt;Script
          src={\`https://www.googletagmanager.com/gtag/js?id=\${process.env.NEXT_PUBLIC_GA_ID}\`}
          strategy="afterInteractive"
        /&gt;
        &lt;Script id="google-analytics" strategy="afterInteractive"&gt;
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '\${process.env.NEXT_PUBLIC_GA_ID}');
          \`}
        &lt;/Script&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}

// Track 404 errors
// app/not-found.tsx
export default function NotFound() {
  return (
    &lt;div&gt;
      &lt;h1&gt;404 - Page Not Found&lt;/h1&gt;
      &lt;p&gt;The page you are looking for does not exist.&lt;/p&gt;
    &lt;/div&gt;
  );
}

// Custom error tracking
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () =&gt; void;
}) {
  useEffect(() => {
    // Log error to analytics
    console.error('Application error:', error);
  }, [error]);
  
  return (
    &lt;div&gt;
      &lt;h2&gt;Something went wrong!&lt;/h2&gt;
      &lt;button onClick={reset}&gt;Try again&lt;/button&gt;
    &lt;/div&gt;
  );
}
      </code>
    </pre>
  </div>`,
  objectives: [
    "Use the Metadata API for dynamic SEO tags",
    "Generate sitemaps and robots.txt automatically",
    "Implement structured data with JSON-LD",
    "Optimize images with next/image component",
    "Configure 301 redirects in next.config.ts",
    "Monitor Core Web Vitals with useReportWebVitals",
  ],
  practiceInstructions: [
    "Add generateMetadata to all dynamic pages",
    "Create app/sitemap.ts for automatic sitemap generation",
    "Add Article and Product JSON-LD schemas",
    "Replace all <img> tags with <Image> components",
    "Set up 301 redirects for old URLs",
    "Implement Web Vitals tracking",
  ],
  hints: [
    "generateMetadata runs on the server and can fetch data",
    "metadataBase in root layout sets the base URL for all metadata",
    "Use 'permanent: true' for 301 redirects, false for 302",
    "Always specify width, height, and alt for Image components",
    "Dynamic imports reduce initial JavaScript bundle size",
    "Test with Lighthouse and Google's Rich Results Test",
  ],
  solution: `// Complete Next.js SEO implementation

// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/structured-data';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: [{ url: post.featuredImage, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage]
    },
    alternates: {
      canonical: \`https://example.com/blog/\${params.slug}\`
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug);
  
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    author: post.author,
    publishedDate: post.publishedAt,
    modifiedDate: post.updatedAt,
    image: post.featuredImage,
    url: \`https://example.com/blog/\${params.slug}\`
  });
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}

// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    url: \`https://example.com/blog/\${post.slug}\`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6
  }));
}`,
};
