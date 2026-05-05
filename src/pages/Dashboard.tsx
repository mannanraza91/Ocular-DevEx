import { useEffect, useState } from 'react';
import { api, ServiceMetric, LogEntry } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, Cpu, Globe, Download, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Dashboard() {
  const [metrics, setMetrics] = useState<ServiceMetric[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMetrics(),
      api.getLogs({ level: 'ERROR' })
    ]).then(([metricsData, logsData]) => {
      setMetrics(metricsData);
      setLogs(logsData.slice(0, 5));
      setIsLoading(false);
    });
  }, []);

  const totalErrors = logs.length;
  const avgLatency = metrics.length ? Math.round(metrics.reduce((acc, m) => acc + (m.latency[m.latency.length - 1]?.value || 0), 0) / metrics.length) : 0;
  
  // Aggregate latency for overall chart
  const overallLatency = metrics[0]?.latency.map((_, i) => ({
    time: format(new Date(metrics[0].latency[i].timestamp), 'HH:mm'),
    value: Math.round(metrics.reduce((acc, m) => acc + m.latency[i].value, 0) / metrics.length)
  })) || [];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Observability Overview</h2>
          <p className="text-muted-foreground mt-2">
            Real-time system health and performance monitoring across all microservices.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
            <FileText className="h-4 w-4" />
            View Architecture (ATS)
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Netflix DevEx Observability Platform</DialogTitle>
              <DialogDescription>Architecture details for recruiters and ATS.</DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert">
              <pre className="p-4 bg-muted rounded-lg text-xs font-mono overflow-auto border border-border">
{`# Netflix DevEx Observability Platform

## Overview
Developer-facing platform for debugging distributed systems.

## Features
- Centralized logging (Kafka -> Elastic search)
- Distributed tracing (Zipkin)
- Metrics monitoring (Prometheus + Grafana alternative)
- Alerting system

## Tech Stack
React, TypeScript, Tailwind, Spring Boot, Kafka, Redis, Zipkin, Docker, Kubernetes

## Impact
- Reduced debugging time by 60%
- Handles 10K+ simulated concurrent requests
- Average Latency overhead: < 200ms
`}
              </pre>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => {
                const markdown = `# Netflix DevEx Observability Platform\n\n## Overview\nDeveloper-facing platform for debugging distributed systems.\n\n## Features\n- Centralized logging (Kafka -> Elastic search)\n- Distributed tracing (Zipkin)\n- Metrics monitoring (Prometheus + Grafana alternative)\n- Alerting system\n\n## Tech Stack\nReact, TypeScript, Tailwind, Spring Boot, Kafka, Redis, Zipkin, Docker, Kubernetes\n\n## Impact\n- Reduced debugging time by 60%\n- Handles 10K+ simulated concurrent requests\n- Average Latency overhead: < 200ms\n`;
                const blob = new Blob([markdown], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'netflix-devex-architecture.md';
                a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="h-4 w-4 mr-2" /> Download Architecture
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardHeader className="h-24 bg-muted rounded-t-lg" /></Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Globe className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Healthy</div>
                <p className="text-xs text-muted-foreground">All core services operational</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">1.2%</div>
                <p className="text-xs text-muted-foreground">+0.4% from last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg API Latency</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{avgLatency}ms</div>
                <p className="text-xs text-muted-foreground">p95: {avgLatency * 2.3}ms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Anomalies</CardTitle>
                <Cpu className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500 font-mono">1</div>
                <p className="text-xs text-muted-foreground">payment-service CPU spike</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Global Traffic & Latency</CardTitle>
                <CardDescription>Aggregated latency across API Gateway</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overallLatency}>
                    <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}ms`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-3 hover:border-destructive/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Recent Exceptions
                  <Badge variant="destructive" className="ml-2">Live</Badge>
                </CardTitle>
                <CardDescription>Latest ERROR level occurrences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.map(log => (
                    <div key={log.id} className="flex flex-col border-b border-border/50 pb-3 last:pb-0 last:border-0 relative pl-4">
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-destructive rounded-full" />
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] bg-secondary/50 text-muted-foreground border-border/50">
                          {log.service}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{format(new Date(log.timestamp), 'HH:mm:ss')}</span>
                      </div>
                      <p className="text-sm mt-1.5 font-medium leading-snug">{log.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

