import { NextResponse } from "next/server";

// Language data with countries that speak them
const languagesData = [
  {
    id: 1,
    name: "English",
    nativeName: "English",
    iso6391: "en",
    speakers: 1500000000,
    countries: [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "India",
    ],
    countryIds: [1, 2, 7, 9, 10],
  },
  {
    id: 2,
    name: "Spanish",
    nativeName: "Español",
    iso6391: "es",
    speakers: 580000000,
    countries: ["Spain", "Mexico", "United States"],
    countryIds: [1, 11, 13],
  },
  {
    id: 3,
    name: "Mandarin Chinese",
    nativeName: "普通话",
    iso6391: "zh",
    speakers: 1100000000,
    countries: ["China"],
    countryIds: [8],
  },
  {
    id: 4,
    name: "Hindi",
    nativeName: "हिन्दी",
    iso6391: "hi",
    speakers: 600000000,
    countries: ["India"],
    countryIds: [7],
  },
  {
    id: 5,
    name: "French",
    nativeName: "Français",
    iso6391: "fr",
    speakers: 280000000,
    countries: ["France", "Canada"],
    countryIds: [4, 10],
  },
  {
    id: 6,
    name: "Japanese",
    nativeName: "日本語",
    iso6391: "ja",
    speakers: 125000000,
    countries: ["Japan"],
    countryIds: [3],
  },
  {
    id: 7,
    name: "German",
    nativeName: "Deutsch",
    iso6391: "de",
    speakers: 132000000,
    countries: ["Germany"],
    countryIds: [5],
  },
  {
    id: 8,
    name: "Portuguese",
    nativeName: "Português",
    iso6391: "pt",
    speakers: 260000000,
    countries: ["Brazil"],
    countryIds: [6],
  },
  {
    id: 9,
    name: "Russian",
    nativeName: "Русский",
    iso6391: "ru",
    speakers: 258000000,
    countries: ["Russia"],
    countryIds: [15],
  },
  {
    id: 10,
    name: "Korean",
    nativeName: "한국어",
    iso6391: "ko",
    speakers: 81000000,
    countries: ["South Korea"],
    countryIds: [14],
  },
  {
    id: 11,
    name: "Italian",
    nativeName: "Italiano",
    iso6391: "it",
    speakers: 85000000,
    countries: ["Italy"],
    countryIds: [12],
  },
  {
    id: 12,
    name: "Bengali",
    nativeName: "বাংলা",
    iso6391: "bn",
    speakers: 270000000,
    countries: ["India"],
    countryIds: [7],
  },
  {
    id: 13,
    name: "Telugu",
    nativeName: "తెలుగు",
    iso6391: "te",
    speakers: 95000000,
    countries: ["India"],
    countryIds: [7],
  },
  {
    id: 14,
    name: "Marathi",
    nativeName: "मराठी",
    iso6391: "mr",
    speakers: 83000000,
    countries: ["India"],
    countryIds: [7],
  },
  {
    id: 15,
    name: "Catalan",
    nativeName: "Català",
    iso6391: "ca",
    speakers: 10000000,
    countries: ["Spain"],
    countryIds: [11],
  },
  {
    id: 16,
    name: "Galician",
    nativeName: "Galego",
    iso6391: "gl",
    speakers: 2400000,
    countries: ["Spain"],
    countryIds: [11],
  },
  {
    id: 17,
    name: "Basque",
    nativeName: "Euskara",
    iso6391: "eu",
    speakers: 750000,
    countries: ["Spain"],
    countryIds: [11],
  },
  {
    id: 18,
    name: "Welsh",
    nativeName: "Cymraeg",
    iso6391: "cy",
    speakers: 880000,
    countries: ["United Kingdom"],
    countryIds: [2],
  },
  {
    id: 19,
    name: "Scottish Gaelic",
    nativeName: "Gàidhlig",
    iso6391: "gd",
    speakers: 57000,
    countries: ["United Kingdom"],
    countryIds: [2],
  },
  {
    id: 20,
    name: "Cantonese",
    nativeName: "粵語",
    iso6391: "yue",
    speakers: 85000000,
    countries: ["China"],
    countryIds: [8],
  },
  {
    id: 21,
    name: "Wu",
    nativeName: "吳語",
    iso6391: "wuu",
    speakers: 81000000,
    countries: ["China"],
    countryIds: [8],
  },
  {
    id: 22,
    name: "Min",
    nativeName: "閩語",
    iso6391: "nan",
    speakers: 70000000,
    countries: ["China"],
    countryIds: [8],
  },
  {
    id: 23,
    name: "Nahuatl",
    nativeName: "Nāhuatl",
    iso6391: "nah",
    speakers: 1700000,
    countries: ["Mexico"],
    countryIds: [13],
  },
  {
    id: 24,
    name: "Yucatec Maya",
    nativeName: "Màaya T'àan",
    iso6391: "yua",
    speakers: 800000,
    countries: ["Mexico"],
    countryIds: [13],
  },
];

// GET /api/languages - Get all languages
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const countryId = searchParams.get("countryId");
  const search = searchParams.get("search");
  const minSpeakers = searchParams.get("minSpeakers");

  let filteredData = [...languagesData];

  // Filter by ID
  if (id) {
    const language = filteredData.find((l) => l.id === parseInt(id));
    if (!language) {
      return NextResponse.json(
        { success: false, error: "Language not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: language });
  }

  // Filter by country
  if (countryId) {
    filteredData = filteredData.filter((l) =>
      l.countryIds.includes(parseInt(countryId))
    );
  }

  // Search by name
  if (search) {
    filteredData = filteredData.filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.nativeName.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by minimum speakers
  if (minSpeakers) {
    filteredData = filteredData.filter(
      (l) => l.speakers >= parseInt(minSpeakers)
    );
  }

  return NextResponse.json({
    success: true,
    count: filteredData.length,
    data: filteredData,
  });
}

// POST /api/languages - Create a new language (simulated)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.iso6391) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, iso6391" },
        { status: 400 }
      );
    }

    const newLanguage = {
      id: languagesData.length + 1,
      name: body.name,
      nativeName: body.nativeName || body.name,
      iso6391: body.iso6391,
      speakers: body.speakers || 0,
      countries: body.countries || [],
      countryIds: body.countryIds || [],
    };

    return NextResponse.json(
      {
        success: true,
        message: "Language created successfully",
        data: newLanguage,
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

// PUT /api/languages - Update a language (simulated)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Language ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const language = languagesData.find((l) => l.id === parseInt(id));

    if (!language) {
      return NextResponse.json(
        { success: false, error: "Language not found" },
        { status: 404 }
      );
    }

    const updatedLanguage = {
      ...language,
      ...body,
      id: language.id,
    };

    return NextResponse.json({
      success: true,
      message: "Language updated successfully",
      data: updatedLanguage,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON data" },
      { status: 400 }
    );
  }
}

// DELETE /api/languages - Delete a language (simulated)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Language ID is required" },
      { status: 400 }
    );
  }

  const language = languagesData.find((l) => l.id === parseInt(id));

  if (!language) {
    return NextResponse.json(
      { success: false, error: "Language not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Language '${language.name}' deleted successfully`,
  });
}
