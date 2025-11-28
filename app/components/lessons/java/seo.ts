import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "SEO Best Practices for Java & Spring Boot",
  description:
    "Learn how to implement comprehensive SEO strategies in Spring Boot applications including meta tags, sitemaps, structured data, and performance optimization.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">SEO Best Practices for Java & Spring Boot</h1>
    
    <p class="mb-4">Master SEO implementation in Spring Boot applications to improve search engine rankings and user engagement.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🎯 Meta Tags & Open Graph</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Dynamic Meta Tag Generator</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// dto/SEOMetaTags.java
package com.example.dto;

import lombok.Builder;
import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
public class SEOMetaTags {
    private String title;
    private String description;
    private String keywords;
    private String image;
    private String url;
    private String type;
    private String author;
    
    @Builder.Default
    private String siteName = "My Website";
    
    @Builder.Default
    private String twitterHandle = "@mywebsite";
    
    public Map<String, String> generateTags() {
        Map<String, String> tags = new HashMap<>();
        
        // Basic meta tags
        tags.put("title", title);
        tags.put("description", description);
        if (keywords != null) tags.put("keywords", keywords);
        
        // Open Graph
        tags.put("og:title", title);
        tags.put("og:description", description);
        tags.put("og:type", type != null ? type : "website");
        tags.put("og:url", url);
        tags.put("og:site_name", siteName);
        
        // Twitter Card
        tags.put("twitter:card", "summary_large_image");
        tags.put("twitter:site", twitterHandle);
        tags.put("twitter:title", title);
        tags.put("twitter:description", description);
        
        if (image != null) {
            tags.put("og:image", image);
            tags.put("og:image:width", "1200");
            tags.put("og:image:height", "630");
            tags.put("twitter:image", image);
        }
        
        if (author != null) {
            tags.put("author", author);
            tags.put("article:author", author);
        }
        
        return tags;
    }
}

// controller/BlogController.java
@Controller
@RequestMapping("/blog")
public class BlogController {
    
    @Autowired
    private BlogService blogService;
    
    @Autowired
    private HttpServletRequest request;
    
    @GetMapping("/{slug}")
    public String getBlogPost(@PathVariable String slug, Model model) {
        Post post = blogService.findBySlug(slug);
        
        String baseUrl = getBaseUrl();
        
        SEOMetaTags seo = SEOMetaTags.builder()
            .title(post.getTitle() + " | My Blog")
            .description(post.getExcerpt())
            .keywords(String.join(", ", post.getTags()))
            .image(baseUrl + "/images/" + post.getFeaturedImage())
            .url(baseUrl + "/blog/" + slug)
            .type("article")
            .author(post.getAuthor().getName())
            .build();
        
        model.addAttribute("post", post);
        model.addAttribute("seo", seo.generateTags());
        
        return "blog/post";
    }
    
    private String getBaseUrl() {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        
        StringBuilder url = new StringBuilder();
        url.append(scheme).append("://").append(serverName);
        
        if ((scheme.equals("http") && serverPort != 80) ||
            (scheme.equals("https") && serverPort != 443)) {
            url.append(":").append(serverPort);
        }
        
        return url.toString();
    }
}

<!-- Thymeleaf template (blog/post.html) -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title th:text="${"$"}{seo.title}">Blog Post</title>
    <meta name="description" th:content="${"$"}{seo.description}">
    <meta name="keywords" th:if="${"$"}{seo.keywords}" th:content="${"$"}{seo.keywords}">
    <meta name="author" th:if="${"$"}{seo.author}" th:content="${"$"}{seo.author}">
    
    <!-- Canonical URL -->
    <link rel="canonical" th:href="${"$"}{seo['og:url']}">
    
    <!-- Open Graph -->
    <meta property="og:title" th:content="${"$"}{seo['og:title']}">
    <meta property="og:description" th:content="${"$"}{seo['og:description']}">
    <meta property="og:type" th:content="${"$"}{seo['og:type']}">
    <meta property="og:url" th:content="${"$"}{seo['og:url']}">
    <meta property="og:site_name" th:content="${"$"}{seo['og:site_name']}">
    <meta property="og:image" th:if="${"$"}{seo['og:image']}" th:content="${"$"}{seo['og:image']}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" th:content="${"$"}{seo['twitter:card']}">
    <meta name="twitter:title" th:content="${"$"}{seo['twitter:title']}">
    <meta name="twitter:description" th:content="${"$"}{seo['twitter:description']}">
    <meta name="twitter:image" th:if="${"$"}{seo['twitter:image']}" th:content="${"$"}{seo['twitter:image']}">
    
    <!-- Robots -->
    <meta name="robots" content="index, follow">
</head>
<body>
    <article>
        <h1 th:text="${"$"}{post.title}">Post Title</h1>
        <div th:utext="${"$"}{post.content}"></div>
    </article>
</body>
</html>
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🗺️ XML Sitemap Generation</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// dto/SitemapUrl.java
package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SitemapUrl {
    private String loc;
    private LocalDate lastmod;
    private String changefreq;
    private Double priority;
}

// service/SitemapService.java
@Service
public class SitemapService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private HttpServletRequest request;
    
    public String generateSitemap() {
        List<SitemapUrl> urls = new ArrayList<>();
        String baseUrl = getBaseUrl();
        
        // Add homepage
        urls.add(new SitemapUrl(
            baseUrl,
            LocalDate.now(),
            "daily",
            1.0
        ));
        
        // Add static pages
        urls.add(new SitemapUrl(baseUrl + "/about", LocalDate.now(), "monthly", 0.8));
        urls.add(new SitemapUrl(baseUrl + "/contact", LocalDate.now(), "monthly", 0.7));
        urls.add(new SitemapUrl(baseUrl + "/services", LocalDate.now(), "weekly", 0.9));
        
        // Add blog posts
        List<Post> posts = postRepository.findByPublishedTrue();
        posts.forEach(post -> {
            urls.add(new SitemapUrl(
                baseUrl + "/blog/" + post.getSlug(),
                post.getUpdatedAt().toLocalDate(),
                "monthly",
                0.6
            ));
        });
        
        // Add products
        List<Product> products = productRepository.findByActiveTrue();
        products.forEach(product -> {
            urls.add(new SitemapUrl(
                baseUrl + "/products/" + product.getId(),
                product.getUpdatedAt().toLocalDate(),
                "weekly",
                0.8
            ));
        });
        
        return buildSitemapXML(urls);
    }
    
    private String buildSitemapXML(List<SitemapUrl> urls) {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n");
        xml.append("<urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\">\\n");
        
        for (SitemapUrl url : urls) {
            xml.append("  <url>\\n");
            xml.append("    <loc>").append(url.getLoc()).append("</loc>\\n");
            xml.append("    <lastmod>").append(url.getLastmod()).append("</lastmod>\\n");
            xml.append("    <changefreq>").append(url.getChangefreq()).append("</changefreq>\\n");
            xml.append("    <priority>").append(url.getPriority()).append("</priority>\\n");
            xml.append("  </url>\\n");
        }
        
        xml.append("</urlset>");
        return xml.toString();
    }
    
    private String getBaseUrl() {
        return request.getScheme() + "://" + 
               request.getServerName() + 
               (request.getServerPort() != 80 && request.getServerPort() != 443 
                   ? ":" + request.getServerPort() 
                   : "");
    }
}

// controller/SitemapController.java
@RestController
public class SitemapController {
    
    @Autowired
    private SitemapService sitemapService;
    
    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemap() {
        String sitemap = sitemapService.generateSitemap();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, "application/xml")
            .body(sitemap);
    }
    
    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getRobotsTxt(HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName();
        
        StringBuilder robots = new StringBuilder();
        robots.append("User-agent: *\\n");
        robots.append("Allow: /\\n");
        robots.append("Disallow: /admin/\\n");
        robots.append("Disallow: /api/\\n");
        robots.append("Disallow: /private/\\n");
        robots.append("\\n");
        robots.append("Sitemap: ").append(baseUrl).append("/sitemap.xml\\n");
        
        return ResponseEntity.ok(robots.toString());
    }
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Structured Data (JSON-LD)</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// util/StructuredDataGenerator.java
package com.example.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.List;
import java.util.Map;

@Component
public class StructuredDataGenerator {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String generateArticleSchema(
        String title,
        String description,
        String author,
        String publishedDate,
        String modifiedDate,
        String image,
        String url
    ) {
        ObjectNode schema = objectMapper.createObjectNode();
        schema.put("@context", "https://schema.org");
        schema.put("@type", "Article");
        schema.put("headline", title);
        schema.put("description", description);
        schema.put("image", image);
        
        // Author
        ObjectNode authorNode = objectMapper.createObjectNode();
        authorNode.put("@type", "Person");
        authorNode.put("name", author);
        schema.set("author", authorNode);
        
        // Publisher
        ObjectNode publisher = objectMapper.createObjectNode();
        publisher.put("@type", "Organization");
        publisher.put("name", "My Website");
        
        ObjectNode logo = objectMapper.createObjectNode();
        logo.put("@type", "ImageObject");
        logo.put("url", "https://example.com/logo.png");
        publisher.set("logo", logo);
        
        schema.set("publisher", publisher);
        
        schema.put("datePublished", publishedDate);
        schema.put("dateModified", modifiedDate);
        
        // Main entity
        ObjectNode mainEntity = objectMapper.createObjectNode();
        mainEntity.put("@type", "WebPage");
        mainEntity.put("@id", url);
        schema.set("mainEntityOfPage", mainEntity);
        
        return toJsonLdScript(schema);
    }
    
    public String generateProductSchema(
        String name,
        String description,
        String image,
        Double price,
        String currency,
        String availability,
        Double rating,
        Integer reviewCount,
        String brand
    ) {
        ObjectNode schema = objectMapper.createObjectNode();
        schema.put("@context", "https://schema.org");
        schema.put("@type", "Product");
        schema.put("name", name);
        schema.put("description", description);
        schema.put("image", image);
        
        // Offers
        ObjectNode offers = objectMapper.createObjectNode();
        offers.put("@type", "Offer");
        offers.put("price", price);
        offers.put("priceCurrency", currency);
        offers.put("availability", "https://schema.org/" + availability);
        schema.set("offers", offers);
        
        // Brand
        if (brand != null) {
            ObjectNode brandNode = objectMapper.createObjectNode();
            brandNode.put("@type", "Brand");
            brandNode.put("name", brand);
            schema.set("brand", brandNode);
        }
        
        // Rating
        if (rating != null && reviewCount != null) {
            ObjectNode aggregateRating = objectMapper.createObjectNode();
            aggregateRating.put("@type", "AggregateRating");
            aggregateRating.put("ratingValue", rating);
            aggregateRating.put("reviewCount", reviewCount);
            schema.set("aggregateRating", aggregateRating);
        }
        
        return toJsonLdScript(schema);
    }
    
    public String generateBreadcrumbSchema(List<Map<String, String>> items) {
        ObjectNode schema = objectMapper.createObjectNode();
        schema.put("@context", "https://schema.org");
        schema.put("@type", "BreadcrumbList");
        
        ArrayNode itemList = objectMapper.createArrayNode();
        
        for (int i = 0; i < items.size(); i++) {
            Map<String, String> item = items.get(i);
            ObjectNode listItem = objectMapper.createObjectNode();
            listItem.put("@type", "ListItem");
            listItem.put("position", i + 1);
            listItem.put("name", item.get("name"));
            listItem.put("item", item.get("url"));
            itemList.add(listItem);
        }
        
        schema.set("itemListElement", itemList);
        
        return toJsonLdScript(schema);
    }
    
    public String generateOrganizationSchema(
        String name,
        String logo,
        String url,
        List<String> socialLinks
    ) {
        ObjectNode schema = objectMapper.createObjectNode();
        schema.put("@context", "https://schema.org");
        schema.put("@type", "Organization");
        schema.put("name", name);
        schema.put("url", url);
        schema.put("logo", logo);
        
        ArrayNode sameAs = objectMapper.createArrayNode();
        socialLinks.forEach(sameAs::add);
        schema.set("sameAs", sameAs);
        
        return toJsonLdScript(schema);
    }
    
    private String toJsonLdScript(ObjectNode schema) {
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(schema);
            return "<script type=\\"application/ld+json\\">\\n" + json + "\\n</script>";
        } catch (Exception e) {
            throw new RuntimeException("Error generating JSON-LD", e);
        }
    }
}

// Usage in controller
@GetMapping("/blog/{slug}")
public String getBlogPost(@PathVariable String slug, Model model) {
    Post post = blogService.findBySlug(slug);
    String baseUrl = getBaseUrl();
    
    String articleSchema = structuredDataGenerator.generateArticleSchema(
        post.getTitle(),
        post.getExcerpt(),
        post.getAuthor().getName(),
        post.getCreatedAt().toString(),
        post.getUpdatedAt().toString(),
        baseUrl + "/images/" + post.getFeaturedImage(),
        baseUrl + "/blog/" + slug
    );
    
    List<Map<String, String>> breadcrumbs = List.of(
        Map.of("name", "Home", "url", baseUrl),
        Map.of("name", "Blog", "url", baseUrl + "/blog"),
        Map.of("name", post.getTitle(), "url", baseUrl + "/blog/" + slug)
    );
    
    String breadcrumbSchema = structuredDataGenerator.generateBreadcrumbSchema(breadcrumbs);
    
    model.addAttribute("articleSchema", articleSchema);
    model.addAttribute("breadcrumbSchema", breadcrumbSchema);
    
    return "blog/post";
}

<!-- In Thymeleaf template -->
[(${"$"}{articleSchema})]
[(${"$"}{breadcrumbSchema})]
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔗 URL Optimization & Redirects</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// util/SlugGenerator.java
@Component
public class SlugGenerator {
    
    public String generateSlug(String text) {
        String slug = text.toLowerCase()
            .replaceAll("[^a-z0-9\\\\s-]", "")
            .replaceAll("\\\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
        
        return slug;
    }
}

// filter/CanonicalUrlFilter.java
@Component
@Order(1)
public class CanonicalUrlFilter implements Filter {
    
    @Value("${"$"}{app.enforce-https:true}")
    private boolean enforceHttps;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        
        String scheme = req.getScheme();
        String serverName = req.getServerName();
        String uri = req.getRequestURI();
        String queryString = req.getQueryString();
        
        // Force HTTPS in production
        if (enforceHttps && "http".equals(scheme)) {
            String redirectUrl = "https://" + serverName + uri;
            if (queryString != null) {
                redirectUrl += "?" + queryString;
            }
            res.sendRedirect(redirectUrl);
            return;
        }
        
        // Remove www
        if (serverName.startsWith("www.")) {
            String redirectUrl = scheme + "://" + serverName.substring(4) + uri;
            if (queryString != null) {
                redirectUrl += "?" + queryString;
            }
            res.sendRedirect(redirectUrl);
            return;
        }
        
        // Remove trailing slash
        if (uri.length() > 1 && uri.endsWith("/")) {
            String redirectUrl = uri.substring(0, uri.length() - 1);
            if (queryString != null) {
                redirectUrl += "?" + queryString;
            }
            res.sendRedirect(redirectUrl);
            return;
        }
        
        chain.doFilter(request, response);
    }
}

// config/RedirectConfig.java
@Configuration
public class RedirectConfig implements WebMvcConfigurer {
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 301 redirects
        registry.addRedirectViewController("/old-page", "/new-page")
            .setStatusCode(HttpStatus.MOVED_PERMANENTLY);
        
        registry.addRedirectViewController("/blog/old-post", "/blog/new-post")
            .setStatusCode(HttpStatus.MOVED_PERMANENTLY);
    }
}

// Pagination with rel links
@GetMapping("/blog")
public String getBlog(
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "10") int size,
    Model model
) {
    Page<Post> posts = postService.findAll(PageRequest.of(page - 1, size));
    String baseUrl = getBaseUrl();
    
    String prevUrl = page > 1 ? baseUrl + "/blog?page=" + (page - 1) : null;
    String nextUrl = posts.hasNext() ? baseUrl + "/blog?page=" + (page + 1) : null;
    
    model.addAttribute("posts", posts.getContent());
    model.addAttribute("prevUrl", prevUrl);
    model.addAttribute("nextUrl", nextUrl);
    
    return "blog/list";
}

<!-- In template -->
<link th:if="${"$"}{prevUrl}" rel="prev" th:href="${"$"}{prevUrl}">
<link th:if="${"$"}{nextUrl}" rel="next" th:href="${"$"}{nextUrl}">
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Performance Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Add to pom.xml
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
&lt;/dependency&gt;

// application.properties
server.compression.enabled=true
server.compression.mime-types=text/html,text/xml,text/plain,text/css,application/javascript,application/json
server.compression.min-response-size=1024

// Static resource caching
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/")
            .setCacheControl(CacheControl.maxAge(365, TimeUnit.DAYS));
        
        registry.addResourceHandler("/images/**")
            .addResourceLocations("classpath:/static/images/")
            .setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS));
    }
}

// Response caching headers
@Configuration
public class CacheConfig {
    
    @Bean
    public Filter cacheControlFilter() {
        return (request, response, chain) -> {
            HttpServletRequest req = (HttpServletRequest) request;
            HttpServletResponse res = (HttpServletResponse) response;
            
            String uri = req.getRequestURI();
            
            if (uri.startsWith("/static/") || uri.startsWith("/images/")) {
                res.setHeader("Cache-Control", "public, max-age=31536000");
            } else if (uri.endsWith(".html")) {
                res.setHeader("Cache-Control", "public, max-age=300");
            }
            
            chain.doFilter(request, response);
        };
    }
}

// Image optimization service
@Service
public class ImageOptimizationService {
    
    public void optimizeImage(String inputPath, String outputPath, int maxWidth) 
        throws IOException {
        
        BufferedImage originalImage = ImageIO.read(new File(inputPath));
        
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        
        if (width > maxWidth) {
            int newHeight = (height * maxWidth) / width;
            
            BufferedImage resizedImage = new BufferedImage(
                maxWidth, newHeight, BufferedImage.TYPE_INT_RGB
            );
            
            Graphics2D g = resizedImage.createGraphics();
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
                             RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.drawImage(originalImage, 0, 0, maxWidth, newHeight, null);
            g.dispose();
            
            ImageIO.write(resizedImage, "jpg", new File(outputPath));
        }
    }
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Spring Boot SEO Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Server-side rendering:</strong> Use Thymeleaf for SEO-friendly HTML</li>
        <li>• <strong>Unique meta tags:</strong> Generate dynamic meta tags per page</li>
        <li>• <strong>Structured data:</strong> Implement JSON-LD for rich snippets</li>
        <li>• <strong>XML sitemap:</strong> Auto-generate and keep updated</li>
        <li>• <strong>Clean URLs:</strong> Use meaningful slugs instead of IDs</li>
        <li>• <strong>301 redirects:</strong> Handle URL changes properly</li>
        <li>• <strong>Canonical URLs:</strong> Enforce one URL per resource</li>
        <li>• <strong>Compression:</strong> Enable gzip/deflate compression</li>
        <li>• <strong>Static caching:</strong> Set long cache times for assets</li>
        <li>• <strong>HTTPS:</strong> Always use SSL in production</li>
        <li>• <strong>Mobile-first:</strong> Responsive design is essential</li>
        <li>• <strong>Performance:</strong> Optimize images and minimize resources</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📈 Analytics & Monitoring</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Error handler for 404s
@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(HttpServletRequest request, Exception ex) {
        logger.warn("404 Not Found: {}", request.getRequestURI());
        return "error/404";
    }
}

// Log crawler visits
@Component
public class CrawlerLoggingFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(CrawlerLoggingFilter.class);
    
    private static final List<String> CRAWLERS = List.of(
        "Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider"
    );
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        String userAgent = req.getHeader("User-Agent");
        
        if (userAgent != null && 
            CRAWLERS.stream().anyMatch(userAgent::contains)) {
            logger.info("Crawler visit: {} - {}", userAgent, req.getRequestURI());
        }
        
        chain.doFilter(request, response);
    }
}
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement dynamic meta tags with SEOMetaTags class",
    "Generate XML sitemaps automatically with Spring Boot",
    "Add structured data using JSON-LD for rich results",
    "Create SEO-friendly URLs with slug generation",
    "Implement 301 redirects and canonical URL enforcement",
    "Optimize performance with compression and caching",
  ],
  practiceInstructions: [
    "Create SEOMetaTags DTO for your Spring Boot app",
    "Build SitemapService to generate XML sitemaps",
    "Add Article and Product structured data schemas",
    "Implement CanonicalUrlFilter for URL normalization",
    "Enable compression in application.properties",
    "Set up static resource caching with WebMvcConfigurer",
  ],
  hints: [
    "Use @Builder on DTOs for clean object creation",
    "Thymeleaf's [(${variable})] syntax outputs unescaped HTML",
    "ObjectMapper from Jackson generates clean JSON-LD",
    "Filters with @Order(1) run before other filters",
    "Cache-Control headers improve repeat visit performance",
    "Test structured data with Google's Rich Results Test tool",
  ],
  solution: `// Complete SEO implementation

@Controller
@RequestMapping("/blog")
public class BlogController {
    
    @Autowired
    private BlogService blogService;
    
    @Autowired
    private StructuredDataGenerator structuredDataGenerator;
    
    @GetMapping("/{slug}")
    public String getPost(@PathVariable String slug, 
                         HttpServletRequest request, Model model) {
        Post post = blogService.findBySlug(slug);
        String baseUrl = getBaseUrl(request);
        
        // SEO Meta Tags
        SEOMetaTags seo = SEOMetaTags.builder()
            .title(post.getTitle() + " | Blog")
            .description(post.getExcerpt())
            .keywords(String.join(", ", post.getTags()))
            .image(baseUrl + "/images/" + post.getImage())
            .url(baseUrl + "/blog/" + slug)
            .type("article")
            .author(post.getAuthor())
            .build();
        
        // Structured Data
        String schema = structuredDataGenerator.generateArticleSchema(
            post.getTitle(),
            post.getExcerpt(),
            post.getAuthor(),
            post.getCreatedAt().toString(),
            post.getUpdatedAt().toString(),
            baseUrl + "/images/" + post.getImage(),
            baseUrl + "/blog/" + slug
        );
        
        model.addAttribute("post", post);
        model.addAttribute("seo", seo.generateTags());
        model.addAttribute("schema", schema);
        
        return "blog/post";
    }
    
    private String getBaseUrl(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName();
    }
}`,
};
