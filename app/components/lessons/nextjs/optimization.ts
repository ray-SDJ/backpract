import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Next.js Performance Optimization",
  description:
    "Master Next.js optimization techniques including caching, image optimization, code splitting, ISR, and server-side rendering best practices.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">Next.js Performance Optimization</h1>
    
    <p class="mb-4">Learn advanced optimization techniques to build blazing-fast Next.js applications with optimal user experience.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Rendering Strategies</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Static Generation (SSG) vs Server-Side Rendering (SSR)</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/posts/page.tsx - Static Generation (FASTEST)
export const dynamic = 'force-static';  // Generate at build time

export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }  // Revalidate every hour
  }).then(res => res.json());
  
  return (
    &lt;div&gt;
      {posts.map(post =&gt; (
        &lt;PostCard key={post.id} post={post} /&gt;
      ))}
    &lt;/div&gt;
  );
}

// app/dashboard/page.tsx - Server-Side Rendering (Dynamic)
export const dynamic = 'force-dynamic';  // Always server-render

export default async function DashboardPage() {
  const session = await getServerSession();
  const userData = await fetchUserData(session.user.id);
  
  return &lt;Dashboard data={userData} /&gt;;
}

// app/products/[id]/page.tsx - Incremental Static Regeneration
export const revalidate = 60;  // Revalidate every 60 seconds

export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products')
    .then(res => res.json());
  
  // Pre-render top 100 products
  return products.slice(0, 100).map(product =&gt; ({
    id: product.id.toString()
  }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(\`https://api.example.com/products/\${params.id}\`, {
    next: { revalidate: 60 }
  }).then(res => res.json());
  
  return &lt;ProductDetail product={product} /&gt;;
}

// app/blog/[slug]/page.tsx - On-Demand Revalidation
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return &lt;Article post={post} /&gt;;
}

// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  const path = request.nextUrl.searchParams.get('path');
  
  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, path });
  }
  
  return Response.json({ error: 'Missing path' }, { status: 400 });
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📦 Caching Strategies</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Data Cache & Request Memoization</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// Request memoization (per-request cache)
const getUser = cache(async (id: string) => {
  console.log('Fetching user:', id);  // Called only once per request
  const res = await fetch(\`https://api.example.com/users/\${id}\`);
  return res.json();
});

// Data cache (persists across requests)
const getCachedProducts = unstable_cache(
  async () => {
    const res = await fetch('https://api.example.com/products');
    return res.json();
  },
  ['products'],  // Cache key
  {
    revalidate: 3600,  // Revalidate after 1 hour
    tags: ['products']  // Cache tags for invalidation
  }
);

// Component using caches
export default async function ProductsPage() {
  const products = await getCachedProducts();
  
  return (
    &lt;div&gt;
      {products.map(product =&gt; (
        &lt;ProductCard key={product.id} product={product} /&gt;
      ))}
    &lt;/div&gt;
  );
}

// Fetch with caching options
async function getData() {
  // Cache for 1 hour
  const data1 = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  });
  
  // Cache with tags
  const data2 = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  });
  
  // No caching
  const data3 = await fetch('https://api.example.com/live', {
    cache: 'no-store'
  });
  
  return { data1, data2, data3 };
}

// Invalidate cache by tag
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Revalidate all fetches tagged with 'posts'
  revalidateTag('posts');
  
  return Response.json({ revalidated: true });
}
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Redis Caching for API Routes</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

// Cached API route
// app/api/users/route.ts
import { redis } from '@/lib/redis';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cacheKey = 'users:all';
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return Response.json(cached, {
      headers: { 'X-Cache': 'HIT' }
    });
  }
  
  // Fetch fresh data
  const users = await db.user.findMany();
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, users);
  
  return Response.json(users, {
    headers: { 'X-Cache': 'MISS' }
  });
}

// Cache wrapper utility
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  
  const data = await fetcher();
  await redis.setex(key, ttl, data);
  
  return data;
}

// Usage
const products = await cachedFetch(
  'products:featured',
  async () => {
    return await db.product.findMany({ where: { featured: true } });
  },
  3600
);
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🖼️ Image Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
import Image from 'next/image';

// Optimized image component
export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    &lt;Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      quality={85}
      priority={false}  // Set true for above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/png;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    /&gt;
  );
}

// Remote image optimization
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.example.com',
        port: '',
        pathname: '/uploads/**'
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};

export default config;

// Responsive images with art direction
export function ResponsiveHero() {
  return (
    &lt;picture&gt;
      &lt;source
        media="(max-width: 768px)"
        srcSet="/hero-mobile.jpg 768w"
        type="image/jpeg"
      /&gt;
      &lt;source
        media="(min-width: 769px)"
        srcSet="/hero-desktop.jpg 1920w"
        type="image/jpeg"
      /&gt;
      &lt;Image
        src="/hero-desktop.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        priority
      /&gt;
    &lt;/picture&gt;
  );
}

// Lazy load images below the fold
export function Gallery({ images }: { images: string[] }) {
  return (
    &lt;div className="grid grid-cols-3 gap-4"&gt;
      {images.map((src, index) =&gt; (
        &lt;Image
          key={src}
          src={src}
          alt={\`Image \${index + 1}\`}
          width={400}
          height={300}
          loading="lazy"
          quality={75}
        /&gt;
      ))}
    &lt;/div&gt;
  );
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📦 Code Splitting & Bundle Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Dynamic imports for client components
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Load component only when needed
const HeavyChart = dynamic(() =&gt; import('@/components/HeavyChart'), {
  loading: () =&gt; &lt;p&gt;Loading chart...&lt;/p&gt;,
  ssr: false  // Don't render on server
});

const VideoPlayer = dynamic(() =&gt; import('@/components/VideoPlayer'), {
  ssr: false
});

export default function DashboardPage() {
  return (
    &lt;div&gt;
      &lt;h1&gt;Dashboard&lt;/h1&gt;
      
      &lt;Suspense fallback={&lt;div&gt;Loading...&lt;/div&gt;}&gt;
        &lt;HeavyChart /&gt;
      &lt;/Suspense&gt;
    &lt;/div&gt;
  );
}

// Lazy load based on user interaction
'use client';

import { useState } from 'react';

const Modal = dynamic(() =&gt; import('@/components/Modal'));

export function ModalTrigger() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    &lt;&gt;
      &lt;button onClick={() =&gt; setShowModal(true)}&gt;Open Modal&lt;/button&gt;
      {showModal && &lt;Modal onClose={() =&gt; setShowModal(false)} /&gt;}
    &lt;/&gt;
  );
}

// Bundle analyzer
// next.config.ts
import { BundleAnalyzerPlugin } from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === 'true'
});

export default withBundleAnalyzer({
  // ... other config
});

// Run: ANALYZE=true npm run build

// Tree-shaking imports
// BAD
import _ from 'lodash';

// GOOD
import { debounce, throttle } from 'lodash-es';

// Or even better - use native alternatives
const debounce = (fn: Function, ms: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
};
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Font & CSS Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/layout.tsx - Optimized fonts
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;html lang="en" className={\`\${inter.variable} \${robotoMono.variable}\`}&gt;
      &lt;body className={inter.className}&gt;{children}&lt;/body&gt;
    &lt;/html&gt;
  );
}

// Local fonts
import localFont from 'next/font/local';

const customFont = localFont({
  src: [
    {
      path: './fonts/custom-regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './fonts/custom-bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  variable: '--font-custom'
});

// CSS Modules for scoping and optimization
// components/Card.module.css
.card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

// components/Card.tsx
import styles from './Card.module.css';

export function Card({ children }: { children: React.ReactNode }) {
  return &lt;div className={styles.card}&gt;{children}&lt;/div&gt;;
}

// Critical CSS inlining (automatic in Next.js)
// Tailwind optimization
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔧 API Route Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Edge runtime for ultra-fast responses
// app/api/hello/route.ts
export const runtime = 'edge';

export async function GET() {
  return Response.json({ message: 'Hello from Edge!' });
}

// Streaming responses
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        controller.enqueue(encoder.encode(\`Event \${i}\\n\`));
      }
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// Parallel data fetching
// app/api/dashboard/route.ts
export async function GET() {
  const [users, posts, stats] = await Promise.all([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/stats').then(r => r.json())
  ]);
  
  return Response.json({ users, posts, stats });
}

// Response compression
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

export async function GET() {
  const data = { large: 'payload'.repeat(1000) };
  const json = JSON.stringify(data);
  
  const compressed = await gzipAsync(json);
  
  return new Response(compressed, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip'
    }
  });
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Performance Monitoring</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/layout.tsx - Web Vitals
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
    
    // Send to analytics
    if (metric.label === 'web-vital') {
      window.gtag?.('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true
      });
    }
  });
  
  return null;
}

// Server timing header
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  const duration = Date.now() - start;
  
  response.headers.set('Server-Timing', \`total;dur=\${duration}\`);
  
  return response;
}

// Custom performance tracking
export function measureAsync<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      console.log(\`[\${label}] took \${duration.toFixed(2)}ms\`);
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// Usage
const users = await measureAsync(
  () => db.user.findMany(),
  'Fetch Users'
);
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Next.js Optimization Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Use SSG when possible:</strong> Pre-render pages at build time</li>
        <li>• <strong>Implement ISR:</strong> Balance freshness with performance</li>
        <li>• <strong>Optimize images:</strong> Use next/image with proper sizing</li>
        <li>• <strong>Code splitting:</strong> Dynamic imports for heavy components</li>
        <li>• <strong>Font optimization:</strong> Use next/font for automatic optimization</li>
        <li>• <strong>Cache strategically:</strong> Use unstable_cache and fetch options</li>
        <li>• <strong>Edge runtime:</strong> Use for API routes when possible</li>
        <li>• <strong>Parallel fetching:</strong> Use Promise.all() for independent requests</li>
        <li>• <strong>Monitor performance:</strong> Track Web Vitals and Core Web Vitals</li>
        <li>• <strong>Analyze bundles:</strong> Regular bundle size audits</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Production Configuration</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // Compression
  compress: true,
  
  // Optimize production build
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lodash', 'date-fns']
  },
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600'
          }
        ]
      }
    ];
  }
};

export default config;

// Environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement appropriate rendering strategies (SSG, SSR, ISR)",
    "Optimize images with next/image and proper sizing",
    "Use dynamic imports for code splitting",
    "Implement caching strategies with Redis and fetch options",
    "Optimize fonts with next/font",
    "Monitor and improve Web Vitals scores",
  ],
  practiceInstructions: [
    "Convert static pages to use SSG with revalidation",
    "Replace <img> tags with optimized <Image> components",
    "Implement dynamic imports for heavy client components",
    "Add Redis caching to API routes",
    "Set up font optimization with next/font",
    "Track Web Vitals with useReportWebVitals",
  ],
  hints: [
    "Use SSG for public pages, SSR only when data must be fresh",
    "Always specify width, height, and sizes for Image components",
    "Dynamic imports reduce initial bundle size significantly",
    "unstable_cache persists across requests, cache() only within a request",
    "Edge runtime is faster but has limited Node.js API access",
    "Lighthouse and Web Vitals are your friends for performance audits",
  ],
  solution: `// Complete optimization example

// app/products/page.tsx - Optimized product listing
export const revalidate = 3600;  // ISR: revalidate hourly

import Image from 'next/image';
import { unstable_cache } from 'next/cache';

const getCachedProducts = unstable_cache(
  async () => {
    const res = await fetch('https://api.example.com/products');
    return res.json();
  },
  ['products'],
  { revalidate: 3600, tags: ['products'] }
);

export default async function ProductsPage() {
  const products = await getCachedProducts();
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={85}
          />
          <h3>{product.name}</h3>
        </div>
      ))}
    </div>
  );
}

// app/api/users/route.ts - Cached API
import { redis } from '@/lib/redis';

export async function GET() {
  const cached = await redis.get('users');
  if (cached) return Response.json(cached);
  
  const users = await db.user.findMany();
  await redis.setex('users', 300, users);
  
  return Response.json(users);
}`,
};
