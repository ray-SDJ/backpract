import { NextResponse } from "next/server";

// Mock database of countries with cities and languages
const countriesData = [
  {
    id: 1,
    name: "United States",
    code: "US",
    capital: "Washington, D.C.",
    continent: "North America",
    population: 331002651,
    languages: ["English", "Spanish"],
    cities: [
      { id: 101, name: "New York", population: 8336817, isCapital: false },
      { id: 102, name: "Los Angeles", population: 3979576, isCapital: false },
      { id: 103, name: "Chicago", population: 2693976, isCapital: false },
      {
        id: 104,
        name: "Washington, D.C.",
        population: 705749,
        isCapital: true,
      },
      { id: 105, name: "San Francisco", population: 873965, isCapital: false },
    ],
  },
  {
    id: 2,
    name: "United Kingdom",
    code: "GB",
    capital: "London",
    continent: "Europe",
    population: 67886011,
    languages: ["English", "Welsh", "Scottish Gaelic"],
    cities: [
      { id: 201, name: "London", population: 9002488, isCapital: true },
      { id: 202, name: "Manchester", population: 547627, isCapital: false },
      { id: 203, name: "Birmingham", population: 1141816, isCapital: false },
      { id: 204, name: "Edinburgh", population: 524930, isCapital: false },
      { id: 205, name: "Liverpool", population: 498042, isCapital: false },
    ],
  },
  {
    id: 3,
    name: "Japan",
    code: "JP",
    capital: "Tokyo",
    continent: "Asia",
    population: 126476461,
    languages: ["Japanese"],
    cities: [
      { id: 301, name: "Tokyo", population: 13960000, isCapital: true },
      { id: 302, name: "Osaka", population: 2725006, isCapital: false },
      { id: 303, name: "Kyoto", population: 1475183, isCapital: false },
      { id: 304, name: "Yokohama", population: 3748071, isCapital: false },
      { id: 305, name: "Nagoya", population: 2327557, isCapital: false },
    ],
  },
  {
    id: 4,
    name: "France",
    code: "FR",
    capital: "Paris",
    continent: "Europe",
    population: 65273511,
    languages: ["French"],
    cities: [
      { id: 401, name: "Paris", population: 2165423, isCapital: true },
      { id: 402, name: "Marseille", population: 869815, isCapital: false },
      { id: 403, name: "Lyon", population: 513275, isCapital: false },
      { id: 404, name: "Nice", population: 340017, isCapital: false },
      { id: 405, name: "Toulouse", population: 471941, isCapital: false },
    ],
  },
  {
    id: 5,
    name: "Germany",
    code: "DE",
    capital: "Berlin",
    continent: "Europe",
    population: 83783942,
    languages: ["German"],
    cities: [
      { id: 501, name: "Berlin", population: 3769495, isCapital: true },
      { id: 502, name: "Munich", population: 1471508, isCapital: false },
      { id: 503, name: "Hamburg", population: 1852478, isCapital: false },
      { id: 504, name: "Frankfurt", population: 753056, isCapital: false },
      { id: 505, name: "Cologne", population: 1085664, isCapital: false },
    ],
  },
  {
    id: 6,
    name: "Brazil",
    code: "BR",
    capital: "Brasília",
    continent: "South America",
    population: 212559417,
    languages: ["Portuguese"],
    cities: [
      { id: 601, name: "Brasília", population: 3015268, isCapital: true },
      { id: 602, name: "São Paulo", population: 12325232, isCapital: false },
      {
        id: 603,
        name: "Rio de Janeiro",
        population: 6748000,
        isCapital: false,
      },
      { id: 604, name: "Salvador", population: 2886698, isCapital: false },
      { id: 605, name: "Fortaleza", population: 2686612, isCapital: false },
    ],
  },
  {
    id: 7,
    name: "India",
    code: "IN",
    capital: "New Delhi",
    continent: "Asia",
    population: 1380004385,
    languages: ["Hindi", "English", "Bengali", "Telugu", "Marathi"],
    cities: [
      { id: 701, name: "New Delhi", population: 32941000, isCapital: true },
      { id: 702, name: "Mumbai", population: 20411000, isCapital: false },
      { id: 703, name: "Bangalore", population: 12765000, isCapital: false },
      { id: 704, name: "Kolkata", population: 14850000, isCapital: false },
      { id: 705, name: "Chennai", population: 10971000, isCapital: false },
    ],
  },
  {
    id: 8,
    name: "China",
    code: "CN",
    capital: "Beijing",
    continent: "Asia",
    population: 1439323776,
    languages: ["Mandarin Chinese", "Cantonese", "Wu", "Min"],
    cities: [
      { id: 801, name: "Beijing", population: 21540000, isCapital: true },
      { id: 802, name: "Shanghai", population: 27058000, isCapital: false },
      { id: 803, name: "Guangzhou", population: 15300000, isCapital: false },
      { id: 804, name: "Shenzhen", population: 17560000, isCapital: false },
      { id: 805, name: "Chengdu", population: 16580000, isCapital: false },
    ],
  },
  {
    id: 9,
    name: "Australia",
    code: "AU",
    capital: "Canberra",
    continent: "Oceania",
    population: 25499884,
    languages: ["English"],
    cities: [
      { id: 901, name: "Canberra", population: 431380, isCapital: true },
      { id: 902, name: "Sydney", population: 5312000, isCapital: false },
      { id: 903, name: "Melbourne", population: 5078000, isCapital: false },
      { id: 904, name: "Brisbane", population: 2560000, isCapital: false },
      { id: 905, name: "Perth", population: 2125000, isCapital: false },
    ],
  },
  {
    id: 10,
    name: "Canada",
    code: "CA",
    capital: "Ottawa",
    continent: "North America",
    population: 37742154,
    languages: ["English", "French"],
    cities: [
      { id: 1001, name: "Ottawa", population: 1017449, isCapital: true },
      { id: 1002, name: "Toronto", population: 2930000, isCapital: false },
      { id: 1003, name: "Vancouver", population: 675218, isCapital: false },
      { id: 1004, name: "Montreal", population: 1780000, isCapital: false },
      { id: 1005, name: "Calgary", population: 1336000, isCapital: false },
    ],
  },
  {
    id: 11,
    name: "Spain",
    code: "ES",
    capital: "Madrid",
    continent: "Europe",
    population: 46754778,
    languages: ["Spanish", "Catalan", "Galician", "Basque"],
    cities: [
      { id: 1101, name: "Madrid", population: 3223334, isCapital: true },
      { id: 1102, name: "Barcelona", population: 1620343, isCapital: false },
      { id: 1103, name: "Valencia", population: 791413, isCapital: false },
      { id: 1104, name: "Seville", population: 688711, isCapital: false },
      { id: 1105, name: "Bilbao", population: 345821, isCapital: false },
    ],
  },
  {
    id: 12,
    name: "Italy",
    code: "IT",
    capital: "Rome",
    continent: "Europe",
    population: 60461826,
    languages: ["Italian"],
    cities: [
      { id: 1201, name: "Rome", population: 2872800, isCapital: true },
      { id: 1202, name: "Milan", population: 1396000, isCapital: false },
      { id: 1203, name: "Naples", population: 967069, isCapital: false },
      { id: 1204, name: "Turin", population: 875698, isCapital: false },
      { id: 1205, name: "Florence", population: 382258, isCapital: false },
    ],
  },
  {
    id: 13,
    name: "Mexico",
    code: "MX",
    capital: "Mexico City",
    continent: "North America",
    population: 128932753,
    languages: ["Spanish", "Nahuatl", "Yucatec Maya"],
    cities: [
      { id: 1301, name: "Mexico City", population: 21581000, isCapital: true },
      { id: 1302, name: "Guadalajara", population: 5268642, isCapital: false },
      { id: 1303, name: "Monterrey", population: 5341171, isCapital: false },
      { id: 1304, name: "Cancún", population: 888797, isCapital: false },
      { id: 1305, name: "Tijuana", population: 1922523, isCapital: false },
    ],
  },
  {
    id: 14,
    name: "South Korea",
    code: "KR",
    capital: "Seoul",
    continent: "Asia",
    population: 51269185,
    languages: ["Korean"],
    cities: [
      { id: 1401, name: "Seoul", population: 9776000, isCapital: true },
      { id: 1402, name: "Busan", population: 3449000, isCapital: false },
      { id: 1403, name: "Incheon", population: 2954000, isCapital: false },
      { id: 1404, name: "Daegu", population: 2461000, isCapital: false },
      { id: 1405, name: "Daejeon", population: 1539000, isCapital: false },
    ],
  },
  {
    id: 15,
    name: "Russia",
    code: "RU",
    capital: "Moscow",
    continent: "Europe/Asia",
    population: 145934462,
    languages: ["Russian"],
    cities: [
      { id: 1501, name: "Moscow", population: 12500000, isCapital: true },
      {
        id: 1502,
        name: "Saint Petersburg",
        population: 5398000,
        isCapital: false,
      },
      { id: 1503, name: "Novosibirsk", population: 1625000, isCapital: false },
      {
        id: 1504,
        name: "Yekaterinburg",
        population: 1493000,
        isCapital: false,
      },
      { id: 1505, name: "Kazan", population: 1257000, isCapital: false },
    ],
  },
];

// GET /api/countries - Get all countries
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const continent = searchParams.get("continent");
  const language = searchParams.get("language");
  const search = searchParams.get("search");

  let filteredData = [...countriesData];

  // Filter by ID
  if (id) {
    const country = filteredData.find((c) => c.id === parseInt(id));
    if (!country) {
      return NextResponse.json(
        { success: false, error: "Country not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: country });
  }

  // Filter by continent
  if (continent) {
    filteredData = filteredData.filter((c) =>
      c.continent.toLowerCase().includes(continent.toLowerCase())
    );
  }

  // Filter by language
  if (language) {
    filteredData = filteredData.filter((c) =>
      c.languages.some((l) => l.toLowerCase().includes(language.toLowerCase()))
    );
  }

  // Search by name
  if (search) {
    filteredData = filteredData.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return NextResponse.json({
    success: true,
    count: filteredData.length,
    data: filteredData,
  });
}

// POST /api/countries - Create a new country (simulated)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.code || !body.capital) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, code, capital",
        },
        { status: 400 }
      );
    }

    // Simulate creating a new country
    const newCountry = {
      id: countriesData.length + 1,
      name: body.name,
      code: body.code,
      capital: body.capital,
      continent: body.continent || "Unknown",
      population: body.population || 0,
      languages: body.languages || [],
      cities: body.cities || [],
    };

    return NextResponse.json(
      {
        success: true,
        message: "Country created successfully",
        data: newCountry,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}

// PUT /api/countries - Update a country (simulated)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Country ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const country = countriesData.find((c) => c.id === parseInt(id));

    if (!country) {
      return NextResponse.json(
        { success: false, error: "Country not found" },
        { status: 404 }
      );
    }

    // Simulate updating the country
    const updatedCountry = {
      ...country,
      ...body,
      id: country.id, // Preserve original ID
    };

    return NextResponse.json({
      success: true,
      message: "Country updated successfully",
      data: updatedCountry,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}

// DELETE /api/countries - Delete a country (simulated)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Country ID is required" },
      { status: 400 }
    );
  }

  const country = countriesData.find((c) => c.id === parseInt(id));

  if (!country) {
    return NextResponse.json(
      { success: false, error: "Country not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Country '${country.name}' deleted successfully`,
  });
}
