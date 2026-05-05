import { useEffect, useState } from 'react';
import { api, TraceSpan } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TraceNode extends TraceSpan {
  children: TraceNode[];
}

export function TracesPage() {
  const [spans, setSpans] = useState<TraceSpan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getTraces().then(data => {
      setSpans(data);
      setLoading(false);
    });
  }, []);

  // Build tree
  const buildTree = (allSpans: TraceSpan[]) => {
    const map = new Map<string, TraceNode>();
    const roots: TraceNode[] = [];

    allSpans.forEach(span => {
      map.set(span.id, { ...span, children: [] });
    });

    allSpans.forEach(span => {
      if (span.parentId) {
        const parent = map.get(span.parentId);
        if (parent) {
          parent.children.push(map.get(span.id)!);
        }
      } else {
        roots.push(map.get(span.id)!);
      }
    });

    return roots;
  };

  const roots = buildTree(spans);
  const totalDuration = roots.length > 0 ? roots[0].duration : 0;

  const hasMatch = (node: TraceNode, term: string): boolean => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    if (node.name.toLowerCase().includes(lowerTerm)) return true;
    if (node.service.toLowerCase().includes(lowerTerm)) return true;
    if (node.id.toLowerCase().includes(lowerTerm)) return true;
    return node.children.some(child => hasMatch(child, term));
  };

  const renderNode = (node: TraceNode, depth: number = 0) => {
    if (!hasMatch(node, search)) return null;

    const widthPercentage = Math.max((node.duration / totalDuration) * 100, 0.5);
    const isError = node.status === 'ERROR';

    return (
      <div key={node.id} className="flex flex-col w-full relative">
        <div className="flex items-center gap-4 py-2 border-b border-border/50 group hover:bg-muted/30 transition-colors w-full px-4">
          <div className="w-1/3 flex items-center min-w-[300px]" style={{ paddingLeft: `${depth * 24}px` }}>
            <span className="w-4 h-4 mr-1 text-muted-foreground">
              {node.children.length > 0 ? <ChevronDown className="h-4 w-4" /> : null}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Badge variant={isError ? "destructive" : "outline"} className={`text-[10px] ${!isError && 'bg-primary/10 text-primary border-primary/20'}`}>
                  {node.service}
                </Badge>
                {isError && <AlertCircle className="h-3 w-3 text-destructive" />}
              </div>
              <span className="text-sm font-medium font-mono mt-1">{node.name}</span>
            </div>
          </div>
          
          <div className="flex-1 relative h-6 rounded bg-secondary/50 overflow-hidden flex items-center group-hover:bg-secondary transition-colors">
            <div 
              className={`h-full rounded bg-primary/20 border border-primary/50 relative ${isError && 'bg-destructive/20 border-destructive/50'}`}
              style={{ width: `${widthPercentage}%` }}
            >
              <span className="absolute inset-y-0 left-2 flex items-center text-[10px] font-mono font-medium text-foreground">
                {node.duration}ms
              </span>
            </div>
          </div>
        </div>
        <div>
          {node.children.map(child => renderNode(child, depth + 1))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Distributed Tracing</h2>
          <p className="text-muted-foreground mt-2">Zipkin integration to track requests across microservices.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search trace by name, service, or ID..." 
            className="pl-9 font-mono text-sm" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}><Clock className="h-4 w-4 mr-2" /> Refresh</Button>
      </div>

      <Card className="flex-1 overflow-auto bg-card/50">
        <div className="border-b bg-muted/50 p-4 sticky top-0 z-10 flex gap-4 text-sm text-muted-foreground font-mono">
          <div className="w-1/3 min-w-[300px]">Service & Operation</div>
          <div className="flex-1">Timeline ({totalDuration}ms total)</div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">Reconstructing trace tree...</div>
        ) : (
          <div className="flex flex-col w-full min-w-[800px]">
            {roots.map(root => renderNode(root))}
          </div>
        )}
      </Card>
    </div>
  );
}
