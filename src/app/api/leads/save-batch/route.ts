import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { leads, businessType, location } = await req.json();
    
    const savedLeads = [];
    const skippedLeads = [];
    
    for (const leadData of leads) {
      const existingLead = await Lead.findOne({ placeId: leadData.placeId });
      
      if (existingLead) {
        skippedLeads.push(leadData.name);
        continue;
      }
      
      const lead = new Lead({
        ...leadData,
        businessType,
        location,
        status: 'New'
      });
      
      await lead.save();
      savedLeads.push(lead);
    }
    
    return NextResponse.json({
      saved: savedLeads.length,
      skipped: skippedLeads.length,
      skippedNames: skippedLeads,
      leads: savedLeads
    });
  } catch (error) {
    console.error('Error saving leads:', error);
    return NextResponse.json({ error: 'Failed to save leads' }, { status: 500 });
  }
}