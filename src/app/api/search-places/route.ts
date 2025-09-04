import { NextResponse } from "next/server";
import axios from "axios";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchAdditionalPages = async (nextPageToken: string, key: string) => {
  const allResults: any[] = [];

  let token = nextPageToken;
  let attempts = 0;

  while (token && attempts < 2) {
    await sleep(2000);
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          pagetoken: token,
          key,
        },
      }
    );

    if (res.data?.results?.length) {
      allResults.push(...res.data.results);
    }

    token = res.data.next_page_token;
    attempts++;
  }

  return allResults;
};

export async function POST(req: Request) {
  try {
    const { query, location, radius } = await req.json();
    
    // Mock data fallback for demo purposes
    const mockPlaces = [
      { name: `${query} Demo 1`, address: `123 Main St, ${location}`, place_id: 'demo_1' },
      { name: `${query} Demo 2`, address: `456 Oak Ave, ${location}`, place_id: 'demo_2' },
      { name: `${query} Demo 3`, address: `789 Pine Rd, ${location}`, place_id: 'demo_3' },
      { name: `${query} Demo 4`, address: `321 Elm St, ${location}`, place_id: 'demo_4' },
      { name: `${query} Demo 5`, address: `654 Maple Dr, ${location}`, place_id: 'demo_5' },
    ];
    
    if (!process.env.PLACE_API_KEY) {
      return NextResponse.json({ places: mockPlaces });
    }

    try {
      const initialRes = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        {
          params: {
            query: `${query} in ${location}`,
            key: process.env.PLACE_API_KEY,
          },
        }
      );

      if (initialRes.data.status !== 'OK') {
        console.log('Google API not available, using mock data');
        return NextResponse.json({ places: mockPlaces });
      }

      if (!initialRes.data?.results?.length) {
        return NextResponse.json({ places: mockPlaces });
      }

      const allResults = [...initialRes.data.results];

      if (initialRes.data.next_page_token) {
        const nextPageResults = await fetchAdditionalPages(
          initialRes.data.next_page_token,
          process.env.PLACE_API_KEY!
        );
        allResults.push(...nextPageResults);
      }

      const places = allResults.map((place: any) => ({
        name: place.name,
        address: place.formatted_address,
        place_id: place.place_id,
      }));

      return NextResponse.json({ places });
    } catch (apiError) {
      console.log('Google API error, using mock data:', apiError);
      return NextResponse.json({ places: mockPlaces });
    }
  } catch (error) {
    console.error("Search error:", error);
    const { query, location } = await req.json();
    const mockPlaces = [
      { name: `${query} Demo 1`, address: `123 Main St, ${location}`, place_id: 'demo_1' },
      { name: `${query} Demo 2`, address: `456 Oak Ave, ${location}`, place_id: 'demo_2' },
    ];
    return NextResponse.json({ places: mockPlaces });
  }
}
