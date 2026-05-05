// Mock data generators representing a real API Gateway

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  service: string;
  level: LogLevel;
  message: string;
  traceId?: string;
  metadata?: Record<string, string>;
}

export interface TraceSpan {
  id: string;
  traceId: string;
  parentId: string | null;
  name: string;
  service: string;
  timestamp: number;
  duration: number; // in milliseconds
  status: 'OK' | 'ERROR';
  tags: Record<string, string>;
}

export interface MetricPoint {
  timestamp: number;
  value: number;
}

export interface ServiceMetric {
  service: string;
  cpu: MetricPoint[];
  memory: MetricPoint[];
  latency: MetricPoint[];
  errorRate: MetricPoint[];
}

const mockServices = [
  'api-gateway',
  'auth-service',
  'log-service',
  'trace-service',
  'metrics-service',
  'inventory-service',
  'payment-service',
];

const mockLogs: LogEntry[] = Array.from({ length: 150 }).map((_, i) => {
  const service = mockServices[Math.floor(Math.random() * mockServices.length)];
  const isError = Math.random() > 0.8;
  const isWarn = Math.random() > 0.7;
  const level = isError ? 'ERROR' : isWarn ? 'WARN' : 'INFO';
  
  let message = `Successfully processed request for ${service}`;
  if (level === 'ERROR') {
    if (service === 'payment-service') message = 'PaymentService timeout after 5000ms';
    else if (service === 'inventory-service') message = 'Downstream InventoryService not responding';
    else message = `Failed to connect to dependency in ${service}`;
  } else if (level === 'WARN') {
    message = `Retry attempt ${Math.floor(Math.random() * 3) + 1} for upstream call`;
  }

  return {
    id: `log-${i}-${Date.now()}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    service,
    level,
    message,
    traceId: `trace-${Math.floor(Math.random() * 1000)}`,
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const api = {
  getLogs: async (query?: { service?: string; level?: LogLevel; search?: string }): Promise<LogEntry[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    let filtered = [...mockLogs];
    if (query?.service) filtered = filtered.filter((l) => l.service === query.service);
    if (query?.level) filtered = filtered.filter((l) => l.level === query.level);
    if (query?.search) {
      const search = query.search.toLowerCase();
      filtered = filtered.filter((l) => l.message.toLowerCase().includes(search));
    }
    return filtered;
  },

  getMetrics: async (): Promise<ServiceMetric[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockServices.map(service => {
      const generatePoints = (base: number, variance: number, isHigh: boolean = false) => {
        return Array.from({ length: 24 }).map((_, i) => ({
          timestamp: Date.now() - (24 - i) * 300000, // Every 5 mins
          value: Math.max(0, base + (Math.random() * variance * (isHigh ? 2 : 1)) - variance/2),
        }));
      };

      const isPayment = service === 'payment-service';
      return {
        service,
        cpu: generatePoints(40, 20, isPayment),
        memory: generatePoints(60, 10),
        latency: generatePoints(120, 50, isPayment),
        errorRate: generatePoints(isPayment ? 5 : 0.5, isPayment ? 3 : 1),
      };
    });
  },

  getTraces: async (): Promise<TraceSpan[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Generate a mock distributed trace with bottlenecks
    const traceId = 'trace-payment-flow-102';
    const baseTime = Date.now() - 60000;
    
    return [
      { id: 'span-1', traceId, parentId: null, name: 'POST /checkout', service: 'api-gateway', timestamp: baseTime, duration: 5200, status: 'ERROR', tags: { 'http.status_code': '504' } },
      { id: 'span-2', traceId, parentId: 'span-1', name: 'validate_token', service: 'auth-service', timestamp: baseTime + 10, duration: 15, status: 'OK', tags: {} },
      { id: 'span-3', traceId, parentId: 'span-1', name: 'process_payment', service: 'payment-service', timestamp: baseTime + 30, duration: 5100, status: 'ERROR', tags: { 'error.type': 'TimeoutException' } },
      { id: 'span-4', traceId, parentId: 'span-3', name: 'check_inventory', service: 'inventory-service', timestamp: baseTime + 50, duration: 50, status: 'OK', tags: {} },
      { id: 'span-5', traceId, parentId: 'span-3', name: 'charge_card', service: 'payment-service', timestamp: baseTime + 100, duration: 5000, status: 'ERROR', tags: { 'gateway': 'stripe' } },
    ];
  }
};
