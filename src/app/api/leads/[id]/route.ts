import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const updateData = await req.json();
    
    const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const lead = await Lead.findByIdAndDelete(id);
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}