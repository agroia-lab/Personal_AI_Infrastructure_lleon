#!/usr/bin/env bun

/**
 * CompareExperiments - Compare hypothesis and results across multiple experiments
 *
 * Usage:
 *   bunx CompareExperiments.ts --experiments "EXP-2025-01-001,EXP-2025-01-002,EXP-2025-01-003"
 *
 * This tool loads experiment logs and creates a comparison table in History/DataAnalyses/
 */

import { parseArgs } from "util";
import { writeFile, mkdir, readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

interface ExperimentComparison {
  id: string;
  hypothesis: string;
  results: string;
  found: boolean;
}

async function main() {
  // Parse command line arguments
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      experiments: { type: "string", short: "e" },
      help: { type: "boolean" },
    },
  });

  if (values.help) {
    console.log(`
CompareExperiments - Compare hypothesis and results across multiple experiments

Usage:
  bunx CompareExperiments.ts [options]

Required Options:
  -e, --experiments <string>     Comma-separated experiment IDs (2-3 experiments)

Optional Options:
  --help                         Show this help message

Example:
  bunx CompareExperiments.ts \\
    --experiments "EXP-2025-01-001,EXP-2025-01-002,EXP-2025-01-003"
    `);
    process.exit(0);
  }

  // Validate required arguments
  if (!values.experiments) {
    console.error("Error: --experiments is required");
    console.error("Run with --help for usage information");
    process.exit(1);
  }

  const experimentIds = (values.experiments as string)
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (experimentIds.length < 2 || experimentIds.length > 3) {
    console.error("Error: Please provide 2-3 experiment IDs");
    process.exit(1);
  }

  console.log(`🔬 Comparing experiments: ${experimentIds.join(", ")}`);

  // Determine experiment logs directory
  const paiDir = process.env.PAI_DIR || join(homedir(), ".claude");
  const experimentsDir = join(paiDir, "History", "Experiments");

  if (!existsSync(experimentsDir)) {
    console.error(`Error: Experiments directory not found at ${experimentsDir}`);
    process.exit(1);
  }

  // Load experiment data
  const comparisons: ExperimentComparison[] = [];

  for (const expId of experimentIds) {
    console.log(`\n📖 Loading ${expId}...`);
    const comparison = await loadExperiment(experimentsDir, expId);
    comparisons.push(comparison);

    if (comparison.found) {
      console.log(`  ✓ Found experiment log`);
    } else {
      console.log(`  ✗ Experiment log not found`);
    }
  }

  // Generate comparison markdown
  const markdown = generateComparisonMarkdown(comparisons);

  // Determine save location
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T").join("-").split("Z")[0];
  const yearMonth = dateStr.substring(0, 7); // YYYY-MM
  const historyDir = join(paiDir, "History", "DataAnalyses", yearMonth);

  // Create directory if it doesn't exist
  if (!existsSync(historyDir)) {
    await mkdir(historyDir, { recursive: true });
    console.log(`\nCreated directory: ${historyDir}`);
  }

  // Write to file
  const filename = `${timestamp}_Comparison_${experimentIds.join("-")}.md`;
  const filepath = join(historyDir, filename);
  await writeFile(filepath, markdown, "utf-8");

  console.log(`\n✅ Comparison complete!`);
  console.log(`📄 Report saved to: ${filepath}`);

  // Return JSON output for programmatic use
  return {
    success: true,
    filepath,
    experimentIds,
    timestamp: now.toISOString(),
    comparisons: comparisons.map((c) => ({
      id: c.id,
      found: c.found,
    })),
  };
}

async function loadExperiment(
  experimentsDir: string,
  experimentId: string
): Promise<ExperimentComparison> {
  // Search for experiment log file
  // Assuming format: YYYY-MM/YYYY-MM-DD-HH-MM-SS_EXP-YYYY-MM-NNN.md
  const yearMonth = experimentId.match(/EXP-(\d{4}-\d{2})/)?.[1];

  if (!yearMonth) {
    return {
      id: experimentId,
      hypothesis: "*Experiment log not found*",
      results: "*Experiment log not found*",
      found: false,
    };
  }

  const monthDir = join(experimentsDir, yearMonth);

  if (!existsSync(monthDir)) {
    return {
      id: experimentId,
      hypothesis: "*Experiment log not found*",
      results: "*Experiment log not found*",
      found: false,
    };
  }

  // Find matching file
  const files = await readdir(monthDir);
  const matchingFile = files.find((file) => file.includes(experimentId));

  if (!matchingFile) {
    return {
      id: experimentId,
      hypothesis: "*Experiment log not found*",
      results: "*Experiment log not found*",
      found: false,
    };
  }

  // Read experiment log
  const filepath = join(monthDir, matchingFile);
  const content = await readFile(filepath, "utf-8");

  // Extract hypothesis and results sections (simple string matching)
  const hypothesis = extractSection(content, "## Hypothesis");
  const results = extractSection(content, "## Results");

  return {
    id: experimentId,
    hypothesis: hypothesis || "*No hypothesis section found*",
    results: results || "*No results section found*",
    found: true,
  };
}

function extractSection(content: string, sectionHeader: string): string | null {
  const lines = content.split("\n");
  const startIndex = lines.findIndex((line) => line.trim() === sectionHeader);

  if (startIndex === -1) {
    return null;
  }

  // Find next section header (starts with ##)
  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith("##")) {
      endIndex = i;
      break;
    }
  }

  // Extract section content (skip the header itself)
  const sectionLines = lines.slice(startIndex + 1, endIndex);

  // Trim empty lines from start and end
  while (sectionLines.length > 0 && sectionLines[0].trim() === "") {
    sectionLines.shift();
  }
  while (sectionLines.length > 0 && sectionLines[sectionLines.length - 1].trim() === "") {
    sectionLines.pop();
  }

  return sectionLines.join("\n").trim();
}

function generateComparisonMarkdown(comparisons: ExperimentComparison[]): string {
  let md = `# Experiment Comparison\n\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Experiments:** ${comparisons.map((c) => c.id).join(", ")}\n\n`;

  md += `## Comparison Table\n\n`;

  // Create table header
  md += `| Aspect | ${comparisons.map((c) => c.id).join(" | ")} |\n`;
  md += `|--------|${comparisons.map(() => "--------").join("|")}|\n`;

  // Hypothesis row
  md += `| **Hypothesis** | ${comparisons
    .map((c) => c.hypothesis.replace(/\n/g, " ").substring(0, 100) + "...")
    .join(" | ")} |\n`;

  // Results row
  md += `| **Results** | ${comparisons
    .map((c) => c.results.replace(/\n/g, " ").substring(0, 100) + "...")
    .join(" | ")} |\n`;

  md += `\n`;

  // Detailed sections
  md += `## Detailed Comparison\n\n`;

  for (const comparison of comparisons) {
    md += `### ${comparison.id}\n\n`;

    md += `#### Hypothesis\n`;
    md += `${comparison.hypothesis}\n\n`;

    md += `#### Results\n`;
    md += `${comparison.results}\n\n`;

    md += `---\n\n`;
  }

  md += `## Notes\n\n`;
  md += `- This is a stub version with simple text extraction\n`;
  md += `- Full comparison features will be implemented in a future version\n`;
  md += `- Consider adding: statistical comparisons, visualizations, success metrics\n\n`;

  md += `---\n`;
  md += `*Generated by ExperimentTracking skill - CompareExperiments tool (stub version)*\n`;

  return md;
}

// Run main function
main()
  .then((result) => {
    if (result) {
      console.log("\nJSON Output:");
      console.log(JSON.stringify(result, null, 2));
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
