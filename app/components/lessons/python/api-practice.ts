import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "API Practice: Countries & Cities",
  description:
    "Practice making HTTP requests using Python's requests library. Work with real API endpoints to fetch, create, update, and delete data.",
  difficulty: "Intermediate",
  objectives: [
    "Use the requests library for HTTP operations",
    "Parse JSON responses from APIs",
    "Implement GET with query parameters",
    "Create data with POST requests",
    "Update and delete resources",
  ],
  content: `<div class="lesson-content">
    <h2>🌍 Python API Client Practice</h2>
    <p>In this lesson, you'll use Python's <code>requests</code> library to interact with our Countries API. This API provides real data about countries, cities, and languages.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">📦 Installing Requests</h4>
      <pre class="code-block"><code>pip install requests</code></pre>
      <p class="mt-2">The requests library makes HTTP requests simple and Pythonic.</p>
    </div>

    <h2>📖 Part 1: Basic GET Request</h2>
    <p>Let's start by fetching all countries:</p>

    <pre class="code-block">
      <code>
import requests
import json

def get_all_countries():
    """Fetch all countries from the API"""
    url = 'http://localhost:3000/api/countries'
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises HTTPError for bad status codes
        
        data = response.json()
        print(f"Found {data['count']} countries\\n")
        
        for country in data['data']:
            print(f"{country['name']} ({country['code']})")
            print(f"  Capital: {country['capital']}")
            print(f"  Continent: {country['continent']}")
            print(f"  Population: {country['population']:,}")
            print(f"  Languages: {', '.join(country['languages'])}")
            print()
        
        return data['data']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return None

# Run the function
if __name__ == '__main__':
    countries = get_all_countries()
      </code>
    </pre>

    <h2>🔍 Part 2: Query Parameters</h2>
    <p>Use query parameters to filter results:</p>

    <pre class="code-block">
      <code>
def get_countries_by_continent(continent):
    """Fetch countries filtered by continent"""
    url = 'http://localhost:3000/api/countries'
    params = {'continent': continent}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"\\n{'='*50}")
        print(f"Countries in {continent}: {data['count']}")
        print('='*50)
        
        for country in data['data']:
            pop_millions = country['population'] / 1_000_000
            print(f"  {country['name']}: {pop_millions:.1f}M people")
        
        return data['data']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return None

# Test with different continents
continents = ['Europe', 'Asia', 'North America', 'South America']
for continent in continents:
    get_countries_by_continent(continent)
      </code>
    </pre>

    <h2>🏙️ Part 3: Working with Cities</h2>
    <p>Fetch and filter city data:</p>

    <pre class="code-block">
      <code>
def get_cities_by_country(country_id):
    """Get all cities for a specific country"""
    url = 'http://localhost:3000/api/cities'
    params = {'countryId': country_id}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"\\nCities in country ID {country_id}:")
        
        for city in data['data']:
            capital_badge = '👑 ' if city['isCapital'] else '   '
            print(f"{capital_badge}{city['name']}: {city['population']:,}")
        
        return data['data']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return None


def get_capital_cities():
    """Get all capital cities"""
    url = 'http://localhost:3000/api/cities'
    params = {'isCapital': 'true'}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"\\n🏛️  Capital Cities ({data['count']}):")
        
        for city in data['data']:
            print(f"  {city['name']}, {city['country']}")
        
        return data['data']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return None


def get_megacities(min_population=10_000_000):
    """Get cities with population above threshold"""
    url = 'http://localhost:3000/api/cities'
    params = {'minPopulation': min_population}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"\\n🌆 Megacities (10M+ population):")
        
        # Sort by population
        cities = sorted(data['data'], key=lambda x: x['population'], reverse=True)
        
        for city in cities:
            print(f"  {city['name']}, {city['country']}: {city['population']:,}")
        
        return cities
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return None

# Test the functions
get_cities_by_country(3)  # Japan
get_capital_cities()
get_megacities()
      </code>
    </pre>

    <h2>🗣️ Part 4: Language Statistics</h2>
    <p>Analyze language data:</p>

    <pre class="code-block">
      <code>
def get_popular_languages(min_speakers=100_000_000):
    """Get languages with minimum number of speakers"""
    url = 'http://localhost:3000/api/languages'
    params = {'minSpeakers': min_speakers}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"\\n🌐 Languages with {min_speakers:,}+ speakers:")
        
        # Sort by speakers
        languages = sorted(data['data'], key=lambda x: x['speakers'], reverse=True)
        
        for i, lang in enumerate(languages, 1):
            print(f"\\n{i}. {lang['name']} ({lang['nativeName']})")
            print(f"   Speakers: {lang['speakers']:,}")
            print(f"   ISO Code: {lang['iso6391']}")
            print(f"   Countries: {', '.join(lang['countries'])}")
        
        return languages
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")
        return None

get_popular_languages(100_000_000)
      </code>
    </pre>

    <h2>✍️ Part 5: Creating Data (POST)</h2>
    <p>Create new countries with POST requests:</p>

    <pre class="code-block">
      <code>
def create_country(country_data):
    """Create a new country"""
    url = 'http://localhost:3000/api/countries'
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, json=country_data, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        print("\\n✅ Country created successfully!")
        print(json.dumps(data['data'], indent=2))
        
        return data['data']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error creating country: {e}")
        if hasattr(e.response, 'json'):
            print(f"Server response: {e.response.json()}")
        return None

# Example: Create New Zealand
new_country = {
    "name": "New Zealand",
    "code": "NZ",
    "capital": "Wellington",
    "continent": "Oceania",
    "population": 5000000,
    "languages": ["English", "Māori"],
    "cities": [
        {"id": 9901, "name": "Wellington", "population": 215400, "isCapital": True},
        {"id": 9902, "name": "Auckland", "population": 1657200, "isCapital": False}
    ]
}

create_country(new_country)
      </code>
    </pre>

    <h2>🔄 Part 6: Updating Data (PUT)</h2>
    <p>Update existing country data:</p>

    <pre class="code-block">
      <code>
def update_country(country_id, updates):
    """Update an existing country"""
    url = f'http://localhost:3000/api/countries'
    params = {'id': country_id}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.put(url, params=params, json=updates, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        print(f"\\n✅ {data['message']}")
        print(json.dumps(data['data'], indent=2))
        
        return data['data']
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error updating country: {e}")
        return None

# Example: Update USA population
update_country(1, {"population": 335000000})
      </code>
    </pre>

    <h2>🗑️ Part 7: Deleting Data (DELETE)</h2>
    <p>Delete a country by ID:</p>

    <pre class="code-block">
      <code>
def delete_country(country_id):
    """Delete a country by ID"""
    url = f'http://localhost:3000/api/countries'
    params = {'id': country_id}
    
    try:
        response = requests.delete(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        print(f"\\n✅ {data['message']}")
        
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error deleting country: {e}")
        return None

# Example: Delete country with ID 1
# delete_country(1)  # Uncomment to test
      </code>
    </pre>

    <h2>🎯 Complete Example: Country Explorer Class</h2>
    <p>Here's a complete Python class that organizes all API operations:</p>

    <pre class="code-block">
      <code>
import requests
from typing import List, Dict, Optional

class CountryExplorer:
    """A client for the Countries API"""
    
    def __init__(self, base_url='http://localhost:3000/api'):
        self.base_url = base_url
        self.session = requests.Session()
    
    def _request(self, method, endpoint, **kwargs):
        """Make an API request with error handling"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"❌ API Error: {e}")
            raise
    
    def get_all_countries(self) -> List[Dict]:
        """Fetch all countries"""
        return self._request('GET', '/countries')
    
    def search_countries(self, search_term: str) -> List[Dict]:
        """Search countries by name"""
        return self._request('GET', '/countries', params={'search': search_term})
    
    def get_countries_by_language(self, language: str) -> List[Dict]:
        """Get countries that speak a specific language"""
        return self._request('GET', '/countries', params={'language': language})
    
    def get_cities_by_population(self, min_pop: int, max_pop: int) -> List[Dict]:
        """Get cities within population range"""
        params = {'minPopulation': min_pop, 'maxPopulation': max_pop}
        return self._request('GET', '/cities', params=params)
    
    def display_country_info(self, country_id: int):
        """Display comprehensive info about a country"""
        country = self._request('GET', '/countries', params={'id': country_id})
        cities = self._request('GET', '/cities', params={'countryId': country_id})
        languages = self._request('GET', '/languages', params={'countryId': country_id})
        
        print(f"\\n🌍 {country['data']['name']}")
        print('=' * 50)
        print(f"Capital: {country['data']['capital']}")
        print(f"Continent: {country['data']['continent']}")
        print(f"Population: {country['data']['population']:,}")
        
        print(f"\\nLanguages ({languages['count']}):")
        for lang in languages['data']:
            print(f"  - {lang['name']} ({lang['speakers']:,} speakers)")
        
        print(f"\\nMajor Cities ({cities['count']}):")
        for city in cities['data']:
            capital = '👑 ' if city['isCapital'] else '   '
            print(f"{capital}{city['name']}: {city['population']:,}")

# Usage Example
def main():
    explorer = CountryExplorer()
    
    # Display info for Japan
    explorer.display_country_info(3)
    
    # Search for countries
    result = explorer.search_countries('United')
    print(f"\\nFound {result['count']} countries matching 'United'")
    
    # Find Spanish-speaking countries
    spanish = explorer.get_countries_by_language('Spanish')
    print(f"\\nCountries where Spanish is spoken:")
    for country in spanish['data']:
        print(f"  - {country['name']}")
    
    # Find megacities
    megacities = explorer.get_cities_by_population(10_000_000, 50_000_000)
    print(f"\\nMegacities (10M+ population):")
    for city in megacities['data']:
        print(f"  - {city['name']}, {city['country']}: {city['population']:,}")

if __name__ == '__main__':
    main()
      </code>
    </pre>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">✅ Python Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Use response.raise_for_status():</strong> Automatically raises exceptions for HTTP errors</li>
        <li><strong>Use requests.Session():</strong> Reuses connections for better performance</li>
        <li><strong>Type hints:</strong> Use typing module for better code documentation</li>
        <li><strong>Context managers:</strong> Sessions automatically handle connection pooling</li>
        <li><strong>Exception handling:</strong> Catch requests.exceptions.RequestException</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Fetch all countries from Asia using params={'continent': 'Asia'}",
    "For each country, fetch its languages and cities",
    "Calculate the total population of all Asian countries",
    "Find and display the country with the most cities",
    "Display the top 5 most spoken languages in Asia with speaker counts",
  ],
  solution: `import requests
from typing import List, Dict
from collections import defaultdict

class AsiaExplorer:
    def __init__(self):
        self.base_url = 'http://localhost:3000/api'
    
    def explore_asia(self):
        """Complete Asia exploration analysis"""
        try:
            # 1. Fetch Asian countries
            response = requests.get(f'{self.base_url}/countries', 
                                   params={'continent': 'Asia'})
            response.raise_for_status()
            countries_data = response.json()
            countries = countries_data['data']
            
            print('🌏 Asian Countries Analysis')
            print('=' * 60)
            
            total_population = 0
            country_city_counts = {}
            all_languages = defaultdict(lambda: {'speakers': 0, 'countries': []})
            
            # 2. Process each country
            for country in countries:
                print(f"\\n{country['name']} ({country['code']})")
                
                # Fetch cities
                cities_response = requests.get(
                    f'{self.base_url}/cities',
                    params={'countryId': country['id']}
                )
                cities = cities_response.json()['data']
                country_city_counts[country['name']] = len(cities)
                
                print(f"  Cities ({len(cities)}):")
                for city in cities:
                    print(f"    - {city['name']}: {city['population']:,}")
                    total_population += city['population']
                
                # Fetch languages
                langs_response = requests.get(
                    f'{self.base_url}/languages',
                    params={'countryId': country['id']}
                )
                languages = langs_response.json()['data']
                
                print(f"  Languages ({len(languages)}):")
                for lang in languages:
                    print(f"    - {lang['name']}: {lang['speakers']:,} speakers")
                    all_languages[lang['name']]['speakers'] = lang['speakers']
                    all_languages[lang['name']]['countries'].append(country['name'])
            
            # 3. Total population
            print(f"\\n\\n{'='*60}")
            print(f"📊 Total Population: {total_population:,}")
            
            # 4. Country with most cities
            max_country = max(country_city_counts.items(), key=lambda x: x[1])
            print(f"\\n🏙️  Country with Most Cities:")
            print(f"   {max_country[0]}: {max_country[1]} cities")
            
            # 5. Top 5 languages
            sorted_languages = sorted(
                all_languages.items(),
                key=lambda x: x[1]['speakers'],
                reverse=True
            )[:5]
            
            print(f"\\n🗣️  Top 5 Languages in Asia:")
            for i, (lang_name, data) in enumerate(sorted_languages, 1):
                countries_str = ', '.join(data['countries'])
                print(f"   {i}. {lang_name}")
                print(f"      Speakers: {data['speakers']:,}")
                print(f"      Countries: {countries_str}")
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Error: {e}")

# Run the analysis
if __name__ == '__main__':
    explorer = AsiaExplorer()
    explorer.explore_asia()`,
  hints: [
    "Use params={'continent': 'Asia'} for filtering",
    "Use a dictionary to count cities per country",
    "Use defaultdict to aggregate language data",
    "Use max() with key parameter to find maximum",
    "Use sorted() with lambda to sort by speakers count",
  ],
};

export default lessonData;
