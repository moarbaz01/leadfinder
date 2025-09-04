import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { placeId } = await req.json();
    
    // Mock data for demo
    const mockDetails = {
      name: `Business ${placeId.replace('demo_', '')}`,
      website: Math.random() > 0.5 ? `https://example-${placeId}.com` : null,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      mapsUrl: `https://maps.google.com/?cid=${placeId}`,
      address: `${Math.floor(Math.random() * 999) + 1} Demo St, Demo City`,
      openingHours: null,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews: Math.floor(Math.random() * 200) + 10,
    };

    if (!process.env.PLACE_API_KEY || placeId.startsWith('demo_')) {
      return NextResponse.json(mockDetails);
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: process.env.PLACE_API_KEY,
            fields:
              "name,website,formatted_phone_number,url,formatted_address,opening_hours,rating,reviews,user_ratings_total",
          },
        }
      );

      const result = response.data.result;

      const placeDetails = {
        name: result.name,
        website: result.website || null,
        phone: result.formatted_phone_number || null,
        mapsUrl: result.url || null,
        address: result.formatted_address || null,
        openingHours: result.opening_hours
          ? result.opening_hours.weekday_text
          : null,
        rating: result.rating || null,
        reviews: result.user_ratings_total || null,
      };

      return NextResponse.json(placeDetails);
    } catch (apiError) {
      return NextResponse.json(mockDetails);
    }
  } catch (error) {
    console.error("Details error:", error);
    const { placeId } = await req.json();
    const mockDetails = {
      name: `Business ${placeId.replace('demo_', '')}`,
      website: Math.random() > 0.5 ? `https://example-${placeId}.com` : null,
      phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      mapsUrl: `https://maps.google.com/?cid=${placeId}`,
      address: `${Math.floor(Math.random() * 999) + 1} Demo St, Demo City`,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      reviews: Math.floor(Math.random() * 200) + 10,
    };
    return NextResponse.json(mockDetails);
  }
}
