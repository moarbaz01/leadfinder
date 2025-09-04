"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, ChevronRight, Trash2, Filter, Users } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Lead {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  status: string;
  businessType?: string;
  rating?: number;
  reviews?: number;
  createdAt: string;
}

const statusOptions = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Rejected",
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [mounted, setMounted] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await axios.get(`/api/leads?${params}`);
      setLeads(response.data.leads);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      await axios.put(`/api/leads/${leadId}`, { status });
      toast.success("Lead status updated");
      fetchLeads();
    } catch (error) {
      toast.error("Failed to update lead");
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`/api/leads/${leadId}`);
      toast.success("Lead deleted");
      fetchLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchLeads();
    }
  }, [page, search, statusFilter, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Lead Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Track, filter, and manage your business leads efficiently
              </p>
            </div>
          </div>
        </div>

        <Card className="border border-gray-200 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name or address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setPage(1);
                  fetchLeads();
                }}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {lead.address}
                      </TableCell>
                      <TableCell>{lead.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) =>
                            updateLeadStatus(lead._id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{lead.rating || "N/A"}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteLead(lead._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({leads.length} leads)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
