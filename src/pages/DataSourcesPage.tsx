import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Search, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function DataSourcesPage() {
  const dataSources = [
    { id: 'ds-1', name: 'Elasticsearch (Primary Logs)', type: 'Elasticsearch', status: 'connected', latency: '45ms' },
    { id: 'ds-2', name: 'Zipkin Cluster', type: 'Zipkin', status: 'connected', latency: '12ms' },
    { id: 'ds-3', name: 'Prometheus Main', type: 'Prometheus', status: 'connected', latency: '8ms' },
    { id: 'ds-4', name: 'Kafka Metrics Stream', type: 'Kafka', status: 'connected', latency: '2ms' },
    { id: 'ds-5', name: 'Legacy Logstash', type: 'Logstash', status: 'error', latency: 'N/A' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Sources</h2>
          <p className="text-muted-foreground mt-2">Manage upstream telemetry and log integrations.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Connection</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search data sources..." className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataSources.map(ds => (
          <Card key={ds.id} className={ds.status === 'error' ? 'border-destructive/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{ds.name}</CardTitle>
                {ds.status === 'connected' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              <CardDescription>{ds.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-2">
                  <Badge variant={ds.status === 'connected' ? 'secondary' : 'destructive'}>
                    {ds.status}
                  </Badge>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">Latency</span>
                  <span className="font-mono">{ds.latency}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
                <Button variant="outline" size="sm" className="w-full">Test Connection</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
