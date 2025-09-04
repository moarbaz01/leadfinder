import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const businessType = searchParams.get('businessType');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (businessType) filter.businessType = businessType;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Lead.countDocuments(filter);
    
    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const leadData = await req.json();
    
    const existingLead = await Lead.findOne({ placeId: leadData.placeId });
    if (existingLead) {
      return NextResponse.json({ error: 'Lead already exists' }, { status: 400 });
    }
    
    const lead = new Lead(leadData);
    await lead.save();
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}