import { useEffect, useState } from 'react';
import { api, ServiceMetric } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Cpu, MemoryStick, Activity, Zap } from 'lucide-react';
import { format } from 'date-fns';

export function MetricsPage() {
  const [metrics, setMetrics] = useState<ServiceMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMetrics().then(data => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8"><div className="animate-pulse h-96 bg-muted rounded-xl" /></div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Metrics</h2>
          <p className="text-muted-foreground mt-2">Prometheus real-time metrics stream.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {metrics.map(service => {
          const currentLatency = Math.round(service.latency[service.latency.length - 1].value);
          const currentCpu = Math.round(service.cpu[service.cpu.length - 1].value);
          const isStressed = currentCpu > 80 || currentLatency > 300;

          // Format data for Recharts
          const chartData = service.cpu.map((point, i) => ({
            time: format(new Date(point.timestamp), 'HH:mm'),
            cpu: Math.round(point.value),
            memory: Math.round(service.memory[i].value),
            latency: Math.round(service.latency[i].value)
          }));

          return (
            <Card key={service.service} className={isStressed ? 'border-orange-500/50 shadow-[0_0_15px_-3px_rgba(249,115,22,0.1)]' : ''}>
              <CardHeader className="pb-2 border-b bg-muted/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-mono text-base">{service.service}</CardTitle>
                    {isStressed && <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">High Load</Badge>}
                  </div>
                  <div className="flex gap-4 text-xs font-mono">
                    <span className="flex items-center gap-1 text-muted-foreground"><Cpu className="h-3 w-3" /> {currentCpu}%</span>
                    <span className="flex items-center gap-1 text-primary"><Activity className="h-3 w-3" /> {currentLatency}ms</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-4 h-48">
                <div className="flex flex-col h-full">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Cpu className="h-3 w-3" /> CPU & Memory Usage</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`colorCpu_${service.service}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                      <Area type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" fillOpacity={1} fill={`url(#colorCpu_${service.service})`} />
                      <Area type="monotone" dataKey="memory" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col h-full border-l pl-4">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Zap className="h-3 w-3" /> Response Latency</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`colorLat_${service.service}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isStressed ? "#f97316" : "hsl(var(--chart-2))"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={isStressed ? "#f97316" : "hsl(var(--chart-2))"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 'dataMax + 100']} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                      <Area type="monotone" dataKey="latency" stroke={isStressed ? "#f97316" : "hsl(var(--chart-2))"} fillOpacity={1} fill={`url(#colorLat_${service.service})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
