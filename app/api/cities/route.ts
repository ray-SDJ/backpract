import { NextResponse } from "next/server";

// All cities from all countries
const citiesData = [
  // USA
  {
    id: 101,
    name: "New York",
    population: 8336817,
    isCapital: false,
    countryId: 1,
    country: "United States",
  },
  {
    id: 102,
    name: "Los Angeles",
    population: 3979576,
    isCapital: false,
    countryId: 1,
    country: "United States",
  },
  {
    id: 103,
    name: "Chicago",
    population: 2693976,
    isCapital: false,
    countryId: 1,
    country: "United States",
  },
  {
    id: 104,
    name: "Washington, D.C.",
    population: 705749,
    isCapital: true,
    countryId: 1,
    country: "United States",
  },
  {
    id: 105,
    name: "San Francisco",
    population: 873965,
    isCapital: false,
    countryId: 1,
    country: "United States",
  },

  // UK
  {
    id: 201,
    name: "London",
    population: 9002488,
    isCapital: true,
    countryId: 2,
    country: "United Kingdom",
  },
  {
    id: 202,
    name: "Manchester",
    population: 547627,
    isCapital: false,
    countryId: 2,
    country: "United Kingdom",
  },
  {
    id: 203,
    name: "Birmingham",
    population: 1141816,
    isCapital: false,
    countryId: 2,
    country: "United Kingdom",
  },
  {
    id: 204,
    name: "Edinburgh",
    population: 524930,
    isCapital: false,
    countryId: 2,
    country: "United Kingdom",
  },
  {
    id: 205,
    name: "Liverpool",
    population: 498042,
    isCapital: false,
    countryId: 2,
    country: "United Kingdom",
  },

  // Japan
  {
    id: 301,
    name: "Tokyo",
    population: 13960000,
    isCapital: true,
    countryId: 3,
    country: "Japan",
  },
  {
    id: 302,
    name: "Osaka",
    population: 2725006,
    isCapital: false,
    countryId: 3,
    country: "Japan",
  },
  {
    id: 303,
    name: "Kyoto",
    population: 1475183,
    isCapital: false,
    countryId: 3,
    country: "Japan",
  },
  {
    id: 304,
    name: "Yokohama",
    population: 3748071,
    isCapital: false,
    countryId: 3,
    country: "Japan",
  },
  {
    id: 305,
    name: "Nagoya",
    population: 2327557,
    isCapital: false,
    countryId: 3,
    country: "Japan",
  },

  // France
  {
    id: 401,
    name: "Paris",
    population: 2165423,
    isCapital: true,
    countryId: 4,
    country: "France",
  },
  {
    id: 402,
    name: "Marseille",
    population: 869815,
    isCapital: false,
    countryId: 4,
    country: "France",
  },
  {
    id: 403,
    name: "Lyon",
    population: 513275,
    isCapital: false,
    countryId: 4,
    country: "France",
  },
  {
    id: 404,
    name: "Nice",
    population: 340017,
    isCapital: false,
    countryId: 4,
    country: "France",
  },
  {
    id: 405,
    name: "Toulouse",
    population: 471941,
    isCapital: false,
    countryId: 4,
    country: "France",
  },

  // Germany
  {
    id: 501,
    name: "Berlin",
    population: 3769495,
    isCapital: true,
    countryId: 5,
    country: "Germany",
  },
  {
    id: 502,
    name: "Munich",
    population: 1471508,
    isCapital: false,
    countryId: 5,
    country: "Germany",
  },
  {
    id: 503,
    name: "Hamburg",
    population: 1852478,
    isCapital: false,
    countryId: 5,
    country: "Germany",
  },
  {
    id: 504,
    name: "Frankfurt",
    population: 753056,
    isCapital: false,
    countryId: 5,
    country: "Germany",
  },
  {
    id: 505,
    name: "Cologne",
    population: 1085664,
    isCapital: false,
    countryId: 5,
    country: "Germany",
  },

  // Brazil
  {
    id: 601,
    name: "Brasília",
    population: 3015268,
    isCapital: true,
    countryId: 6,
    country: "Brazil",
  },
  {
    id: 602,
    name: "São Paulo",
    population: 12325232,
    isCapital: false,
    countryId: 6,
    country: "Brazil",
  },
  {
    id: 603,
    name: "Rio de Janeiro",
    population: 6748000,
    isCapital: false,
    countryId: 6,
    country: "Brazil",
  },
  {
    id: 604,
    name: "Salvador",
    population: 2886698,
    isCapital: false,
    countryId: 6,
    country: "Brazil",
  },
  {
    id: 605,
    name: "Fortaleza",
    population: 2686612,
    isCapital: false,
    countryId: 6,
    country: "Brazil",
  },

  // India
  {
    id: 701,
    name: "New Delhi",
    population: 32941000,
    isCapital: true,
    countryId: 7,
    country: "India",
  },
  {
    id: 702,
    name: "Mumbai",
    population: 20411000,
    isCapital: false,
    countryId: 7,
    country: "India",
  },
  {
    id: 703,
    name: "Bangalore",
    population: 12765000,
    isCapital: false,
    countryId: 7,
    country: "India",
  },
  {
    id: 704,
    name: "Kolkata",
    population: 14850000,
    isCapital: false,
    countryId: 7,
    country: "India",
  },
  {
    id: 705,
    name: "Chennai",
    population: 10971000,
    isCapital: false,
    countryId: 7,
    country: "India",
  },

  // China
  {
    id: 801,
    name: "Beijing",
    population: 21540000,
    isCapital: true,
    countryId: 8,
    country: "China",
  },
  {
    id: 802,
    name: "Shanghai",
    population: 27058000,
    isCapital: false,
    countryId: 8,
    country: "China",
  },
  {
    id: 803,
    name: "Guangzhou",
    population: 15300000,
    isCapital: false,
    countryId: 8,
    country: "China",
  },
  {
    id: 804,
    name: "Shenzhen",
    population: 17560000,
    isCapital: false,
    countryId: 8,
    country: "China",
  },
  {
    id: 805,
    name: "Chengdu",
    population: 16580000,
    isCapital: false,
    countryId: 8,
    country: "China",
  },

  // Australia
  {
    id: 901,
    name: "Canberra",
    population: 431380,
    isCapital: true,
    countryId: 9,
    country: "Australia",
  },
  {
    id: 902,
    name: "Sydney",
    population: 5312000,
    isCapital: false,
    countryId: 9,
    country: "Australia",
  },
  {
    id: 903,
    name: "Melbourne",
    population: 5078000,
    isCapital: false,
    countryId: 9,
    country: "Australia",
  },
  {
    id: 904,
    name: "Brisbane",
    population: 2560000,
    isCapital: false,
    countryId: 9,
    country: "Australia",
  },
  {
    id: 905,
    name: "Perth",
    population: 2125000,
    isCapital: false,
    countryId: 9,
    country: "Australia",
  },

  // Canada
  {
    id: 1001,
    name: "Ottawa",
    population: 1017449,
    isCapital: true,
    countryId: 10,
    country: "Canada",
  },
  {
    id: 1002,
    name: "Toronto",
    population: 2930000,
    isCapital: false,
    countryId: 10,
    country: "Canada",
  },
  {
    id: 1003,
    name: "Vancouver",
    population: 675218,
    isCapital: false,
    countryId: 10,
    country: "Canada",
  },
  {
    id: 1004,
    name: "Montreal",
    population: 1780000,
    isCapital: false,
    countryId: 10,
    country: "Canada",
  },
  {
    id: 1005,
    name: "Calgary",
    population: 1336000,
    isCapital: false,
    countryId: 10,
    country: "Canada",
  },

  // Spain
  {
    id: 1101,
    name: "Madrid",
    population: 3223334,
    isCapital: true,
    countryId: 11,
    country: "Spain",
  },
  {
    id: 1102,
    name: "Barcelona",
    population: 1620343,
    isCapital: false,
    countryId: 11,
    country: "Spain",
  },
  {
    id: 1103,
    name: "Valencia",
    population: 791413,
    isCapital: false,
    countryId: 11,
    country: "Spain",
  },
  {
    id: 1104,
    name: "Seville",
    population: 688711,
    isCapital: false,
    countryId: 11,
    country: "Spain",
  },
  {
    id: 1105,
    name: "Bilbao",
    population: 345821,
    isCapital: false,
    countryId: 11,
    country: "Spain",
  },

  // Italy
  {
    id: 1201,
    name: "Rome",
    population: 2872800,
    isCapital: true,
    countryId: 12,
    country: "Italy",
  },
  {
    id: 1202,
    name: "Milan",
    population: 1396000,
    isCapital: false,
    countryId: 12,
    country: "Italy",
  },
  {
    id: 1203,
    name: "Naples",
    population: 967069,
    isCapital: false,
    countryId: 12,
    country: "Italy",
  },
  {
    id: 1204,
    name: "Turin",
    population: 875698,
    isCapital: false,
    countryId: 12,
    country: "Italy",
  },
  {
    id: 1205,
    name: "Florence",
    population: 382258,
    isCapital: false,
    countryId: 12,
    country: "Italy",
  },

  // Mexico
  {
    id: 1301,
    name: "Mexico City",
    population: 21581000,
    isCapital: true,
    countryId: 13,
    country: "Mexico",
  },
  {
    id: 1302,
    name: "Guadalajara",
    population: 5268642,
    isCapital: false,
    countryId: 13,
    country: "Mexico",
  },
  {
    id: 1303,
    name: "Monterrey",
    population: 5341171,
    isCapital: false,
    countryId: 13,
    country: "Mexico",
  },
  {
    id: 1304,
    name: "Cancún",
    population: 888797,
    isCapital: false,
    countryId: 13,
    country: "Mexico",
  },
  {
    id: 1305,
    name: "Tijuana",
    population: 1922523,
    isCapital: false,
    countryId: 13,
    country: "Mexico",
  },

  // South Korea
  {
    id: 1401,
    name: "Seoul",
    population: 9776000,
    isCapital: true,
    countryId: 14,
    country: "South Korea",
  },
  {
    id: 1402,
    name: "Busan",
    population: 3449000,
    isCapital: false,
    countryId: 14,
    country: "South Korea",
  },
  {
    id: 1403,
    name: "Incheon",
    population: 2954000,
    isCapital: false,
    countryId: 14,
    country: "South Korea",
  },
  {
    id: 1404,
    name: "Daegu",
    population: 2461000,
    isCapital: false,
    countryId: 14,
    country: "South Korea",
  },
  {
    id: 1405,
    name: "Daejeon",
    population: 1539000,
    isCapital: false,
    countryId: 14,
    country: "South Korea",
  },

  // Russia
  {
    id: 1501,
    name: "Moscow",
    population: 12500000,
    isCapital: true,
    countryId: 15,
    country: "Russia",
  },
  {
    id: 1502,
    name: "Saint Petersburg",
    population: 5398000,
    isCapital: false,
    countryId: 15,
    country: "Russia",
  },
  {
    id: 1503,
    name: "Novosibirsk",
    population: 1625000,
    isCapital: false,
    countryId: 15,
    country: "Russia",
  },
  {
    id: 1504,
    name: "Yekaterinburg",
    population: 1493000,
    isCapital: false,
    countryId: 15,
    country: "Russia",
  },
  {
    id: 1505,
    name: "Kazan",
    population: 1257000,
    isCapital: false,
    countryId: 15,
    country: "Russia",
  },
];

// GET /api/cities - Get all cities
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const countryId = searchParams.get("countryId");
  const isCapital = searchParams.get("isCapital");
  const search = searchParams.get("search");
  const minPopulation = searchParams.get("minPopulation");
  const maxPopulation = searchParams.get("maxPopulation");

  let filteredData = [...citiesData];

  // Filter by ID
  if (id) {
    const city = filteredData.find((c) => c.id === parseInt(id));
    if (!city) {
      return NextResponse.json(
        { success: false, error: "City not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: city });
  }

  // Filter by country
  if (countryId) {
    filteredData = filteredData.filter(
      (c) => c.countryId === parseInt(countryId)
    );
  }

  // Filter by capital status
  if (isCapital !== null) {
    const capitalFilter = isCapital === "true";
    filteredData = filteredData.filter((c) => c.isCapital === capitalFilter);
  }

  // Search by name
  if (search) {
    filteredData = filteredData.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by population range
  if (minPopulation) {
    filteredData = filteredData.filter(
      (c) => c.population >= parseInt(minPopulation)
    );
  }
  if (maxPopulation) {
    filteredData = filteredData.filter(
      (c) => c.population <= parseInt(maxPopulation)
    );
  }

  return NextResponse.json({
    success: true,
    count: filteredData.length,
    data: filteredData,
  });
}

// POST /api/cities - Create a new city (simulated)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.countryId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, countryId" },
        { status: 400 }
      );
    }

    const newCity = {
      id: citiesData.length + 1,
      name: body.name,
      population: body.population || 0,
      isCapital: body.isCapital || false,
      countryId: body.countryId,
      country: body.country || "Unknown",
    };

    return NextResponse.json(
      { success: true, message: "City created successfully", data: newCity },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}

// PUT /api/cities - Update a city (simulated)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "City ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const city = citiesData.find((c) => c.id === parseInt(id));

    if (!city) {
      return NextResponse.json(
        { success: false, error: "City not found" },
        { status: 404 }
      );
    }

    const updatedCity = {
      ...city,
      ...body,
      id: city.id,
    };

    return NextResponse.json({
      success: true,
      message: "City updated successfully",
      data: updatedCity,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}

// DELETE /api/cities - Delete a city (simulated)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "City ID is required" },
      { status: 400 }
    );
  }

  const city = citiesData.find((c) => c.id === parseInt(id));

  if (!city) {
    return NextResponse.json(
      { success: false, error: "City not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `City '${city.name}' deleted successfully`,
  });
}
