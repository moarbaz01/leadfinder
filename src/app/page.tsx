"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Download, Filter, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToExcel } from "@/lib/exportData";

interface Lead {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapsUrl: string | null;
  website: string | null;
  status: string;
  rating: number | null;
  reviews: any[] | null;
}
interface BusinessLead {
  name: string;
  address: string;
  place_id: string;
}

const businessTypes = [
  "Restaurant", "Fast Food", "Pizza", "Coffee Shop", "Bakery", "Bar", "Cafe",
  "Gym", "Yoga Studio", "Pilates", "CrossFit", "Martial Arts", "Dance Studio",
  "Hair Salon", "Barber Shop", "Nail Salon", "Spa", "Massage Therapy", "Beauty Salon",
  "Dentist", "Doctor's Office", "Chiropractor", "Physical Therapy", "Veterinarian", "Optometrist",
  "Auto Repair", "Car Wash", "Gas Station", "Tire Shop", "Auto Parts",
  "Real Estate Agency", "Insurance Agency", "Law Firm", "Accounting", "Financial Advisor",
  "Retail Store", "Clothing Store", "Electronics Store", "Furniture Store", "Jewelry Store",
  "Pet Store", "Florist", "Hardware Store", "Bookstore", "Pharmacy",
  "Hotel", "Motel", "Bed & Breakfast", "Travel Agency",
  "Plumber", "Electrician", "HVAC", "Roofing", "Landscaping", "Cleaning Service",
  "Photography", "Wedding Planner", "Catering", "Event Planning",
  "Daycare", "Tutoring", "Music Lessons", "Art Studio",
  "Bank", "Credit Union", "Loan Office", "Tax Service"
];

const LeadTable: React.FC<{
  leads: Lead[];
  isLoading: boolean;
  filteredLeads: Lead[];
  selectedLeads: string[];
  setSelectedLeads: (leads: string[]) => void;
}> = ({ leads, isLoading, filteredLeads, selectedLeads, setSelectedLeads }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="hidden md:table-cell">Website</TableHead>
              <TableHead className="hidden md:table-cell">Map URL</TableHead>
              <TableHead className="hidden md:table-cell">Ratings</TableHead>
              <TableHead className="hidden md:table-cell">Reviews</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-[20px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[180px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-[250px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[120px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-[150px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads([...selectedLeads, lead.id]);
                        } else {
                          setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap ">
                    {lead.name}
                  </TableCell>
                  <TableCell
                    className="hidden max-w-[150px] 
overflow-hidden text-ellipsis whitespace-nowrap  md:table-cell"
                  >
                    {lead.address}
                  </TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell className="hidden max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap md:table-cell">
                    {lead.website ? (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {lead.website.replace(/(^\w+:|^)\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not available
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="md:table-cell">
                    {lead.mapsUrl ? (
                      <a
                        href={lead.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {lead.mapsUrl.replace(/(^\w+:|^)\/\//, "")}
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not available
                      </span>
                    )}
                  </TableCell>
                  {/* Status cell */}
                  <TableCell className="hidden md:table-cell">
                    {lead.rating ? (
                      <span>{lead.rating}</span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not available
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {lead?.reviews ? (
                      <span>{lead?.reviews}</span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not available
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={lead.status === "New" ? "default" : "outline"}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
const BusinessLeadTable: React.FC<{
  leads: BusinessLead[];
  isLoading: boolean;
}> = ({ leads, isLoading }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead>Place ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-[180px] overflow-x-hidden" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-[250px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[120px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : leads.length > 0 ? (
              leads.map((lead, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium w-[180px]">
                    {lead.name}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] 
                    overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {lead.address}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {lead.place_id}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function LeadDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [showOnlyNoWebsite, setShowOnlyNoWebsite] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [businessLeads, setBusinessLeads] = useState<BusinessLead[]>([]);
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [hasWebsite, setHasWebsite] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");

  // Filter leads based on the "no website" toggle
  const handleFilterToggle = (checked: boolean) => {
    setShowOnlyNoWebsite(checked);
    if (checked) {
      setFilteredLeads(leads.filter((lead) => lead?.website === null));
    } else {
      setFilteredLeads(leads);
    }
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchText.trim() || !location.trim()) {
      toast.error("Please enter both search term and location");
      return;
    }
    
    setIsLoading(true);
    setSelectedLeads([]);

    try {
      const res = await axios.post("/api/search-places", {
        location: location.trim(),
        radius,
        query: searchText.trim(),
      });

      const data = res.data;

      if (data.error) {
        toast.error(data.error || "Failed to fetch leads. Please try again.");
        return;
      }

      if (!data.places || data.places.length === 0) {
        toast.error("No businesses found for your search criteria");
        setBusinessLeads([]);
        setFilteredLeads([]);
        setLeads([]);
        return;
      }

      setBusinessLeads(data.places);
      toast.success(`Found ${data.places.length} businesses`);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
      setShowOnlyNoWebsite(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await axios.post("/api/get-place-details", {
        placeId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  // Handle CSV export
  const handleExport = () => {
    exportToExcel(
      filteredLeads,
      `${location}-leads_${new Date().toISOString()}`
    );

    // Simulate export process
    setTimeout(() => {
      toast.success("CSV exported successfully.");
    }, 1000);
  };

  // Save leads to database
  const saveLeadsToDatabase = async () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to save");
      return;
    }

    try {
      const leadsToSave = filteredLeads.map(lead => ({
        name: lead.name,
        address: lead.address,
        phone: lead.phone,
        website: lead.website,
        mapsUrl: lead.mapsUrl,
        rating: lead.rating,
        reviews: lead.reviews,
        placeId: lead.id
      }));

      const response = await axios.post('/api/leads/save-batch', {
        leads: leadsToSave,
        businessType: searchText,
        location: location
      });

      toast.success(`Saved ${response.data.saved} leads, skipped ${response.data.skipped} duplicates`);
    } catch (error) {
      toast.error("Failed to save leads");
    }
  };

  // Save selected leads to database
  const saveSelectedLeads = async () => {
    if (selectedLeads.length === 0) {
      toast.error("No leads selected");
      return;
    }

    try {
      const leadsToSave = filteredLeads
        .filter(lead => selectedLeads.includes(lead.id))
        .map(lead => ({
          name: lead.name,
          address: lead.address,
          phone: lead.phone,
          website: lead.website,
          mapsUrl: lead.mapsUrl,
          rating: lead.rating,
          reviews: lead.reviews,
          placeId: lead.id
        }));

      const response = await axios.post('/api/leads/save-batch', {
        leads: leadsToSave,
        businessType: searchText,
        location: location
      });

      toast.success(`Saved ${response.data.saved} selected leads, skipped ${response.data.skipped} duplicates`);
      setSelectedLeads([]);
    } catch (error) {
      toast.error("Failed to save selected leads");
    }
  };

  useEffect(() => {
    if (businessLeads.length > 0) {
      const fetchPlaceDetails = async () => {
        const details = await Promise.all(
          businessLeads.map((lead) => getPlaceDetails(lead.place_id))
        );
        let updatedLeads = businessLeads.map((lead, index) => ({
          ...details[index],
          id: lead.place_id,
          status: "New",
        }));

        // Apply filters
        if (minRating > 0) {
          updatedLeads = updatedLeads.filter(lead => (lead.rating || 0) >= minRating);
        }
        if (hasWebsite === "with") {
          updatedLeads = updatedLeads.filter(lead => lead.website);
        }
        if (hasWebsite === "without") {
          updatedLeads = updatedLeads.filter(lead => !lead.website);
        }

        // Apply sorting
        updatedLeads.sort((a, b) => {
          if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
          if (sortBy === "reviews") return (b.reviews || 0) - (a.reviews || 0);
          if (sortBy === "name") return a.name.localeCompare(b.name);
          return 0;
        });

        setFilteredLeads(updatedLeads);
        setLeads(updatedLeads);
      };
      fetchPlaceDetails();
    }
  }, [businessLeads, minRating, hasWebsite, sortBy]);
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Lead Generation
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover and manage potential business leads with advanced filtering
              </p>
            </div>
          </div>
        </div>

        <Card className="border border-gray-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="pt-8">
            <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              <div className="grid gap-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  onValueChange={(value) => setSearchText(value)}
                  defaultValue={businessTypes[0]}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="searchText">Search</Label>
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  id="searchText"
                  placeholder="e.g. Restaurant, Gym"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  id="location"
                  placeholder="City, State or ZIP"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="radius">Radius (KM)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  placeholder="10"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minRating">Min Rating</Label>
                <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-6">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <input
                    type="checkbox"
                    id="select-all"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads(filteredLeads.map(lead => lead.id));
                      } else {
                        setSelectedLeads([]);
                      }
                    }}
                  />
                  <Label htmlFor="select-all" className="text-sm font-medium text-blue-700">
                    Select All ({selectedLeads.length})
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <Switch
                    id="no-website-filter"
                    checked={showOnlyNoWebsite}
                    onCheckedChange={handleFilterToggle}
                  />
                  <Label htmlFor="no-website-filter" className="flex items-center gap-2 text-sm font-medium text-purple-700">
                    <Filter className="h-4 w-4" />
                    No websites only
                  </Label>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
                  size="sm"
                  onClick={() => saveSelectedLeads()}
                  disabled={isLoading || selectedLeads.length === 0}
                >
                  Save Selected ({selectedLeads.length})
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md"
                  size="sm"
                  onClick={saveLeadsToDatabase}
                  disabled={isLoading || filteredLeads.length === 0}
                >
                  Save All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50 shadow-sm"
                  onClick={handleExport}
                  disabled={isLoading || filteredLeads.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-700">
                <span className="text-2xl font-bold text-green-600">{filteredLeads.length}</span> leads found
              </span>
            </div>
          </div>

          <Tabs defaultValue="business" className="space-y-4">
            <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="business" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Businesses
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Detailed Leads
              </TabsTrigger>
            </TabsList>
            <TabsContent value="business">
              <BusinessLeadTable leads={businessLeads} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="leads">
              <LeadTable
                leads={leads}
                isLoading={isLoading}
                filteredLeads={filteredLeads}
                selectedLeads={selectedLeads}
                setSelectedLeads={setSelectedLeads}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
