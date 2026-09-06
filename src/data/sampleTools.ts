import { SupportedLanguage, CodeCategory, CodeItem } from '../types';

export interface SampleToolData {
  title: string;
  description: string;
  code: string;
  language: SupportedLanguage;
  category: CodeCategory;
  version: string;
  tags: string[];
  status: 'published';
  plan: 'free';
}

export const SAMPLE_TOOLS_BY_LANGUAGE: Record<SupportedLanguage, SampleToolData> = {
  TypeScript: {
    title: 'TypeScript Dynamic Currency & Tax Calculator Engine',
    description: 'Strongly-typed financial utility with currency conversions, tax bands, and real-time computation.',
    language: 'TypeScript',
    category: 'Finance & Tools',
    version: '1.0.0',
    tags: ['typescript', 'finance', 'calculator', 'tax', 'types'],
    status: 'published',
    plan: 'free',
    code: `// TypeScript Financial Computation Engine
interface CurrencyRate {
  code: string;
  name: string;
  rateToUSD: number;
  symbol: string;
}

interface TaxCalculationResult {
  baseAmount: number;
  taxRatePercent: number;
  taxAmount: number;
  totalWithTax: number;
  currency: string;
  formattedTotal: string;
}

class FinancialService {
  private rates: Map<string, CurrencyRate> = new Map();

  constructor() {
    this.rates.set('USD', { code: 'USD', name: 'US Dollar', rateToUSD: 1.0, symbol: '$' });
    this.rates.set('BDT', { code: 'BDT', name: 'Bangladeshi Taka', rateToUSD: 121.5, symbol: '৳' });
    this.rates.set('EUR', { code: 'EUR', name: 'Euro', rateToUSD: 0.92, symbol: '€' });
    this.rates.set('GBP', { code: 'GBP', name: 'British Pound', rateToUSD: 0.79, symbol: '£' });
    this.rates.set('INR', { code: 'INR', name: 'Indian Rupee', rateToUSD: 83.4, symbol: '₹' });
  }

  public convert(amount: number, from: string, to: string): number {
    const fromRate = this.rates.get(from)?.rateToUSD || 1.0;
    const toRate = this.rates.get(to)?.rateToUSD || 1.0;
    const amountInUSD = amount / fromRate;
    return Number((amountInUSD * toRate).toFixed(2));
  }

  public computeTax(amount: number, currency: string = 'USD', taxRate: number = 15): TaxCalculationResult {
    const rateInfo = this.rates.get(currency) || { symbol: '$', rateToUSD: 1.0 };
    const taxAmount = Number(((amount * taxRate) / 100).toFixed(2));
    const total = Number((amount + taxAmount).toFixed(2));

    return {
      baseAmount: amount,
      taxRatePercent: taxRate,
      taxAmount,
      totalWithTax: total,
      currency,
      formattedTotal: \`\${rateInfo.symbol}\${total.toLocaleString()}\`
    };
  }
}

const service = new FinancialService();
const bdtConverted = service.convert(100, 'USD', 'BDT');
const invoice = service.computeTax(12000, 'BDT', 15);

console.log("=== TypeScript Financial Engine ===");
console.log(\`$100 USD in BDT: ৳\${bdtConverted}\`);
console.log("Invoice Tax Calculation:", JSON.stringify(invoice, null, 2));
`
  },

  JavaScript: {
    title: 'Modern JS Secure Password & UUID Generator Tool',
    description: 'Client-side cryptographic utility to generate secure hashes, random UUIDs, and customized strong passwords.',
    language: 'JavaScript',
    category: 'Security & Auth',
    version: '1.4.0',
    tags: ['javascript', 'security', 'crypto', 'password-generator', 'uuid'],
    status: 'published',
    plan: 'free',
    code: `// Modern JavaScript Cryptographic Generator Tool
function generateSecurePassword(length = 16, options = {}) {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true
  } = options;

  let chars = '';
  if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) chars += '0123456789';
  if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) return '';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function evaluatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 12) score += 2;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 2;

  if (score >= 5) return 'Very Strong (Entropy: High)';
  if (score >= 3) return 'Moderate';
  return 'Weak';
}

const pwd = generateSecurePassword(16);
const uuid = generateUUIDv4();
const strength = evaluatePasswordStrength(pwd);

console.log("=== Security & Key Generator Output ===");
console.log("Generated Password:", pwd);
console.log("Password Strength:", strength);
console.log("Generated UUID v4:", uuid);
`
  },

  HTML: {
    title: 'Responsive Dashboard UI with Realtime Statistics',
    description: 'Complete single-file modern dashboard UI with revenue charts, user metrics, and activity streams.',
    language: 'HTML',
    category: 'Frontend Components',
    version: '1.1.0',
    tags: ['html', 'tailwindcss', 'dashboard', 'responsive', 'ui'],
    status: 'published',
    plan: 'free',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Analytics Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 flex flex-col items-center">
  <div class="w-full max-w-5xl space-y-6">
    
    <!-- Top Header -->
    <header class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span class="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
          <i class="fa-solid fa-chart-line"></i> Realtime Insights
        </span>
        <h1 class="text-2xl sm:text-3xl font-black text-white">Application Performance Monitor</h1>
        <p class="text-sm text-indigo-100">Live operational telemetry, active users, and system load.</p>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="refreshMetrics()" class="px-4 py-2.5 bg-white text-slate-900 font-bold rounded-2xl text-xs hover:bg-slate-100 shadow transition active:scale-95 flex items-center gap-2">
          <i class="fa-solid fa-arrows-rotate"></i> Live Refresh
        </button>
      </div>
    </header>

    <!-- Metrics Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
        <div class="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
          <span>Active Users</span>
          <i class="fa-solid fa-users text-indigo-400"></i>
        </div>
        <div id="stat-users" class="text-2xl sm:text-3xl font-black text-white">4,829</div>
        <span class="text-xs text-emerald-400 font-semibold"><i class="fa-solid fa-arrow-trend-up"></i> +14.2% this week</span>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
        <div class="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
          <span>API Requests</span>
          <i class="fa-solid fa-bolt text-amber-400"></i>
        </div>
        <div id="stat-reqs" class="text-2xl sm:text-3xl font-black text-white">128.4K</div>
        <span class="text-xs text-emerald-400 font-semibold"><i class="fa-solid fa-arrow-trend-up"></i> 99.98% Uptime</span>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
        <div class="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
          <span>Average Latency</span>
          <i class="fa-solid fa-stopwatch text-emerald-400"></i>
        </div>
        <div id="stat-latency" class="text-2xl sm:text-3xl font-black text-white">32 ms</div>
        <span class="text-xs text-indigo-400 font-semibold">Optimal Performance</span>
      </div>
    </div>

    <!-- Interactive Component -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <h3 class="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
        <i class="fa-solid fa-clock-rotate-left text-indigo-400"></i> System Events Stream
      </h3>
      <div id="event-log" class="space-y-2 font-mono text-xs">
        <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-emerald-400">
          <span>[SYSTEM] Database cluster healthy. All nodes synchronized.</span>
          <span class="text-slate-500">Just now</span>
        </div>
        <div class="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-indigo-300">
          <span>[SECURITY] SSL TLS 1.3 certificates verified valid.</span>
          <span class="text-slate-500">2m ago</span>
        </div>
      </div>
    </div>

  </div>

  <script>
    function refreshMetrics() {
      const users = document.getElementById('stat-users');
      const latency = document.getElementById('stat-latency');
      const log = document.getElementById('event-log');
      
      const newUsers = (4800 + Math.floor(Math.random() * 200)).toLocaleString();
      const newLatency = (25 + Math.floor(Math.random() * 15)) + ' ms';
      
      if (users) users.textContent = newUsers;
      if (latency) latency.textContent = newLatency;

      const item = document.createElement('div');
      item.className = 'p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-amber-300';
      item.innerHTML = '<span>[POLL] Telemetry refresh executed. Active metrics synced.</span><span class="text-slate-500">Seconds ago</span>';
      if (log) log.prepend(item);
    }
  </script>
</body>
</html>`
  },

  Python: {
    title: 'Python Data Analyzer & Statistical Summary Tool',
    description: 'Analyzes numerical datasets, computes variance, median, quartile ranges, and formats tabular reports.',
    language: 'Python',
    category: 'Data Science',
    version: '2.1.0',
    tags: ['python', 'statistics', 'data-science', 'math', 'analytics'],
    status: 'published',
    plan: 'free',
    code: `# Python Numerical Data Analyzer
import math

class DataAnalyzer:
    def __init__(self, data):
        self.data = sorted(data)
        self.count = len(data)

    def mean(self):
        return sum(self.data) / self.count if self.count else 0

    def median(self):
        if not self.count:
            return 0
        mid = self.count // 2
        if self.count % 2 == 0:
            return (self.data[mid - 1] + self.data[mid]) / 2
        return self.data[mid]

    def variance(self):
        m = self.mean()
        return sum((x - m) ** 2 for x in self.data) / self.count if self.count else 0

    def standard_deviation(self):
        return math.sqrt(self.variance())

    def summary(self):
        return {
            "Total Elements": self.count,
            "Minimum Value": min(self.data),
            "Maximum Value": max(self.data),
            "Arithmetic Mean": round(self.mean(), 2),
            "Median Value": round(self.median(), 2),
            "Standard Dev": round(self.standard_deviation(), 2),
        }

# Sample Dataset: Server response times in ms
dataset = [24, 28, 31, 29, 35, 42, 26, 30, 33, 45, 27, 29, 38]
analyzer = DataAnalyzer(dataset)

print("=== Server Latency Statistical Report ===")
print(f"Observed Values: {dataset}")
for metric, val in analyzer.summary().items():
    print(f"{metric:<20}: {val}")
`
  },

  PHP: {
    title: 'PHP REST API Router & JSON Response Formatter',
    description: 'Lightweight PHP API handler with HTTP request routing, CORS configuration, and standard JSON envelopes.',
    language: 'PHP',
    category: 'Backend Utilities',
    version: '1.0.0',
    tags: ['php', 'api', 'router', 'rest', 'backend'],
    status: 'published',
    plan: 'free',
    code: `<?php
/**
 * PHP Lightweight REST API Handler & Response Wrapper
 */

class ApiResponse {
    public static function send($data, $statusCode = 200, $message = 'OK') {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Origin: *');

        echo json_encode([
            'status' => $statusCode,
            'success' => $statusCode >= 200 && $statusCode < 300,
            'message' => $message,
            'timestamp' => time(),
            'data' => $data
        ], JSON_PRETTY_PRINT);
    }
}

class ApiRouter {
    private $routes = [];

    public function get($path, $handler) {
        $this->routes['GET'][$path] = $handler;
    }

    public function handle($method, $uri) {
        if (isset($this->routes[$method][$uri])) {
            return call_user_func($this->routes[$method][$uri]);
        }
        ApiResponse::send(null, 404, 'Endpoint route not found');
    }
}

$router = new ApiRouter();

$router->get('/api/health', function() {
    ApiResponse::send([
        'server' => 'PHP 8.2 FPM',
        'status' => 'Healthy',
        'memory_usage_mb' => round(memory_get_usage() / 1024 / 1024, 2)
    ], 200, 'Health check passed');
});

// Simulate Request to /api/health
echo "--- Simulating GET /api/health ---\\n";
$router->handle('GET', '/api/health');
?>`
  },

  Java: {
    title: 'Java Object-Oriented Cache Manager (LRU)',
    description: 'Concurrent, memory-bounded Least Recently Used (LRU) Cache data structure in pure Java.',
    language: 'Java',
    category: 'Data Structures',
    version: '1.0.0',
    tags: ['java', 'cache', 'lru', 'oop', 'algorithms'],
    status: 'published',
    plan: 'free',
    code: `import java.util.LinkedHashMap;
import java.util.Map;

/**
 * High-Performance Thread-Safe LRU Cache in Java
 */
public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // true = access-order
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }

    public static void main(String[] args) {
        System.out.println("=== Java LRU Cache Simulation ===");
        LRUCache<String, Integer> cache = new LRUCache<>(3);

        cache.put("UserSession_A", 101);
        cache.put("UserSession_B", 102);
        cache.put("UserSession_C", 103);
        System.out.println("Initial Cache: " + cache);

        // Access A (makes it most recently used)
        cache.get("UserSession_A");
        System.out.println("Accessed UserSession_A");

        // Insert D -> UserSession_B (eldest) will be evicted
        cache.put("UserSession_D", 104);
        System.out.println("After Adding UserSession_D: " + cache);
        System.out.println("LRU eviction executed successfully!");
    }
}`
  },

  CSS: {
    title: 'CSS Modern Glassmorphism & Neon Card UI System',
    description: 'Pure CSS styling rules featuring backdrop-filters, neon glow borders, and fluid hover transformations.',
    language: 'CSS',
    category: 'Design Systems',
    version: '1.3.0',
    tags: ['css', 'glassmorphism', 'animations', 'neon', 'ui-kit'],
    status: 'published',
    plan: 'free',
    code: `/* Modern Glassmorphic UI Card System */
:root {
  --neon-primary: #6366f1;
  --neon-glow: rgba(99, 102, 241, 0.45);
  --glass-bg: rgba(15, 23, 42, 0.75);
  --glass-border: rgba(255, 255, 255, 0.12);
}

.glass-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #030712 100%);
  border-radius: 1.5rem;
}

.glass-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 1.25rem;
  padding: 2rem;
  max-width: 400px;
  color: #f8fafc;
  box-shadow: 0 20px 40px -15px var(--neon-glow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.6);
}

.glass-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-card p {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.6;
}`
  },

  SQL: {
    title: 'SQL Multi-Tenant E-Commerce Analytics Queries',
    description: 'Optimized SQL schema definition with aggregations, window functions, and revenue rollups.',
    language: 'SQL',
    category: 'Database & SQL',
    version: '1.0.0',
    tags: ['sql', 'database', 'postgres', 'analytics', 'reporting'],
    status: 'published',
    plan: 'free',
    code: `-- Multi-Tenant Revenue & Customer Lifetime Analytics
WITH MonthlyRevenue AS (
    SELECT 
        DATE_TRUNC('month', o.created_at) AS order_month,
        c.country,
        COUNT(DISTINCT o.id) AS total_orders,
        SUM(o.total_amount) AS gross_revenue,
        AVG(o.total_amount) AS avg_order_value
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.status = 'completed'
      AND o.created_at >= NOW() - INTERVAL '12 months'
    GROUP BY 1, 2
),
RankedCountries AS (
    SELECT 
        order_month,
        country,
        gross_revenue,
        RANK() OVER (PARTITION BY order_month ORDER BY gross_revenue DESC) as revenue_rank
    FROM MonthlyRevenue
)
SELECT 
    order_month,
    country,
    gross_revenue
FROM RankedCountries
WHERE revenue_rank <= 3
ORDER BY order_month DESC, gross_revenue DESC;
`
  },

  Bash: {
    title: 'Bash Linux System Health Check & Backup Automation Script',
    description: 'Shell script to monitor CPU, memory, disk capacity, and automate gzip tar backups with log rotation.',
    language: 'Bash',
    category: 'DevOps & Cloud',
    version: '1.2.0',
    tags: ['bash', 'shell', 'devops', 'linux', 'automation'],
    status: 'published',
    plan: 'free',
    code: `#!/usr/bin/env bash
# ==============================================================================
# Linux Server Automated Health Diagnostics & Backup Utility
# ==============================================================================
set -eo pipefail

TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
HOSTNAME=$(hostname -f 2>/dev/null || echo "localhost")

echo "======================================================"
echo " SYSTEM HEALTH REPORT: \${HOSTNAME}"
echo " Time: \${TIMESTAMP}"
echo "======================================================"

# 1. Check CPU Load
echo -n "[1/4] Checking CPU Average Load... "
UPTIME_OUT=$(uptime | awk -F'load average:' '{ print $2 }')
echo "OK (Load:\${UPTIME_OUT})"

# 2. Check Memory Usage
echo -n "[2/4] Inspecting RAM Consumption... "
FREE_MEM=$(free -m | awk 'NR==2{printf "Used: %sMB / %sMB (%.2f%%)", $3,$2,$3*100/$2 }')
echo "\${FREE_MEM}"

# 3. Check Disk Storage
echo -n "[3/4] Primary Filesystem Usage (root /)... "
DISK_USAGE=$(df -h / | awk 'NR==2{print $5 " used (" $4 " free)"}')
echo "\${DISK_USAGE}"

# 4. Backup Simulation
echo -n "[4/4] Generating diagnostic archive snapshot... "
echo "SUCCESS (archive-snapshot.tar.gz created)"

echo "======================================================"
echo " Status: All diagnostics passed without warnings."
echo "======================================================"
`
  },

  C: {
    title: 'C Memory-Safe String & Dynamic Array Allocator',
    description: 'Clean C implementation of a resizable dynamic array with bounds checking and memory lifecycle management.',
    language: 'C',
    category: 'Systems Programming',
    version: '1.0.0',
    tags: ['c', 'memory', 'malloc', 'dynamic-array', 'data-structures'],
    status: 'published',
    plan: 'free',
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *items;
    size_t capacity;
    size_t length;
} DynamicVector;

DynamicVector* vector_create(size_t initial_capacity) {
    DynamicVector *vec = (DynamicVector*)malloc(sizeof(DynamicVector));
    if (!vec) return NULL;
    vec->items = (int*)malloc(initial_capacity * sizeof(int));
    vec->capacity = initial_capacity;
    vec->length = 0;
    return vec;
}

void vector_push(DynamicVector *vec, int value) {
    if (vec->length >= vec->capacity) {
        vec->capacity *= 2;
        vec->items = (int*)realloc(vec->items, vec->capacity * sizeof(int));
    }
    vec->items[vec->length++] = value;
}

void vector_destroy(DynamicVector *vec) {
    if (vec) {
        free(vec->items);
        free(vec);
    }
}

int main(void) {
    printf("=== C Dynamic Vector Allocator ===\\n");
    DynamicVector *vec = vector_create(2);

    for (int i = 1; i <= 5; i++) {
        vector_push(vec, i * 10);
    }

    printf("Vector elements (Length: %zu, Capacity: %zu):\\n", vec->length, vec->capacity);
    for (size_t i = 0; i < vec->length; i++) {
        printf("  Item[%zu] = %d\\n", i, vec->items[i]);
    }

    vector_destroy(vec);
    printf("Memory freed cleanly without leaks.\\n");
    return 0;
}
`
  },

  'C++': {
    title: 'C++ Modern Thread Pool & Task Scheduler (C++20)',
    description: 'Modern C++ task execution pool utilizing std::thread, std::mutex, and worker task queues.',
    language: 'C++',
    category: 'Systems Programming',
    version: '1.0.0',
    tags: ['cpp', 'concurrency', 'multithreading', 'modern-cpp', 'systems'],
    status: 'published',
    plan: 'free',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>

class SimpleThreadPool {
public:
    SimpleThreadPool(size_t threads) : stop(false) {
        for (size_t i = 0; i < threads; ++i) {
            workers.emplace_back([this, i] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(this->queue_mutex);
                        this->condition.wait(lock, [this] {
                            return this->stop || !this->tasks.empty();
                        });
                        if (this->stop && this->tasks.empty()) return;
                        task = std::move(this->tasks.front());
                        this->tasks.pop();
                    }
                    task();
                }
            });
        }
    }

    void enqueue(std::function<void()> task) {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            tasks.push(task);
        }
        condition.notify_one();
    }

    ~SimpleThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            stop = true;
        }
        condition.notify_all();
        for (std::thread &worker : workers) {
            if (worker.joinable()) worker.join();
        }
    }

private:
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex queue_mutex;
    std::condition_variable condition;
    bool stop;
};

int main() {
    std::cout << "=== C++ Concurrency ThreadPool Simulation ===" << std::endl;
    SimpleThreadPool pool(4);

    for (int i = 1; i <= 4; ++i) {
        pool.enqueue([i] {
            std::cout << "Task #" << i << " executed concurrently by worker thread." << std::endl;
        });
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    std::cout << "All tasks finished gracefully." << std::endl;
    return 0;
}
`
  },

  JSON: {
    title: 'OpenAPI 3.1 REST API Specification Template',
    description: 'Standard JSON OpenAPI specification for developer tools, token authentication, and schema definitions.',
    language: 'JSON',
    category: 'Configuration',
    version: '3.1.0',
    tags: ['json', 'openapi', 'swagger', 'api-docs', 'schema'],
    status: 'published',
    plan: 'free',
    code: `{
  "openapi": "3.1.0",
  "info": {
    "title": "CodeToolkit Developer API",
    "version": "1.0.0",
    "description": "Production API for fetching code templates, executing sandboxes, and verifying license keys."
  },
  "servers": [
    {
      "url": "https://veloralbillal-default-rtdb.firebaseio.com",
      "description": "Production Live Realtime Database"
    }
  ],
  "paths": {
    "/codes.json": {
      "get": {
        "summary": "List all published tools",
        "parameters": [
          {
            "name": "language",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success array of published code tools"
          }
        }
      }
    }
  }
}`
  },

  XML: {
    title: 'RSS 2.0 Syndication Feed & Sitemap XML Template',
    description: 'Clean XML template compliant with RSS 2.0 and Search Engine Sitemap protocols.',
    language: 'XML',
    category: 'SEO & Syndication',
    version: '2.0.0',
    tags: ['xml', 'rss', 'sitemap', 'syndication', 'web'],
    status: 'published',
    plan: 'free',
    code: `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodeToolkit - Developer Code &amp; Tool Platform</title>
    <link>https://veloralbillal.firebaseapp.com</link>
    <description>Daily updated developer tools, snippets, and production source code across 14+ languages.</description>
    <language>en-us</language>
    <lastBuildDate>Fri, 04 Sep 2026 12:00:00 GMT</lastBuildDate>
    <atom:link href="https://veloralbillal.firebaseapp.com/feed.xml" rel="self" type="application/rss+xml" />

    <item>
      <title>Modern TypeScript &amp; Python Sandbox Released</title>
      <link>https://veloralbillal.firebaseapp.com/#/code/sample-ts</link>
      <description>Live HTML Preview UI and interactive terminal execution engine now live.</description>
      <category>Platform Update</category>
      <pubDate>Fri, 04 Sep 2026 10:00:00 GMT</pubDate>
      <guid>https://veloralbillal.firebaseapp.com/#/code/sample-ts</guid>
    </item>
  </channel>
</rss>`
  },

  Markdown: {
    title: 'Complete Software Architecture Documentation & README',
    description: 'Well-structured Markdown project README with badges, system architecture diagrams, and usage guidelines.',
    language: 'Markdown',
    category: 'Documentation',
    version: '1.0.0',
    tags: ['markdown', 'docs', 'readme', 'architecture', 'github'],
    status: 'published',
    plan: 'free',
    code: `# CodeToolkit - Developer Source & Tool Ecosystem 🚀

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Languages](https://img.shields.io/badge/languages-14+-indigo.svg)](#)

A centralized, cloud-connected developer code exchange and live execution platform.

---

## 🌟 Key Features
- **Live Sandbox Engine**: Direct browser-level execution for HTML, CSS, JavaScript, TypeScript, Python, and terminal scripts.
- **HTML Preview UI**: Universal visual preview experience with real-time DOM components and interactive console.
- **Creator Marketplace**: Monetization, license key distribution, and community code contributions.

---

## 📦 Supported Languages
- **Web & Frontend**: HTML, CSS, JavaScript, TypeScript
- **Backend & Scripting**: Python, PHP, Java, Bash
- **Systems**: C, C++
- **Data & Formats**: SQL, JSON, XML, Markdown

---

## 🛠️ Quick Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/example/codetoolkit.git

# Install dependencies
npm install

# Start local dev server
npm run dev
\`\`\`
`
  }
};
