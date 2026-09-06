import React, { useState, useEffect, useCallback } from 'react';
import { connectionPool } from '../../services/connectionPool';
import { PoolMetrics, PoolLogEntry } from '../../services/pool/connectionPoolTypes';
import { PoolHealthHeader } from './pool/PoolHealthHeader';
import { PoolMetricsGauges } from './pool/PoolMetricsGauges';
import { PoolActivityLogger } from './pool/PoolActivityLogger';
import { PoolSpikeTester } from './pool/PoolSpikeTester';
import { DatabaseIndexesList } from './pool/DatabaseIndexesList';
import { PoolArchitectureExplainer } from './pool/PoolArchitectureExplainer';
import { RulesExporterCard } from './pool/RulesExporterCard';

export const AdminConnectionPoolManager: React.FC = () => {
  const [metrics, setMetrics] = useState<PoolMetrics>(() => connectionPool.getMetrics());
  const [logs, setLogs] = useState<PoolLogEntry[]>(() => connectionPool.getEventLogs());
  const [activePaths, setActivePaths] = useState<string[]>(() => connectionPool.getActiveChannelPaths());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refreshAll = useCallback(() => {
    setMetrics(connectionPool.getMetrics());
    setLogs(connectionPool.getEventLogs());
    setActivePaths(connectionPool.getActiveChannelPaths());
  }, []);

  useEffect(() => {
    refreshAll();
    if (!autoRefresh) return;
    const interval = setInterval(refreshAll, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshAll]);

  return (
    <div className="space-y-5">
      {/* 1. Cluster Health & Status Control Header */}
      <PoolHealthHeader
        onRefresh={refreshAll}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
      />

      {/* 2. Real-time Metrics & Utilization Gauges */}
      <PoolMetricsGauges metrics={metrics} />

      {/* 3. Live Socket Channels & Event Activity Stream */}
      <PoolActivityLogger logs={logs} activePaths={activePaths} />

      {/* 4. High-Concurrency Spike & Crash Stress Testing Lab */}
      <PoolSpikeTester />

      {/* 5. Database .indexOn Registry (O(log N) Query Velocity) */}
      <DatabaseIndexesList />

      {/* 6. Architecture Comparison & Quota Protection Guide */}
      <PoolArchitectureExplainer />

      {/* 7. Compiled Firebase JSON Rules Exporter */}
      <RulesExporterCard />
    </div>
  );
};
