import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "API Practice: Countries & Cities",
  description:
    "Practice making HTTP requests to a real API. Fetch countries, cities, and languages data with filtering and CRUD operations.",
  difficulty: "Intermediate",
  objectives: [
    "Make GET requests with query parameters",
    "Implement POST, PUT, DELETE operations",
    "Handle API responses and errors",
    "Parse and display JSON data",
    "Build a complete REST client",
  ],
  content: `<div class="lesson-content">
    <h2>🌍 Countries & Cities API</h2>
    <p>In this lesson, you'll practice making HTTP requests to our Countries API. This API provides data about 15 countries, 75 cities, and 24 languages from around the world.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">📡 Available Endpoints</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>GET /api/countries</strong> - Get all countries (filter by continent, language, search)</li>
        <li><strong>GET /api/countries?id=1</strong> - Get country by ID</li>
        <li><strong>GET /api/cities</strong> - Get all cities (filter by country, capital status, population)</li>
        <li><strong>GET /api/languages</strong> - Get all languages (filter by country, speakers)</li>
        <li><strong>POST /api/countries</strong> - Create a new country</li>
        <li><strong>PUT /api/countries?id=1</strong> - Update a country</li>
        <li><strong>DELETE /api/countries?id=1</strong> - Delete a country</li>
      </ul>
    </div>

    <h2>📖 Part 1: Fetching All Countries</h2>
    <p>Let's start by fetching and displaying all countries from the API:</p>

    <pre class="code-block">
      <code>
// Using native fetch (Node.js 18+)
async function getAllCountries() {
  try {
    const response = await fetch('http://localhost:3000/api/countries');
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log(\`Found \${data.count} countries\`);
    
    data.data.forEach(country => {
      console.log(\`\${country.name} (\${country.code})\`);
      console.log(\`  Capital: \${country.capital}\`);
      console.log(\`  Languages: \${country.languages.join(', ')}\`);
      console.log(\`  Cities: \${country.cities.length}\`);
      console.log('');
    });
    
    return data.data;
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    throw error;
  }
}

// Call the function
getAllCountries();
      </code>
    </pre>

    <h2>🔍 Part 2: Filtering by Continent</h2>
    <p>Practice filtering countries by continent using query parameters:</p>

    <pre class="code-block">
      <code>
async function getCountriesByContinent(continent) {
  try {
    const url = \`http://localhost:3000/api/countries?continent=\${encodeURIComponent(continent)}\`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(\`\nCountries in \${continent}:\`);
    data.data.forEach(country => {
      console.log(\`- \${country.name} (Population: \${country.population.toLocaleString()})\`);
    });
    
    return data.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test different continents
getCountriesByContinent('Europe');
getCountriesByContinent('Asia');
getCountriesByContinent('North America');
      </code>
    </pre>

    <h2>🏙️ Part 3: Working with Cities</h2>
    <p>Fetch cities and filter by country:</p>

    <pre class="code-block">
      <code>
async function getCitiesByCountry(countryId) {
  try {
    const url = \`http://localhost:3000/api/cities?countryId=\${countryId}\`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(\`\nCities in country ID \${countryId}:\`);
    data.data.forEach(city => {
      const capitalBadge = city.isCapital ? '👑 ' : '';
      console.log(\`\${capitalBadge}\${city.name} - Population: \${city.population.toLocaleString()}\`);
    });
    
    return data.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Get cities from Japan (countryId: 3)
getCitiesByCountry(3);

// Get only capital cities
async function getCapitalCities() {
  const url = 'http://localhost:3000/api/cities?isCapital=true';
  const response = await fetch(url);
  const data = await response.json();
  
  console.log('\n🏛️ Capital Cities:');
  data.data.forEach(city => {
    console.log(\`\${city.name}, \${city.country}\`);
  });
}

getCapitalCities();
      </code>
    </pre>

    <h2>🗣️ Part 4: Language Statistics</h2>
    <p>Fetch and analyze language data:</p>

    <pre class="code-block">
      <code>
async function getPopularLanguages(minSpeakers = 100000000) {
  try {
    const url = \`http://localhost:3000/api/languages?minSpeakers=\${minSpeakers}\`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(\`\n🌐 Languages with \${minSpeakers.toLocaleString()}+ speakers:\`);
    
    // Sort by speakers descending
    const sorted = data.data.sort((a, b) => b.speakers - a.speakers);
    
    sorted.forEach((lang, index) => {
      console.log(\`\${index + 1}. \${lang.name} (\${lang.nativeName})\`);
      console.log(\`   Speakers: \${lang.speakers.toLocaleString()}\`);
      console.log(\`   Countries: \${lang.countries.join(', ')}\`);
    });
    
    return sorted;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getPopularLanguages(100000000);
      </code>
    </pre>

    <h2>✍️ Part 5: Creating Data (POST)</h2>
    <p>Practice creating new countries with POST requests:</p>

    <pre class="code-block">
      <code>
async function createCountry(countryData) {
  try {
    const response = await fetch('http://localhost:3000/api/countries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(countryData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const data = await response.json();
    console.log('\n✅ Country created successfully!');
    console.log(JSON.stringify(data.data, null, 2));
    
    return data.data;
  } catch (error) {
    console.error('❌ Error creating country:', error.message);
  }
}

// Example: Create a new country
const newCountry = {
  name: "New Zealand",
  code: "NZ",
  capital: "Wellington",
  continent: "Oceania",
  population: 5000000,
  languages: ["English", "Māori"],
  cities: [
    { id: 9901, name: "Wellington", population: 215400, isCapital: true },
    { id: 9902, name: "Auckland", population: 1657200, isCapital: false }
  ]
};

createCountry(newCountry);
      </code>
    </pre>

    <h2>🔄 Part 6: Updating Data (PUT)</h2>
    <p>Update existing country data:</p>

    <pre class="code-block">
      <code>
async function updateCountry(id, updates) {
  try {
    const url = \`http://localhost:3000/api/countries?id=\${id}\`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const data = await response.json();
    console.log('\n✅ Country updated successfully!');
    console.log(data.message);
    console.log(JSON.stringify(data.data, null, 2));
    
    return data.data;
  } catch (error) {
    console.error('❌ Error updating country:', error.message);
  }
}

// Example: Update population
updateCountry(1, { population: 335000000 });
      </code>
    </pre>

    <h2>🗑️ Part 7: Deleting Data (DELETE)</h2>
    <p>Delete a country by ID:</p>

    <pre class="code-block">
      <code>
async function deleteCountry(id) {
  try {
    const url = \`http://localhost:3000/api/countries?id=\${id}\`;
    const response = await fetch(url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const data = await response.json();
    console.log('\n✅', data.message);
    
    return data;
  } catch (error) {
    console.error('❌ Error deleting country:', error.message);
  }
}

// Example: Delete country with ID 1
deleteCountry(1);
      </code>
    </pre>

    <h2>🎯 Complete Example: Country Explorer</h2>
    <p>Here's a complete application that uses all CRUD operations:</p>

    <pre class="code-block">
      <code>
class CountryExplorer {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, options);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  }

  async getAllCountries() {
    return this.request('/countries');
  }

  async searchCountries(searchTerm) {
    return this.request(\`/countries?search=\${encodeURIComponent(searchTerm)}\`);
  }

  async getCountriesByLanguage(language) {
    return this.request(\`/countries?language=\${encodeURIComponent(language)}\`);
  }

  async getCitiesByPopulation(min, max) {
    return this.request(\`/cities?minPopulation=\${min}&maxPopulation=\${max}\`);
  }

  async displayCountryInfo(countryId) {
    const country = await this.request(\`/countries?id=\${countryId}\`);
    const cities = await this.request(\`/cities?countryId=\${countryId}\`);
    const languages = await this.request(\`/languages?countryId=\${countryId}\`);
    
    console.log(\`\n🌍 \${country.data.name}\`);
    console.log('='.repeat(50));
    console.log(\`Capital: \${country.data.capital}\`);
    console.log(\`Continent: \${country.data.continent}\`);
    console.log(\`Population: \${country.data.population.toLocaleString()}\`);
    console.log(\`\nLanguages (\${languages.count}):\`);
    languages.data.forEach(lang => {
      console.log(\`  - \${lang.name} (\${lang.speakers.toLocaleString()} speakers)\`);
    });
    console.log(\`\nMajor Cities (\${cities.count}):\`);
    cities.data.forEach(city => {
      const capital = city.isCapital ? '👑 ' : '   ';
      console.log(\`\${capital}\${city.name} - \${city.population.toLocaleString()}\`);
    });
  }
}

// Usage
const explorer = new CountryExplorer();

async function main() {
  // Display info for Japan
  await explorer.displayCountryInfo(3);
  
  // Search for countries
  const result = await explorer.searchCountries('United');
  console.log(\`\nFound \${result.count} countries matching "United"\`);
  
  // Find countries that speak Spanish
  const spanish = await explorer.getCountriesByLanguage('Spanish');
  console.log(\`\nCountries where Spanish is spoken:\`);
  spanish.data.forEach(c => console.log(\`  - \${c.name}\`));
  
  // Find megacities
  const megacities = await explorer.getCitiesByPopulation(10000000, 50000000);
  console.log(\`\nMegacities (10M+ population):\`);
  megacities.data.forEach(city => {
    console.log(\`  - \${city.name}, \${city.country}: \${city.population.toLocaleString()}\`);
  });
}

main();
      </code>
    </pre>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">✅ Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Error Handling:</strong> Always use try-catch blocks for network requests</li>
        <li><strong>Status Codes:</strong> Check response.ok before parsing JSON</li>
        <li><strong>URL Encoding:</strong> Use encodeURIComponent() for query parameters</li>
        <li><strong>Content Type:</strong> Set Content-Type header for POST/PUT requests</li>
        <li><strong>Class Structure:</strong> Organize API calls in a class for reusability</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Fetch all countries from Europe using ?continent=Europe",
    "For each country, fetch its cities",
    "Display country name, capital, and list of cities with population",
    "Calculate and display the total population of all European cities",
    "Find and display the 3 most populous cities in Europe",
  ],
  solution: `async function exploreEurope() {
  const baseUrl = 'http://localhost:3000/api';
  
  try {
    // 1. Fetch European countries
    const response = await fetch(\`\${baseUrl}/countries?continent=Europe\`);
    const { data: countries } = await response.json();
    
    console.log('🇪🇺 European Countries Analysis');
    console.log('='.repeat(60));
    
    let totalPopulation = 0;
    const allCities = [];
    
    // 2. Process each country
    for (const country of countries) {
      console.log(\`\n\${country.name} (\${country.code})\`);
      console.log(\`Capital: \${country.capital}\`);
      
      // 3. Fetch cities for this country
      const citiesResponse = await fetch(\`\${baseUrl}/cities?countryId=\${country.id}\`);
      const { data: cities } = await citiesResponse.json();
      
      console.log('Cities:');
      cities.forEach(city => {
        console.log(\`  - \${city.name}: \${city.population.toLocaleString()}\`);
        totalPopulation += city.population;
        allCities.push(city);
      });
    }
    
    // 4. Display total population
    console.log(\`\n\n📊 Total Population of European Cities: \${totalPopulation.toLocaleString()}\`);
    
    // 5. Find top 3 most populous cities
    const top3 = allCities
      .sort((a, b) => b.population - a.population)
      .slice(0, 3);
    
    console.log(\`\n🏆 Top 3 Most Populous Cities in Europe:\`);
    top3.forEach((city, index) => {
      console.log(\`\${index + 1}. \${city.name}, \${city.country}: \${city.population.toLocaleString()}\`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

exploreEurope();`,
  hints: [
    "Use fetch() with query parameters like ?continent=Europe",
    "Loop through countries and fetch cities for each one",
    "Keep an array of all cities to find the top 3",
    "Use .sort() with a compare function to sort by population",
    "Use .toLocaleString() to format large numbers with commas",
  ],
};

export default lessonData;
