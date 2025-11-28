import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "SEO Best Practices for Node.js & Express",
  description:
    "Master SEO implementation in Node.js applications including meta tags, sitemaps, structured data, server-side rendering, and performance optimization.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">SEO Best Practices for Node.js & Express</h1>
    
    <p class="mb-4">Learn how to implement comprehensive SEO strategies in Node.js and Express applications for better search engine visibility.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🎯 Meta Tags & Open Graph</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Dynamic Meta Tag Generator</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// utils/seo.js
class SEOMetaTags {
  constructor({
    title,
    description,
    keywords = '',
    image = null,
    url,
    type = 'website',
    author = null,
    siteName = 'My Website',
    twitterHandle = '@mywebsite'
  }) {
    this.title = title;
    this.description = description;
    this.keywords = keywords;
    this.image = image;
    this.url = url;
    this.type = type;
    this.author = author;
    this.siteName = siteName;
    this.twitterHandle = twitterHandle;
  }

  generateTags() {
    const tags = {
      // Basic meta
      title: this.title,
      description: this.description,
      keywords: this.keywords,
      
      // Open Graph
      'og:title': this.title,
      'og:description': this.description,
      'og:type': this.type,
      'og:url': this.url,
      'og:site_name': this.siteName,
      
      // Twitter Card
      'twitter:card': 'summary_large_image',
      'twitter:site': this.twitterHandle,
      'twitter:title': this.title,
      'twitter:description': this.description,
    };

    if (this.image) {
      tags['og:image'] = this.image;
      tags['og:image:width'] = '1200';
      tags['og:image:height'] = '630';
      tags['twitter:image'] = this.image;
    }

    if (this.author) {
      tags['author'] = this.author;
      tags['article:author'] = this.author;
    }

    return tags;
  }

  toHTML() {
    const tags = this.generateTags();
    let html = \`<title>\${tags.title}</title>\\n\`;
    
    Object.entries(tags).forEach(([key, value]) => {
      if (key === 'title') return;
      
      if (key.startsWith('og:') || key.startsWith('article:')) {
        html += \`    <meta property="\${key}" content="\${value}">\\n\`;
      } else if (key.startsWith('twitter:')) {
        html += \`    <meta name="\${key}" content="\${value}">\\n\`;
      } else {
        html += \`    <meta name="\${key}" content="\${value}">\\n\`;
      }
    });
    
    return html;
  }
}

module.exports = { SEOMetaTags };

// Usage in routes
const express = require('express');
const { SEOMetaTags } = require('./utils/seo');
const router = express.Router();

router.get('/blog/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  
  const seo = new SEOMetaTags({
    title: \`\${post.title} | My Blog\`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    image: \`\${req.protocol}://\${req.get('host')}/images/\${post.featuredImage}\`,
    url: \`\${req.protocol}://\${req.get('host')}\${req.originalUrl}\`,
    type: 'article',
    author: post.author.name
  });
  
  res.render('blog-post', {
    post,
    seo: seo.generateTags(),
    seoHTML: seo.toHTML()
  });
});

// EJS template (views/blog-post.ejs)
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <%- seoHTML %>
    
    <link rel="canonical" href="<%= seo['og:url'] %>">
    <meta name="robots" content="index, follow">
</head>
<body>
    <article>
        <h1><%= post.title %></h1>
        <%- post.content %>
    </article>
</body>
</html>
*/
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🗺️ XML Sitemap Generation</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// utils/sitemap.js
class SitemapGenerator {
  constructor() {
    this.urls = [];
  }

  addURL(loc, lastmod = new Date(), changefreq = 'weekly', priority = 0.5) {
    this.urls.push({
      loc,
      lastmod: lastmod instanceof Date ? lastmod.toISOString().split('T')[0] : lastmod,
      changefreq,
      priority
    });
  }

  generateXML() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';
    
    this.urls.forEach(url => {
      xml += '  <url>\\n';
      xml += \`    <loc>\${url.loc}</loc>\\n\`;
      xml += \`    <lastmod>\${url.lastmod}</lastmod>\\n\`;
      xml += \`    <changefreq>\${url.changefreq}</changefreq>\\n\`;
      xml += \`    <priority>\${url.priority}</priority>\\n\`;
      xml += '  </url>\\n';
    });
    
    xml += '</urlset>';
    return xml;
  }
}

module.exports = { SitemapGenerator };

// routes/sitemap.js
const express = require('express');
const { SitemapGenerator } = require('../utils/sitemap');
const Post = require('../models/Post');
const Product = require('../models/Product');

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  const sitemap = new SitemapGenerator();
  const baseUrl = \`\${req.protocol}://\${req.get('host')}\`;
  
  // Add homepage
  sitemap.addURL(baseUrl, new Date(), 'daily', 1.0);
  
  // Add static pages
  const staticPages = [
    { path: '/about', freq: 'monthly', priority: 0.8 },
    { path: '/contact', freq: 'monthly', priority: 0.7 },
    { path: '/services', freq: 'weekly', priority: 0.9 }
  ];
  
  staticPages.forEach(page => {
    sitemap.addURL(
      \`\${baseUrl}\${page.path}\`,
      new Date(),
      page.freq,
      page.priority
    );
  });
  
  // Add blog posts
  const posts = await Post.find({ published: true })
    .select('slug updatedAt')
    .lean();
  
  posts.forEach(post => {
    sitemap.addURL(
      \`\${baseUrl}/blog/\${post.slug}\`,
      post.updatedAt,
      'monthly',
      0.6
    );
  });
  
  // Add products
  const products = await Product.find({ active: true })
    .select('_id updatedAt')
    .lean();
  
  products.forEach(product => {
    sitemap.addURL(
      \`\${baseUrl}/products/\${product._id}\`,
      product.updatedAt,
      'weekly',
      0.8
    );
  });
  
  res.header('Content-Type', 'application/xml');
  res.send(sitemap.generateXML());
});

// robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = \`\${req.protocol}://\${req.get('host')}\`;
  
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    'Disallow: /private/',
    '',
    \`Sitemap: \${baseUrl}/sitemap.xml\`
  ].join('\\n');
  
  res.type('text/plain');
  res.send(robots);
});

module.exports = router;
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Structured Data (JSON-LD)</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// utils/structured-data.js
class StructuredData {
  static article({
    title,
    description,
    author,
    publishedDate,
    modifiedDate,
    image,
    url
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": image,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "My Website",
        "logo": {
          "@type": "ImageObject",
          "url": "https://example.com/logo.png"
        }
      },
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };
  }

  static product({
    name,
    description,
    image,
    price,
    currency,
    availability,
    rating = null,
    reviewCount = null,
    brand = null
  }) {
    const data = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": description,
      "image": image,
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": \`https://schema.org/\${availability}\`,
        "url": image
      }
    };

    if (brand) {
      data.brand = {
        "@type": "Brand",
        "name": brand
      };
    }

    if (rating && reviewCount) {
      data.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "reviewCount": reviewCount
      };
    }

    return data;
  }

  static breadcrumb(items) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  static organization({ name, logo, url, socialLinks }) {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": name,
      "url": url,
      "logo": logo,
      "sameAs": socialLinks
    };
  }

  static faq(questions) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
  }

  static toScript(data) {
    return \`<script type="application/ld+json">
\${JSON.stringify(data, null, 2)}
</script>\`;
  }
}

module.exports = { StructuredData };

// Usage
router.get('/blog/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  const baseUrl = \`\${req.protocol}://\${req.get('host')}\`;
  
  const articleSchema = StructuredData.article({
    title: post.title,
    description: post.excerpt,
    author: post.author.name,
    publishedDate: post.createdAt.toISOString(),
    modifiedDate: post.updatedAt.toISOString(),
    image: \`\${baseUrl}/images/\${post.featuredImage}\`,
    url: \`\${baseUrl}/blog/\${post.slug}\`
  });
  
  const breadcrumbSchema = StructuredData.breadcrumb([
    { name: 'Home', url: baseUrl },
    { name: 'Blog', url: \`\${baseUrl}/blog\` },
    { name: post.title, url: \`\${baseUrl}/blog/\${post.slug}\` }
  ]);
  
  res.render('blog-post', {
    post,
    articleSchema: StructuredData.toScript(articleSchema),
    breadcrumbSchema: StructuredData.toScript(breadcrumbSchema)
  });
});

// In template
/*
<%- articleSchema %>
<%- breadcrumbSchema %>
*/
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔗 URL Optimization & Redirects</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// utils/slug.js
const slugify = require('slugify');

function generateSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
}

module.exports = { generateSlug };

// middleware/canonical.js
function enforceCanonical(req, res, next) {
  const host = req.get('host');
  const protocol = req.protocol;
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && protocol !== 'https') {
    return res.redirect(301, \`https://\${host}\${req.url}\`);
  }
  
  // Remove www
  if (host.startsWith('www.')) {
    return res.redirect(301, \`\${protocol}://\${host.replace('www.', '')}\${req.url}\`);
  }
  
  // Remove trailing slash (except homepage)
  if (req.path !== '/' && req.path.endsWith('/')) {
    return res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length));
  }
  
  next();
}

module.exports = { enforceCanonical };

// 301 Redirects
const redirects = {
  '/old-page': '/new-page',
  '/blog/old-post': '/blog/new-post'
};

app.use((req, res, next) => {
  const redirect = redirects[req.path];
  if (redirect) {
    return res.redirect(301, redirect);
  }
  next();
});

// Pagination with rel links
router.get('/blog', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const baseUrl = \`\${req.protocol}://\${req.get('host')}\`;
  
  const total = await Post.countDocuments({ published: true });
  const posts = await Post.find({ published: true })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });
  
  const totalPages = Math.ceil(total / perPage);
  
  const pagination = {
    prevUrl: page > 1 ? \`\${baseUrl}/blog?page=\${page - 1}\` : null,
    nextUrl: page < totalPages ? \`\${baseUrl}/blog?page=\${page + 1}\` : null
  };
  
  res.render('blog', { posts, pagination });
});

// In template
/*
<% if (pagination.prevUrl) { %>
<link rel="prev" href="<%= pagination.prevUrl %>">
<% } %>
<% if (pagination.nextUrl) { %>
<link rel="next" href="<%= pagination.nextUrl %>">
<% } %>
*/
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Performance Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

// Enable compression
app.use(compression());

// Security headers
app.use(helmet());

// Static file caching
app.use(express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Image optimization
const sharp = require('sharp');

async function optimizeImage(inputPath, outputPath, width = 1200) {
  await sharp(inputPath)
    .resize(width, null, { withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toFile(outputPath);
}

// Lazy loading helper
function lazyLoadImage(src, alt, className = '') {
  return \`<img 
    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
    data-src="\${src}"
    alt="\${alt}"
    class="lazyload \${className}"
    loading="lazy"
  >\`;
}

// Preload critical resources
function preloadResources() {
  return \`
    <link rel="preload" href="/css/main.css" as="style">
    <link rel="preload" href="/js/main.js" as="script">
    <link rel="preconnect" href="https://fonts.googleapis.com">
  \`;
}

// Cache control middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/static/') || req.path.startsWith('/images/')) {
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  } else if (req.path.endsWith('.html')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});

// Minification
const minify = require('html-minifier').minify;

app.use((req, res, next) => {
  const originalRender = res.render;
  
  res.render = function(view, options, callback) {
    originalRender.call(this, view, options, (err, html) => {
      if (err) return callback ? callback(err) : next(err);
      
      const minified = minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      });
      
      callback ? callback(null, minified) : res.send(minified);
    });
  };
  
  next();
});
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔍 Content Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// utils/content.js
const cheerio = require('cheerio');

// Extract headings for table of contents
function extractHeadings(html) {
  const $ = cheerio.load(html);
  const headings = [];
  
  $('h2, h3, h4, h5, h6').each((i, elem) => {
    const $elem = $(elem);
    const level = parseInt(elem.name.substring(1));
    const text = $elem.text();
    const slug = generateSlug(text);
    
    headings.push({ level, text, slug });
  });
  
  return headings;
}

// Add IDs to headings
function addHeadingIds(html) {
  const $ = cheerio.load(html);
  
  $('h2, h3, h4, h5, h6').each((i, elem) => {
    const $elem = $(elem);
    const slug = generateSlug($elem.text());
    $elem.attr('id', slug);
  });
  
  return $.html();
}

// Calculate reading time
function calculateReadingTime(html, wpm = 200) {
  const $ = cheerio.load(html);
  const text = $.text();
  const wordCount = text.split(/\\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wpm));
}

// Generate excerpt
function generateExcerpt(html, length = 160) {
  const $ = cheerio.load(html);
  const text = $.text().replace(/\\s+/g, ' ').trim();
  
  if (text.length <= length) return text;
  
  const excerpt = text.substring(0, length);
  const lastSpace = excerpt.lastIndexOf(' ');
  
  return excerpt.substring(0, lastSpace) + '...';
}

// Add schema to images
function addImageSchema(html, baseUrl) {
  const $ = cheerio.load(html);
  
  $('img').each((i, elem) => {
    const $elem = $(elem);
    const src = $elem.attr('src');
    const alt = $elem.attr('alt') || '';
    
    if (!alt) {
      console.warn(\`Image missing alt text: \${src}\`);
    }
  });
  
  return $.html();
}

module.exports = {
  extractHeadings,
  addHeadingIds,
  calculateReadingTime,
  generateExcerpt,
  addImageSchema
};
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Node.js SEO Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Server-side rendering:</strong> Render HTML on the server for crawlers</li>
        <li>• <strong>Unique meta tags:</strong> Different title/description per page</li>
        <li>• <strong>Structured data:</strong> Add JSON-LD for rich snippets</li>
        <li>• <strong>XML sitemap:</strong> Auto-generate and keep updated</li>
        <li>• <strong>Clean URLs:</strong> Use slugs instead of IDs</li>
        <li>• <strong>301 redirects:</strong> Handle old URLs properly</li>
        <li>• <strong>Canonical URLs:</strong> Prevent duplicate content</li>
        <li>• <strong>Compression:</strong> Enable gzip compression</li>
        <li>• <strong>Image optimization:</strong> Compress and lazy load images</li>
        <li>• <strong>HTTPS:</strong> Always use SSL in production</li>
        <li>• <strong>Mobile-first:</strong> Responsive design is essential</li>
        <li>• <strong>Page speed:</strong> Minimize, cache, and optimize</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📈 Analytics & Monitoring</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Track 404 errors
app.use((req, res, next) => {
  res.status(404);
  console.warn(\`404 Not Found: \${req.url}\`);
  
  res.render('404', {
    url: req.url,
    seo: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    }
  });
});

// Log crawler visits
app.use((req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const crawlers = ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider'];
  
  if (crawlers.some(bot => userAgent.includes(bot))) {
    console.log(\`Crawler visit: \${userAgent} - \${req.url}\`);
  }
  
  next();
});

// Google Analytics helper
function googleAnalytics(measurementId) {
  return \`
    <script async src="https://www.googletagmanager.com/gtag/js?id=\${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '\${measurementId}');
    </script>
  \`;
}

// Google Search Console verification
function googleSiteVerification(code) {
  return \`<meta name="google-site-verification" content="\${code}">\`;
}
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement dynamic meta tags with Open Graph and Twitter Cards",
    "Generate XML sitemaps and robots.txt automatically",
    "Add structured data (JSON-LD) for rich search results",
    "Create SEO-friendly URLs with proper slug generation",
    "Optimize performance with compression and caching",
    "Implement server-side rendering for better crawlability",
  ],
  practiceInstructions: [
    "Create a SEOMetaTags class for your Express app",
    "Build a dynamic sitemap generator for all routes",
    "Add Article and Product structured data",
    "Implement 301 redirects for URL changes",
    "Enable compression and static file caching",
    "Add canonical URL enforcement middleware",
  ],
  hints: [
    "Use req.protocol and req.get('host') to build absolute URLs",
    "Meta descriptions should be 150-160 characters for optimal display",
    "Always use 301 (permanent) redirects, not 302 (temporary)",
    "JSON-LD structured data should be in <script type='application/ld+json'>",
    "Compression middleware should come before route handlers",
    "Test your structured data with Google's Rich Results Test",
  ],
  solution: `// Complete SEO implementation

const express = require('express');
const compression = require('compression');
const { SEOMetaTags } = require('./utils/seo');
const { StructuredData } = require('./utils/structured-data');

const app = express();
app.use(compression());

// SEO middleware
app.use((req, res, next) => {
  res.locals.baseUrl = \`\${req.protocol}://\${req.get('host')}\`;
  next();
});

// Blog post with full SEO
app.get('/blog/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  const baseUrl = res.locals.baseUrl;
  
  const seo = new SEOMetaTags({
    title: \`\${post.title} | Blog\`,
    description: post.excerpt,
    image: \`\${baseUrl}/images/\${post.image}\`,
    url: \`\${baseUrl}/blog/\${post.slug}\`,
    type: 'article',
    author: post.author
  });
  
  const schema = StructuredData.article({
    title: post.title,
    description: post.excerpt,
    author: post.author,
    publishedDate: post.createdAt.toISOString(),
    modifiedDate: post.updatedAt.toISOString(),
    image: \`\${baseUrl}/images/\${post.image}\`,
    url: \`\${baseUrl}/blog/\${post.slug}\`
  });
  
  res.render('blog-post', {
    post,
    seo: seo.generateTags(),
    schema: StructuredData.toScript(schema)
  });
});

app.listen(3000);`,
};
