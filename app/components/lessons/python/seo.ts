import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "SEO Best Practices for Flask Applications",
  description:
    "Learn how to implement SEO optimization in Flask applications including meta tags, sitemaps, structured data, Open Graph, and server-side rendering.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">SEO Best Practices for Flask Applications</h1>
    
    <p class="mb-4">Master SEO implementation for Flask applications to improve search engine visibility and social media sharing.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🎯 Meta Tags & HTML Head</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Dynamic Meta Tags</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from flask import Flask, render_template, url_for, request
from typing import Optional, Dict

app = Flask(__name__)

class SEOMetaTags:
    """Generate SEO-optimized meta tags"""
    
    def __init__(self, 
                 title: str,
                 description: str,
                 keywords: Optional[str] = None,
                 image: Optional[str] = None,
                 url: Optional[str] = None,
                 type: str = "website",
                 author: Optional[str] = None):
        self.title = title
        self.description = description
        self.keywords = keywords
        self.image = image
        self.url = url or request.url
        self.type = type
        self.author = author
        self.site_name = "My Website"
    
    def generate_tags(self) -> Dict[str, str]:
        """Generate all meta tags"""
        tags = {
            # Basic meta tags
            'title': self.title,
            'description': self.description,
            'keywords': self.keywords or '',
            
            # Open Graph (Facebook, LinkedIn)
            'og:title': self.title,
            'og:description': self.description,
            'og:type': self.type,
            'og:url': self.url,
            'og:site_name': self.site_name,
            
            # Twitter Card
            'twitter:card': 'summary_large_image',
            'twitter:title': self.title,
            'twitter:description': self.description,
        }
        
        if self.image:
            tags.update({
                'og:image': self.image,
                'twitter:image': self.image,
                'og:image:width': '1200',
                'og:image:height': '630',
            })
        
        if self.author:
            tags['author'] = self.author
        
        return tags

# Usage in routes
@app.route('/blog/<slug>')
def blog_post(slug):
    post = get_post_by_slug(slug)
    
    seo = SEOMetaTags(
        title=f"{post.title} | My Blog",
        description=post.excerpt,
        keywords=", ".join(post.tags),
        image=url_for('static', filename=f'images/{post.featured_image}', _external=True),
        url=url_for('blog_post', slug=slug, _external=True),
        type="article",
        author=post.author.name
    )
    
    return render_template('blog_post.html', post=post, seo=seo.generate_tags())

# Base template (templates/base.html)
"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Basic SEO -->
    <title>{{ seo.title }}</title>
    <meta name="description" content="{{ seo.description }}">
    {% if seo.keywords %}
    <meta name="keywords" content="{{ seo.keywords }}">
    {% endif %}
    {% if seo.author %}
    <meta name="author" content="{{ seo.author }}">
    {% endif %}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{ seo['og:url'] }}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{{ seo['og:title'] }}">
    <meta property="og:description" content="{{ seo['og:description'] }}">
    <meta property="og:type" content="{{ seo['og:type'] }}">
    <meta property="og:url" content="{{ seo['og:url'] }}">
    <meta property="og:site_name" content="{{ seo['og:site_name'] }}">
    {% if seo['og:image'] %}
    <meta property="og:image" content="{{ seo['og:image'] }}">
    <meta property="og:image:width" content="{{ seo['og:image:width'] }}">
    <meta property="og:image:height" content="{{ seo['og:image:height'] }}">
    {% endif %}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="{{ seo['twitter:card'] }}">
    <meta name="twitter:title" content="{{ seo['twitter:title'] }}">
    <meta name="twitter:description" content="{{ seo['twitter:description'] }}">
    {% if seo['twitter:image'] %}
    <meta name="twitter:image" content="{{ seo['twitter:image'] }}">
    {% endif %}
    
    <!-- Robots -->
    <meta name="robots" content="index, follow">
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>
"""
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🗺️ XML Sitemap Generation</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from flask import Response, url_for
from datetime import datetime
from typing import List, Dict

class SitemapGenerator:
    """Generate XML sitemap for search engines"""
    
    def __init__(self):
        self.urls: List[Dict] = []
    
    def add_url(self, loc: str, lastmod: str = None, 
                changefreq: str = 'weekly', priority: float = 0.5):
        """Add URL to sitemap"""
        self.urls.append({
            'loc': loc,
            'lastmod': lastmod or datetime.now().strftime('%Y-%m-%d'),
            'changefreq': changefreq,
            'priority': priority
        })
    
    def generate_xml(self) -> str:
        """Generate XML sitemap"""
        xml = '<?xml version="1.0" encoding="UTF-8"?>\\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n'
        
        for url in self.urls:
            xml += '  <url>\\n'
            xml += f'    <loc>{url["loc"]}</loc>\\n'
            xml += f'    <lastmod>{url["lastmod"]}</lastmod>\\n'
            xml += f'    <changefreq>{url["changefreq"]}</changefreq>\\n'
            xml += f'    <priority>{url["priority"]}</priority>\\n'
            xml += '  </url>\\n'
        
        xml += '</urlset>'
        return xml

@app.route('/sitemap.xml')
def sitemap():
    """Generate dynamic sitemap"""
    sitemap = SitemapGenerator()
    
    # Add homepage
    sitemap.add_url(
        loc=url_for('index', _external=True),
        changefreq='daily',
        priority=1.0
    )
    
    # Add static pages
    static_pages = [
        ('about', 'monthly', 0.8),
        ('contact', 'monthly', 0.7),
        ('services', 'weekly', 0.9),
    ]
    
    for page, freq, prio in static_pages:
        sitemap.add_url(
            loc=url_for(page, _external=True),
            changefreq=freq,
            priority=prio
        )
    
    # Add blog posts
    posts = Post.query.filter_by(published=True).all()
    for post in posts:
        sitemap.add_url(
            loc=url_for('blog_post', slug=post.slug, _external=True),
            lastmod=post.updated_at.strftime('%Y-%m-%d'),
            changefreq='monthly',
            priority=0.6
        )
    
    # Add products
    products = Product.query.filter_by(active=True).all()
    for product in products:
        sitemap.add_url(
            loc=url_for('product_detail', id=product.id, _external=True),
            lastmod=product.updated_at.strftime('%Y-%m-%d'),
            changefreq='weekly',
            priority=0.8
        )
    
    return Response(sitemap.generate_xml(), mimetype='application/xml')

# robots.txt
@app.route('/robots.txt')
def robots():
    """Generate robots.txt"""
    lines = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        'Disallow: /private/',
        '',
        f'Sitemap: {url_for("sitemap", _external=True)}'
    ]
    return Response('\\n'.join(lines), mimetype='text/plain')
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Structured Data (Schema.org)</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
import json
from typing import Dict, Any

class StructuredData:
    """Generate JSON-LD structured data for rich snippets"""
    
    @staticmethod
    def article(title: str, description: str, author: str, 
                published_date: str, modified_date: str, 
                image: str, url: str) -> str:
        """Generate Article schema"""
        data = {
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
            "datePublished": published_date,
            "dateModified": modified_date,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": url
            }
        }
        return json.dumps(data, indent=2)
    
    @staticmethod
    def product(name: str, description: str, image: str,
                price: float, currency: str, availability: str,
                rating: float = None, review_count: int = None) -> str:
        """Generate Product schema"""
        data = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": name,
            "description": description,
            "image": image,
            "offers": {
                "@type": "Offer",
                "price": price,
                "priceCurrency": currency,
                "availability": f"https://schema.org/{availability}",
                "url": image
            }
        }
        
        if rating and review_count:
            data["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": rating,
                "reviewCount": review_count
            }
        
        return json.dumps(data, indent=2)
    
    @staticmethod
    def breadcrumb(items: List[Dict[str, str]]) -> str:
        """Generate BreadcrumbList schema"""
        breadcrumb_items = []
        for idx, item in enumerate(items, 1):
            breadcrumb_items.append({
                "@type": "ListItem",
                "position": idx,
                "name": item['name'],
                "item": item['url']
            })
        
        data = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumb_items
        }
        return json.dumps(data, indent=2)
    
    @staticmethod
    def organization(name: str, logo: str, url: str, 
                     social_links: List[str]) -> str:
        """Generate Organization schema"""
        data = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": name,
            "url": url,
            "logo": logo,
            "sameAs": social_links
        }
        return json.dumps(data, indent=2)

# Usage in routes
@app.route('/blog/<slug>')
def blog_post(slug):
    post = get_post_by_slug(slug)
    
    # Generate structured data
    article_schema = StructuredData.article(
        title=post.title,
        description=post.excerpt,
        author=post.author.name,
        published_date=post.created_at.isoformat(),
        modified_date=post.updated_at.isoformat(),
        image=url_for('static', filename=f'images/{post.image}', _external=True),
        url=url_for('blog_post', slug=slug, _external=True)
    )
    
    breadcrumbs = StructuredData.breadcrumb([
        {'name': 'Home', 'url': url_for('index', _external=True)},
        {'name': 'Blog', 'url': url_for('blog', _external=True)},
        {'name': post.title, 'url': url_for('blog_post', slug=slug, _external=True)}
    ])
    
    return render_template('blog_post.html', 
                         post=post, 
                         article_schema=article_schema,
                         breadcrumbs=breadcrumbs)

# In template
"""
<script type="application/ld+json">
{{ article_schema | safe }}
</script>
<script type="application/ld+json">
{{ breadcrumbs | safe }}
</script>
"""
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔗 URL Structure & Redirects</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from flask import redirect, url_for, request
from functools import wraps

# SEO-friendly URL slugs
def generate_slug(title: str) -> str:
    """Generate SEO-friendly slug from title"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

# Canonical URL enforcement
@app.before_request
def enforce_canonical():
    """Redirect to canonical URL (www to non-www, http to https)"""
    url = request.url
    
    # Force HTTPS in production
    if not url.startswith('https://') and app.config.get('ENV') == 'production':
        return redirect(url.replace('http://', 'https://'), code=301)
    
    # Remove www
    if '://www.' in url:
        return redirect(url.replace('://www.', '://'), code=301)
    
    # Remove trailing slash (except for homepage)
    if len(request.path) > 1 and request.path.endswith('/'):
        return redirect(request.path.rstrip('/'), code=301)

# 301 Redirects for old URLs
redirects = {
    '/old-page': '/new-page',
    '/blog/old-post': '/blog/new-post',
}

@app.before_request
def handle_redirects():
    """Handle 301 redirects"""
    if request.path in redirects:
        return redirect(redirects[request.path], code=301)

# Pagination with rel="next" and rel="prev"
@app.route('/blog')
def blog():
    page = request.args.get('page', 1, type=int)
    per_page = 10
    
    posts = Post.query.paginate(page=page, per_page=per_page)
    
    # Generate pagination links
    prev_url = url_for('blog', page=page-1, _external=True) if posts.has_prev else None
    next_url = url_for('blog', page=page+1, _external=True) if posts.has_next else None
    
    return render_template('blog.html', 
                         posts=posts.items,
                         prev_url=prev_url,
                         next_url=next_url)

# In template
"""
{% if prev_url %}
<link rel="prev" href="{{ prev_url }}">
{% endif %}
{% if next_url %}
<link rel="next" href="{{ next_url }}">
{% endif %}
"""
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Page Speed Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from flask_compress import Compress
from flask_assets import Environment, Bundle

# Enable compression
compress = Compress(app)

# Asset bundling and minification
assets = Environment(app)

css_bundle = Bundle(
    'css/style.css',
    'css/responsive.css',
    filters='cssmin',
    output='dist/main.min.css'
)

js_bundle = Bundle(
    'js/main.js',
    'js/utils.js',
    filters='jsmin',
    output='dist/main.min.js'
)

assets.register('css_all', css_bundle)
assets.register('js_all', js_bundle)

# Image optimization
from PIL import Image
import os

def optimize_image(image_path: str, max_width: int = 1200, quality: int = 85):
    """Optimize and resize images"""
    img = Image.open(image_path)
    
    # Resize if too large
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)
    
    # Convert to RGB if necessary
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Save optimized
    img.save(image_path, 'JPEG', quality=quality, optimize=True)

# Lazy loading images
"""
<img src="placeholder.jpg" 
     data-src="actual-image.jpg" 
     alt="Description"
     loading="lazy"
     class="lazyload">
"""

# Preload critical resources
"""
<link rel="preload" href="/static/css/main.css" as="style">
<link rel="preload" href="/static/js/main.js" as="script">
<link rel="preload" href="/static/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
"""

# Cache headers
@app.after_request
def add_cache_headers(response):
    """Add cache control headers"""
    # Static assets (1 year)
    if request.path.startswith('/static/'):
        response.cache_control.max_age = 31536000
        response.cache_control.public = True
    
    # HTML pages (5 minutes)
    elif response.content_type == 'text/html; charset=utf-8':
        response.cache_control.max_age = 300
        response.cache_control.public = True
    
    return response
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔍 Content Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Automatic heading hierarchy
def extract_headings(content: str) -> List[Dict[str, str]]:
    """Extract headings for table of contents"""
    import re
    headings = []
    pattern = r'<h([2-6])>(.*?)</h\\1>'
    
    for match in re.finditer(pattern, content):
        level = int(match.group(1))
        text = match.group(2)
        slug = generate_slug(text)
        headings.append({
            'level': level,
            'text': text,
            'slug': slug
        })
    
    return headings

# Add IDs to headings for anchor links
def add_heading_ids(content: str) -> str:
    """Add IDs to headings for deep linking"""
    import re
    
    def replace_heading(match):
        level = match.group(1)
        text = match.group(2)
        slug = generate_slug(text)
        return f'<h{level} id="{slug}">{text}</h{level}>'
    
    pattern = r'<h([2-6])>(.*?)</h\\1>'
    return re.sub(pattern, replace_heading, content)

# Reading time estimation
def estimate_reading_time(content: str, wpm: int = 200) -> int:
    """Estimate reading time in minutes"""
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(content, 'html.parser')
    text = soup.get_text()
    word_count = len(text.split())
    
    return max(1, round(word_count / wpm))

# Generate excerpt
def generate_excerpt(content: str, length: int = 160) -> str:
    """Generate meta description from content"""
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(content, 'html.parser')
    text = soup.get_text()
    
    # Clean whitespace
    text = ' '.join(text.split())
    
    if len(text) <= length:
        return text
    
    # Truncate at word boundary
    excerpt = text[:length].rsplit(' ', 1)[0]
    return excerpt + '...'
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📱 Mobile Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Responsive meta viewport
"""
<meta name="viewport" content="width=device-width, initial-scale=1.0">
"""

# Detect mobile users
from flask import request

def is_mobile():
    """Detect if user is on mobile device"""
    user_agent = request.headers.get('User-Agent', '').lower()
    mobile_keywords = ['mobile', 'android', 'iphone', 'ipad', 'windows phone']
    return any(keyword in user_agent for keyword in mobile_keywords)

# Serve different content for mobile
@app.route('/page')
def page():
    if is_mobile():
        return render_template('mobile/page.html')
    return render_template('desktop/page.html')

# AMP (Accelerated Mobile Pages)
@app.route('/blog/<slug>/amp')
def blog_post_amp(slug):
    post = get_post_by_slug(slug)
    return render_template('amp/blog_post.html', post=post)

# Add AMP link in regular page
"""
<link rel="amphtml" href="{{ url_for('blog_post_amp', slug=post.slug, _external=True) }}">
"""
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ SEO Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Unique titles:</strong> Each page should have a unique, descriptive title (50-60 chars)</li>
        <li>• <strong>Meta descriptions:</strong> Compelling descriptions that encourage clicks (150-160 chars)</li>
        <li>• <strong>Semantic HTML:</strong> Use proper heading hierarchy (H1 → H2 → H3)</li>
        <li>• <strong>Alt text:</strong> Descriptive alt text for all images</li>
        <li>• <strong>Clean URLs:</strong> SEO-friendly slugs without special characters</li>
        <li>• <strong>XML sitemap:</strong> Keep it updated and submit to search engines</li>
        <li>• <strong>Structured data:</strong> Implement JSON-LD for rich snippets</li>
        <li>• <strong>Mobile-first:</strong> Ensure mobile responsiveness</li>
        <li>• <strong>Page speed:</strong> Optimize images, minify CSS/JS, enable compression</li>
        <li>• <strong>HTTPS:</strong> Always use SSL certificates</li>
        <li>• <strong>Canonical URLs:</strong> Avoid duplicate content issues</li>
        <li>• <strong>Internal linking:</strong> Link to related content within your site</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📈 Analytics & Monitoring</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Google Analytics
"""
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
"""

# Google Search Console verification
"""
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE">
"""

# Track 404 errors
@app.errorhandler(404)
def page_not_found(e):
    # Log 404 for SEO monitoring
    app.logger.warning(f'404 error: {request.url}')
    return render_template('404.html'), 404

# Monitor crawl errors
import logging
from datetime import datetime

crawl_logger = logging.getLogger('crawl_errors')

@app.before_request
def log_crawlers():
    """Log search engine crawlers"""
    user_agent = request.headers.get('User-Agent', '')
    crawlers = ['Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot']
    
    if any(bot in user_agent for bot in crawlers):
        crawl_logger.info(f'{datetime.now()} - {user_agent} - {request.url}')
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement dynamic meta tags for SEO and social sharing",
    "Generate XML sitemaps and robots.txt files",
    "Add structured data (JSON-LD) for rich snippets",
    "Create SEO-friendly URLs with proper redirects",
    "Optimize page speed with compression and caching",
    "Implement mobile-first responsive design",
  ],
  practiceInstructions: [
    "Create a meta tag generator class for your Flask app",
    "Implement dynamic sitemap generation for all pages",
    "Add Article schema to blog posts",
    "Set up 301 redirects for old URLs",
    "Enable compression and asset minification",
    "Add proper heading hierarchy to all pages",
  ],
  hints: [
    "Meta descriptions should be 150-160 characters for best display",
    "Use _external=True in url_for() to generate absolute URLs for sitemaps",
    "JSON-LD structured data goes in <script type='application/ld+json'>",
    "Always use 301 redirects for permanent URL changes",
    "Compress images before uploading to reduce page load time",
    "Test your pages with Google's Rich Results Test tool",
  ],
  solution: `# Complete SEO implementation example

from flask import Flask, render_template, url_for, Response
from flask_compress import Compress
import json

app = Flask(__name__)
Compress(app)

class SEO:
    def __init__(self, title, description, image=None):
        self.title = title
        self.description = description
        self.image = image
    
    def meta_tags(self):
        return {
            'title': self.title,
            'description': self.description,
            'og:title': self.title,
            'og:description': self.description,
            'og:image': self.image,
            'twitter:card': 'summary_large_image'
        }

@app.route('/blog/<slug>')
def blog_post(slug):
    post = get_post(slug)
    
    seo = SEO(
        title=f"{post.title} | My Blog",
        description=post.excerpt,
        image=url_for('static', filename=post.image, _external=True)
    )
    
    # Structured data
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "author": {"@type": "Person", "name": post.author}
    }
    
    return render_template('post.html', 
                         post=post, 
                         seo=seo.meta_tags(),
                         schema=json.dumps(schema))

@app.route('/sitemap.xml')
def sitemap():
    urls = []
    for post in Post.query.all():
        urls.append({
            'loc': url_for('blog_post', slug=post.slug, _external=True),
            'lastmod': post.updated_at.strftime('%Y-%m-%d'),
            'priority': '0.8'
        })
    
    xml = render_template('sitemap.xml', urls=urls)
    return Response(xml, mimetype='application/xml')`,
};
