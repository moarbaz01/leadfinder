import mongoose from 'mongoose';

export interface ILead extends mongoose.Document {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  mapsUrl?: string;
  rating?: number;
  reviews?: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Rejected';
  placeId: string;
  businessType?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new mongoose.Schema<ILead>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  mapsUrl: { type: String },
  rating: { type: Number },
  reviews: { type: Number },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Rejected'],
    default: 'New'
  },
  placeId: { type: String, required: true, unique: true },
  businessType: { type: String },
  location: { type: String },
  notes: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);