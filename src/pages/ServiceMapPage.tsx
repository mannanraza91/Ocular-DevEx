import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Server, Smartphone, ExternalLink, Activity } from 'lucide-react';

export function ServiceMapPage() {
  const nodes = [
    { id: 'gw', label: 'api-gateway', type: 'gateway', status: 'ok', x: 50, y: 30 },
    { id: 'auth', label: 'auth-service', type: 'service', status: 'ok', x: 20, y: 60 },
    { id: 'pay', label: 'payment-service', type: 'service', status: 'error', x: 50, y: 60 },
    { id: 'inv', label: 'inventory-service', type: 'service', status: 'ok', x: 80, y: 60 },
    { id: 'db1', label: 'postgres-users', type: 'db', status: 'ok', x: 20, y: 90 },
    { id: 'db2', label: 'stripe-api', type: 'external', status: 'ok', x: 50, y: 90 },
    { id: 'db3', label: 'redis-cache', type: 'db', status: 'ok', x: 80, y: 90 },
    { id: 'client', label: 'frontend-app', type: 'client', status: 'ok', x: 50, y: 5 },
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Service Topology</h2>
          <p className="text-muted-foreground mt-2">Auto-discovered microservice architecture map.</p>
        </div>
      </div>

      <Card className="flex-1 bg-card/30 border-muted relative overflow-hidden flex items-center justify-center p-8 min-h-[600px]">
        {/* Draw edges (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" className="opacity-50" />
            </marker>
            <marker id="arrowhead-error" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--destructive))" className="opacity-80" />
            </marker>
          </defs>
          
          <g transform="translate(0, 0)">
            {/* Edges from Client to Gateway */}
            <path d="M 50% 10% C 50% 20%, 50% 20%, 50% 28%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowhead)" className="opacity-50 animate-[dash_1s_linear_infinite]" />
            
            {/* Gateway to Services */}
            <path d="M 50% 35% C 50% 45%, 20% 45%, 20% 55%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" className="opacity-50" />
            <path d="M 50% 35% C 50% 45%, 50% 45%, 50% 55%" stroke="hsl(var(--destructive))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-error)" className="opacity-80" />
            <path d="M 50% 35% C 50% 45%, 80% 45%, 80% 55%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" className="opacity-50" />
            
            {/* Services to DBs */}
            <path d="M 20% 65% C 20% 75%, 20% 75%, 20% 85%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" className="opacity-50" />
            <path d="M 50% 65% C 50% 75%, 50% 75%, 50% 85%" stroke="hsl(var(--destructive))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead-error)" className="opacity-80" />
            <path d="M 80% 65% C 80% 75%, 80% 75%, 80% 85%" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" className="opacity-50" />
          </g>
        </svg>

        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -10; }
          }
        `}</style>

        {/* Nodes */}
        {nodes.map(node => {
          const isError = node.status === 'error';
          
          return (
            <div 
              key={node.id} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 group"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={`p-4 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 cursor-pointer shadow-lg
                ${isError ? 'bg-destructive/10 border-destructive shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)] text-destructive' : 'bg-card border-border text-foreground'}`}>
                {node.type === 'gateway' && <Server className="h-6 w-6" />}
                {node.type === 'service' && <Activity className="h-6 w-6" />}
                {node.type === 'db' && <Database className="h-6 w-6" />}
                {node.type === 'external' && <ExternalLink className="h-6 w-6" />}
                {node.type === 'client' && <Smartphone className="h-6 w-6" />}
              </div>
              <Badge variant="outline" className={`font-mono ${isError ? 'bg-destructive/20 text-destructive border-transparent' : 'bg-background/80 backdrop-blur'}`}>
                {node.label}
              </Badge>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
