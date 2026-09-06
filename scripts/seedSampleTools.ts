import { SAMPLE_TOOLS_BY_LANGUAGE } from '../src/data/sampleTools';
import https from 'https';

async function seedTools() {
  console.log('Fetching current RTDB codes...');
  const existingCodes: Record<string, any> = await new Promise((resolve) => {
    https.get('https://veloralbillal-default-rtdb.firebaseio.com/codes.json', (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw) || {});
        } catch {
          resolve({});
        }
      });
    });
  });

  const existingTitles = new Set(
    Object.values(existingCodes)
      .filter((c: any) => c && c.title)
      .map((c: any) => c.title)
  );

  const entries = Object.entries(SAMPLE_TOOLS_BY_LANGUAGE);
  console.log(`Found ${entries.length} sample tools to process across supported languages.`);

  let addedCount = 0;
  let skippedCount = 0;

  for (const [lang, tool] of entries) {
    if (existingTitles.has(tool.title)) {
      console.log(`[SKIP] Already exists: ${tool.title} (${lang})`);
      skippedCount++;
      continue;
    }

    const payload = JSON.stringify({
      title: tool.title,
      description: tool.description,
      code: tool.code,
      language: tool.language,
      category: tool.category,
      version: tool.version,
      tags: tool.tags,
      status: 'published',
      plan: 'free',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: 'system_admin',
      creatorEmail: 'admin@codetoolkit.com',
      creatorRole: 'admin',
      creatorVerified: true,
      creatorName: 'CodeToolkit Official',
      views: Math.floor(Math.random() * 20) + 5,
      runCount: Math.floor(Math.random() * 10) + 1,
      averageRating: 5
    });

    await new Promise<void>((resolve, reject) => {
      const req = https.request(
        'https://veloralbillal-default-rtdb.firebaseio.com/codes.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        },
        (res) => {
          if (res.statusCode === 200) {
            console.log(`[ADDED] ${tool.title} (${lang})`);
            addedCount++;
            resolve();
          } else {
            console.error(`[ERROR] ${res.statusCode} for ${lang}`);
            resolve();
          }
        }
      );
      req.on('error', (err) => {
        console.error(`Request error:`, err);
        resolve();
      });
      req.write(payload);
      req.end();
    });
  }

  console.log(`\n=== SEEDING COMPLETED ===`);
  console.log(`Added: ${addedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Total sample languages supported: ${entries.length}`);
}

seedTools();
