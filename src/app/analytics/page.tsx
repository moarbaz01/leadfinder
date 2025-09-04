"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/dashboard-layout";
import { BarChart3, Users, TrendingUp, Target } from "lucide-react";
import axios from "axios";

interface Analytics {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/leads');
      const leads = response.data.leads;
      
      const totalLeads = leads.length;
      const newLeads = leads.filter((lead: any) => lead.status === 'New').length;
      const contactedLeads = leads.filter((lead: any) => lead.status === 'Contacted').length;
      const convertedLeads = leads.filter((lead: any) => lead.status === 'Converted').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      setAnalytics({
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        conversionRate
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const stats = [
    {
      title: "Total Leads",
      value: analytics.totalLeads,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "New Leads",
      value: analytics.newLeads,
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Contacted",
      value: analytics.contactedLeads,
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Converted",
      value: analytics.convertedLeads,
      icon: BarChart3,
      color: "text-purple-600"
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your lead generation performance and conversion rates.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {loading ? "..." : `${analytics.conversionRate.toFixed(1)}%`}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Percentage of leads that have been converted
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}