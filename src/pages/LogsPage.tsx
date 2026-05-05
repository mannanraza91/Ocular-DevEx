import { useEffect, useState, useRef } from 'react';
import { api, LogEntry, LogLevel } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, TerminalSquare, Pause, Play } from 'lucide-react';
import { format } from 'date-fns';

export function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isLive, setIsLive] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLogs();
  }, [search]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive && !loading) {
      interval = setInterval(() => {
        const newLogEntry: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          service: ['api-gateway', 'auth-service', 'inventory-service', 'payment-service'][Math.floor(Math.random() * 4)],
          level: Math.random() > 0.9 ? 'ERROR' : Math.random() > 0.7 ? 'WARN' : 'INFO',
          message: `Processed incoming request via Kafka topic 'logs-stream'`,
          traceId: `trace-${Math.floor(Math.random() * 9999)}`,
        };
        if (newLogEntry.level === 'ERROR') {
          newLogEntry.message = `Failed connection to downstream service (Timeout)`;
        }
        
        // Only append if it matches search
        if (search && !newLogEntry.message.toLowerCase().includes(search.toLowerCase()) && !newLogEntry.service.toLowerCase().includes(search.toLowerCase())) {
          return;
        }

        setLogs(prev => [newLogEntry, ...prev].slice(0, 150));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLive, loading, search]);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await api.getLogs({ search });
    setLogs(data);
    setLoading(false);
  };

  const getBadgeColor = (level: LogLevel) => {
    switch (level) {
      case 'ERROR': return 'bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_-2px_rgba(220,38,38,0.3)]';
      case 'WARN': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'INFO': default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Streamed Logs</h2>
          <p className="text-muted-foreground mt-2">Live log ingestion via Kafka / Elasticsearch.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}><Download className="h-4 w-4 mr-2" /> Export</Button>
          <Button 
            variant={isLive ? "default" : "secondary"} 
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <><Pause className="h-4 w-4 mr-2" /> Pause Live</> : <><Play className="h-4 w-4 mr-2" /> Resume Live</>}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search logs using Lucene syntax or plain text (e.g., service:payment-service)..." 
            className="pl-9 font-mono text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="flex-1 overflow-auto bg-[#0a0a0c] border-[#222]">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Connecting to Kafka stream...</div>
        ) : (
          <table className="w-full text-sm font-mono text-left whitespace-nowrap">
            <thead className="sticky top-0 bg-[#0a0a0c]/90 backdrop-blur z-10 border-b border-[#222]">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground w-40">Timestamp</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-24">Level</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-48">Service</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Message</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-32">Trace ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]/50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-2.5 text-muted-foreground/70 text-xs">{format(new Date(log.timestamp), 'MMM dd HH:mm:ss.SSS')}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getBadgeColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-primary/90">{log.service}</td>
                  <td className={`px-4 py-2.5 truncate max-w-2xl ${log.level === 'ERROR' ? 'text-destructive font-medium' : 'text-foreground/80'}`}>
                    {log.message}
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="text-muted-foreground/60 hover:text-primary transition-colors text-xs underline decoration-dotted">
                      {log.traceId}
                    </button>
                  </td>
                </tr>
              ))}
              <tr ref={bottomRef} />
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
