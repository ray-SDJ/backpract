import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "API Practice: Countries & Cities",
  description:
    "Practice making HTTP requests in Java using HttpClient. Work with RESTful APIs to perform CRUD operations on country and city data.",
  difficulty: "Intermediate",
  objectives: [
    "Use Java 11+ HttpClient for HTTP requests",
    "Parse JSON responses with Gson",
    "Implement GET requests with query parameters",
    "Create POST/PUT/DELETE operations",
    "Handle API errors gracefully",
  ],
  content: `<div class="lesson-content">
    <h2>🌍 Java HTTP Client Practice</h2>
    <p>In this lesson, you'll use Java's modern HttpClient (Java 11+) and Gson to interact with our Countries API. This provides hands-on practice with RESTful API consumption.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">📦 Dependencies (Maven)</h4>
      <pre class="code-block">
        <code>
&lt;dependencies&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;com.google.code.gson&lt;/groupId&gt;
        &lt;artifactId&gt;gson&lt;/artifactId&gt;
        &lt;version&gt;2.10.1&lt;/version&gt;
    &lt;/dependency&gt;
&lt;/dependencies&gt;
        </code>
      </pre>
      <p class="mt-2">HttpClient is included in Java 11+, Gson is for JSON parsing.</p>
    </div>

    <h2>📖 Part 1: Basic GET Request</h2>
    <p>Let's create a simple client to fetch all countries:</p>

    <pre class="code-block">
      <code>
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class CountriesClient {
    private static final String BASE_URL = "http://localhost:3000/api";
    private final HttpClient client;
    private final Gson gson;
    
    public CountriesClient() {
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    public void getAllCountries() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/countries"))
                .GET()
                .build();
            
            HttpResponse&lt;String&gt; response = client.send(
                request, 
                HttpResponse.BodyHandlers.ofString()
            );
            
            if (response.statusCode() == 200) {
                JsonObject data = gson.fromJson(response.body(), JsonObject.class);
                JsonArray countries = data.getAsJsonArray("data");
                int count = data.get("count").getAsInt();
                
                System.out.println("Found " + count + " countries\\n");
                
                countries.forEach(element -> {
                    JsonObject country = element.getAsJsonObject();
                    System.out.println(country.get("name").getAsString() + 
                                     " (" + country.get("code").getAsString() + ")");
                    System.out.println("  Capital: " + country.get("capital").getAsString());
                    System.out.println("  Continent: " + country.get("continent").getAsString());
                    System.out.println("  Population: " + 
                        String.format("%,d", country.get("population").getAsLong()));
                    System.out.println();
                });
            } else {
                System.err.println("Error: HTTP " + response.statusCode());
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) {
        CountriesClient client = new CountriesClient();
        client.getAllCountries();
    }
}
      </code>
    </pre>

    <h2>🔍 Part 2: Query Parameters</h2>
    <p>Add methods to filter countries by continent and language:</p>

    <pre class="code-block">
      <code>
public void getCountriesByContinent(String continent) {
    try {
        String url = String.format("%s/countries?continent=%s", 
                                  BASE_URL, 
                                  java.net.URLEncoder.encode(continent, "UTF-8"));
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            JsonArray countries = data.getAsJsonArray("data");
            
            System.out.println("\\n" + "=".repeat(50));
            System.out.println("Countries in " + continent + ": " + countries.size());
            System.out.println("=".repeat(50));
            
            countries.forEach(element -> {
                JsonObject country = element.getAsJsonObject();
                long population = country.get("population").getAsLong();
                double popMillions = population / 1_000_000.0;
                System.out.printf("  %s: %.1fM people%n", 
                                country.get("name").getAsString(), 
                                popMillions);
            });
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

public void getCountriesByLanguage(String language) {
    try {
        String url = String.format("%s/countries?language=%s", 
                                  BASE_URL, 
                                  java.net.URLEncoder.encode(language, "UTF-8"));
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            JsonArray countries = data.getAsJsonArray("data");
            
            System.out.println("\\nCountries where " + language + " is spoken:");
            countries.forEach(element -> {
                JsonObject country = element.getAsJsonObject();
                System.out.println("  - " + country.get("name").getAsString());
            });
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

// Test the methods
public static void main(String[] args) {
    CountriesClient client = new CountriesClient();
    
    client.getCountriesByContinent("Europe");
    client.getCountriesByContinent("Asia");
    client.getCountriesByLanguage("Spanish");
}
      </code>
    </pre>

    <h2>🏙️ Part 3: Working with Cities</h2>
    <p>Create methods to fetch and filter city data:</p>

    <pre class="code-block">
      <code>
public void getCitiesByCountry(int countryId) {
    try {
        String url = String.format("%s/cities?countryId=%d", BASE_URL, countryId);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            JsonArray cities = data.getAsJsonArray("data");
            
            System.out.println("\\nCities in country ID " + countryId + ":");
            cities.forEach(element -> {
                JsonObject city = element.getAsJsonObject();
                String badge = city.get("isCapital").getAsBoolean() ? "👑 " : "   ";
                long population = city.get("population").getAsLong();
                System.out.printf("%s%s: %,d%n", 
                                badge,
                                city.get("name").getAsString(),
                                population);
            });
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

public void getCapitalCities() {
    try {
        String url = BASE_URL + "/cities?isCapital=true";
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            JsonArray cities = data.getAsJsonArray("data");
            
            System.out.println("\\n🏛️  Capital Cities (" + cities.size() + "):");
            cities.forEach(element -> {
                JsonObject city = element.getAsJsonObject();
                System.out.printf("  %s, %s%n",
                                city.get("name").getAsString(),
                                city.get("country").getAsString());
            });
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

public void getMegacities(long minPopulation) {
    try {
        String url = String.format("%s/cities?minPopulation=%d", 
                                  BASE_URL, 
                                  minPopulation);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            JsonArray cities = data.getAsJsonArray("data");
            
            System.out.println("\\n🌆 Megacities (10M+ population):");
            cities.forEach(element -> {
                JsonObject city = element.getAsJsonObject();
                System.out.printf("  %s, %s: %,d%n",
                                city.get("name").getAsString(),
                                city.get("country").getAsString(),
                                city.get("population").getAsLong());
            });
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

// Test
public static void main(String[] args) {
    CountriesClient client = new CountriesClient();
    client.getCitiesByCountry(3);  // Japan
    client.getCapitalCities();
    client.getMegacities(10_000_000);
}
      </code>
    </pre>

    <h2>✍️ Part 4: Creating Data (POST)</h2>
    <p>Implement POST requests to create new countries:</p>

    <pre class="code-block">
      <code>
public void createCountry(String jsonBody) {
    try {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/countries"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 201 || response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            System.out.println("\\n✅ Country created successfully!");
            System.out.println(gson.toJson(data.get("data")));
        } else {
            System.err.println("❌ Error: HTTP " + response.statusCode());
            System.err.println(response.body());
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error creating country: " + e.getMessage());
    }
}

// Usage example
public static void main(String[] args) {
    CountriesClient client = new CountriesClient();
    
    String newCountryJson = """
        {
          "name": "New Zealand",
          "code": "NZ",
          "capital": "Wellington",
          "continent": "Oceania",
          "population": 5000000,
          "languages": ["English", "Māori"],
          "cities": [
            {"id": 9901, "name": "Wellington", "population": 215400, "isCapital": true},
            {"id": 9902, "name": "Auckland", "population": 1657200, "isCapital": false}
          ]
        }
        """;
    
    client.createCountry(newCountryJson);
}
      </code>
    </pre>

    <h2>🔄 Part 5: Updating Data (PUT)</h2>
    <p>Implement PUT requests to update existing data:</p>

    <pre class="code-block">
      <code>
public void updateCountry(int id, String jsonBody) {
    try {
        String url = String.format("%s/countries?id=%d", BASE_URL, id);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .header("Content-Type", "application/json")
            .PUT(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            System.out.println("\\n✅ " + data.get("message").getAsString());
            System.out.println(gson.toJson(data.get("data")));
        } else {
            System.err.println("❌ Error: HTTP " + response.statusCode());
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error updating country: " + e.getMessage());
    }
}

// Example: Update population
public static void main(String[] args) {
    CountriesClient client = new CountriesClient();
    
    String updateJson = """
        {
          "population": 335000000
        }
        """;
    
    client.updateCountry(1, updateJson);
}
      </code>
    </pre>

    <h2>🗑️ Part 6: Deleting Data (DELETE)</h2>
    <p>Implement DELETE requests:</p>

    <pre class="code-block">
      <code>
public void deleteCountry(int id) {
    try {
        String url = String.format("%s/countries?id=%d", BASE_URL, id);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .DELETE()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() == 200) {
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            System.out.println("\\n✅ " + data.get("message").getAsString());
        } else {
            System.err.println("❌ Error: HTTP " + response.statusCode());
        }
        
    } catch (Exception e) {
        System.err.println("❌ Error deleting country: " + e.getMessage());
    }
}
      </code>
    </pre>

    <h2>🎯 Complete Example: Country Explorer</h2>
    <p>Here's a complete, well-structured Java application:</p>

    <pre class="code-block">
      <code>
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class CountryExplorer {
    private static final String BASE_URL = "http://localhost:3000/api";
    private final HttpClient client;
    private final Gson gson;
    
    public CountryExplorer() {
        this.client = HttpClient.newHttpClient();
        this.gson = new GsonBuilder().setPrettyPrinting().create();
    }
    
    private JsonObject request(String endpoint) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + endpoint))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP Error: " + response.statusCode());
        }
        
        return gson.fromJson(response.body(), JsonObject.class);
    }
    
    public void displayCountryInfo(int countryId) {
        try {
            JsonObject countryData = request("/countries?id=" + countryId);
            JsonObject citiesData = request("/cities?countryId=" + countryId);
            JsonObject langsData = request("/languages?countryId=" + countryId);
            
            JsonObject country = countryData.getAsJsonArray("data").get(0).getAsJsonObject();
            JsonArray cities = citiesData.getAsJsonArray("data");
            JsonArray languages = langsData.getAsJsonArray("data");
            
            System.out.println("\\n🌍 " + country.get("name").getAsString());
            System.out.println("=".repeat(50));
            System.out.println("Capital: " + country.get("capital").getAsString());
            System.out.println("Continent: " + country.get("continent").getAsString());
            System.out.printf("Population: %,d%n", country.get("population").getAsLong());
            
            System.out.println("\\nLanguages (" + languages.size() + "):");
            languages.forEach(element -> {
                JsonObject lang = element.getAsJsonObject();
                System.out.printf("  - %s (%,d speakers)%n",
                                lang.get("name").getAsString(),
                                lang.get("speakers").getAsLong());
            });
            
            System.out.println("\\nMajor Cities (" + cities.size() + "):");
            cities.forEach(element -> {
                JsonObject city = element.getAsJsonObject();
                String badge = city.get("isCapital").getAsBoolean() ? "👑 " : "   ";
                System.out.printf("%s%s: %,d%n",
                                badge,
                                city.get("name").getAsString(),
                                city.get("population").getAsLong());
            });
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        CountryExplorer explorer = new CountryExplorer();
        
        // Display info for Japan
        explorer.displayCountryInfo(3);
    }
}
      </code>
    </pre>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">✅ Java Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Use HttpClient.newHttpClient():</strong> Modern Java 11+ HTTP client</li>
        <li><strong>URLEncoder.encode():</strong> Properly encode query parameters</li>
        <li><strong>Try-catch blocks:</strong> Handle InterruptedException and IOException</li>
        <li><strong>Status code checks:</strong> Always verify response.statusCode()</li>
        <li><strong>Gson for JSON:</strong> Use JsonObject and JsonArray for flexible parsing</li>
        <li><strong>Resource management:</strong> HttpClient manages connections automatically</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Fetch all countries from South America using ?continent=South%20America",
    "For each country, fetch its cities and languages",
    "Calculate the total population of all South American cities",
    "Find the most populous city in South America",
    "List all unique languages spoken across South American countries",
  ],
  solution: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import java.util.*;

public class SouthAmericaExplorer {
    private static final String BASE_URL = "http://localhost:3000/api";
    private final HttpClient client;
    private final Gson gson;
    
    public SouthAmericaExplorer() {
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    private JsonObject request(String endpoint) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + endpoint))
            .GET()
            .build();
        
        HttpResponse<String> response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        if (response.statusCode() != 200) {
            throw new RuntimeException("HTTP " + response.statusCode());
        }
        
        return gson.fromJson(response.body(), JsonObject.class);
    }
    
    public void exploreSouthAmerica() {
        try {
            // 1. Fetch South American countries
            JsonObject data = request("/countries?continent=South%20America");
            JsonArray countries = data.getAsJsonArray("data");
            
            System.out.println("🌎 South America Analysis");
            System.out.println("=".repeat(60));
            
            long totalPopulation = 0;
            JsonObject mostPopulousCity = null;
            long maxPopulation = 0;
            Set<String> allLanguages = new HashSet<>();
            
            // 2. Process each country
            for (int i = 0; i < countries.size(); i++) {
                JsonObject country = countries.get(i).getAsJsonObject();
                int countryId = country.get("id").getAsInt();
                
                System.out.println("\\n" + country.get("name").getAsString());
                
                // Fetch cities
                JsonObject citiesData = request("/cities?countryId=" + countryId);
                JsonArray cities = citiesData.getAsJsonArray("data");
                
                System.out.println("  Cities (" + cities.size() + "):");
                for (int j = 0; j < cities.size(); j++) {
                    JsonObject city = cities.get(j).getAsJsonObject();
                    long population = city.get("population").getAsLong();
                    
                    System.out.printf("    - %s: %,d%n",
                                    city.get("name").getAsString(),
                                    population);
                    
                    // 3. Add to total
                    totalPopulation += population;
                    
                    // 4. Track most populous
                    if (population > maxPopulation) {
                        maxPopulation = population;
                        mostPopulousCity = city;
                    }
                }
                
                // Fetch languages
                JsonObject langsData = request("/languages?countryId=" + countryId);
                JsonArray languages = langsData.getAsJsonArray("data");
                
                System.out.println("  Languages:");
                for (int j = 0; j < languages.size(); j++) {
                    JsonObject lang = languages.get(j).getAsJsonObject();
                    String langName = lang.get("name").getAsString();
                    allLanguages.add(langName);
                    System.out.printf("    - %s: %,d speakers%n",
                                    langName,
                                    lang.get("speakers").getAsLong());
                }
            }
            
            // Display results
            System.out.println("\\n\\n" + "=".repeat(60));
            System.out.printf("📊 Total Population: %,d%n", totalPopulation);
            
            if (mostPopulousCity != null) {
                System.out.println("\\n🏆 Most Populous City:");
                System.out.printf("   %s, %s: %,d%n",
                                mostPopulousCity.get("name").getAsString(),
                                mostPopulousCity.get("country").getAsString(),
                                maxPopulation);
            }
            
            // 5. List all languages
            System.out.println("\\n🗣️  Languages Spoken in South America (" + 
                             allLanguages.size() + "):");
            allLanguages.stream()
                .sorted()
                .forEach(lang -> System.out.println("   - " + lang));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) {
        SouthAmericaExplorer explorer = new SouthAmericaExplorer();
        explorer.exploreSouthAmerica();
    }
}`,
  hints: [
    "Use URLEncoder.encode() for 'South America' query parameter",
    "Track max population with a variable and conditional check",
    "Use HashSet<String> to automatically handle unique languages",
    "Use System.out.printf() with %,d for formatted numbers",
    "Handle exceptions with try-catch blocks",
  ],
};

export default lessonData;
