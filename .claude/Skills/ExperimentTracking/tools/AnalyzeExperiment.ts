#!/usr/bin/env bun

/**
 * AnalyzeExperiment - Basic statistical analysis of experiment data
 *
 * Usage:
 *   bunx AnalyzeExperiment.ts --data "path/to/data.csv" --experiment-id "EXP-2025-01-001"
 *
 * This tool performs basic statistical analysis and creates reports in History/DataAnalyses/
 */

import { parseArgs } from "util";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

interface AnalysisResult {
  columnName: string;
  mean: number;
  stdDev: number;
  count: number;
}

async function main() {
  // Parse command line arguments
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      data: { type: "string", short: "d" },
      "experiment-id": { type: "string", short: "i" },
      help: { type: "boolean" },
    },
  });

  if (values.help) {
    console.log(`
AnalyzeExperiment - Basic statistical analysis of experiment data

Usage:
  bunx AnalyzeExperiment.ts [options]

Required Options:
  -d, --data <string>            Path to CSV data file
  -i, --experiment-id <string>   Experiment ID (e.g., EXP-2025-01-001)

Optional Options:
  --help                         Show this help message

Example:
  bunx AnalyzeExperiment.ts \\
    --data "~/data/enzyme_assay.csv" \\
    --experiment-id "EXP-2025-01-001"
    `);
    process.exit(0);
  }

  // Validate required arguments
  if (!values.data || !values["experiment-id"]) {
    console.error("Error: --data and --experiment-id are required");
    console.error("Run with --help for usage information");
    process.exit(1);
  }

  const dataPath = values.data as string;
  const experimentId = values["experiment-id"] as string;

  // Check if file exists
  if (!existsSync(dataPath)) {
    console.error(`Error: Data file not found at ${dataPath}`);
    process.exit(1);
  }

  console.log(`📊 Reading data from: ${dataPath}`);
  console.log(`🔬 Experiment ID: ${experimentId}`);

  // Read CSV file (first 10 rows for now)
  const csvContent = await readFile(dataPath, "utf-8");
  const lines = csvContent.split("\n").filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    console.error("Error: CSV file must have at least a header row and one data row");
    process.exit(1);
  }

  // Parse header
  const headers = lines[0].split(",").map((h) => h.trim());
  console.log(`📝 Found columns: ${headers.join(", ")}`);

  // Parse data (first 10 rows max)
  const dataRows = lines.slice(1, Math.min(11, lines.length));
  console.log(`📈 Analyzing ${dataRows.length} rows (first 10 for stub version)`);

  // Calculate statistics for numeric columns
  const results: AnalysisResult[] = [];

  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const values: number[] = [];

    for (const row of dataRows) {
      const cells = row.split(",");
      const value = parseFloat(cells[colIndex]?.trim() || "");

      if (!isNaN(value)) {
        values.push(value);
      }
    }

    // Only calculate stats for columns with numeric data
    if (values.length > 0) {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance =
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        values.length;
      const stdDev = Math.sqrt(variance);

      results.push({
        columnName: headers[colIndex],
        mean,
        stdDev,
        count: values.length,
      });
    }
  }

  // Generate markdown report
  const markdown = generateMarkdown(experimentId, dataPath, results, dataRows.length);

  // Determine save location
  const paiDir = process.env.PAI_DIR || join(homedir(), ".claude");
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T").join("-").split("Z")[0];
  const yearMonth = dateStr.substring(0, 7); // YYYY-MM
  const historyDir = join(paiDir, "History", "DataAnalyses", yearMonth);

  // Create directory if it doesn't exist
  if (!existsSync(historyDir)) {
    await mkdir(historyDir, { recursive: true });
    console.log(`Created directory: ${historyDir}`);
  }

  // Write to file
  const filename = `${timestamp}_${experimentId}_Analysis.md`;
  const filepath = join(historyDir, filename);
  await writeFile(filepath, markdown, "utf-8");

  console.log(`\n✅ Analysis complete!`);
  console.log(`📄 Report saved to: ${filepath}`);

  // Return JSON output for programmatic use
  return {
    success: true,
    filepath,
    experimentId,
    timestamp: now.toISOString(),
    results,
  };
}

function generateMarkdown(
  experimentId: string,
  dataPath: string,
  results: AnalysisResult[],
  rowsAnalyzed: number
): string {
  let md = `# Data Analysis: ${experimentId}\n\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Data Source:** \`${dataPath}\`\n`;
  md += `**Rows Analyzed:** ${rowsAnalyzed} (stub version - first 10 rows only)\n\n`;

  md += `## Statistical Summary\n\n`;

  if (results.length === 0) {
    md += `*No numeric columns found in the data.*\n\n`;
  } else {
    md += `| Column | Mean | Std Dev | N |\n`;
    md += `|--------|------|---------|---|\n`;

    for (const result of results) {
      md += `| ${result.columnName} | ${result.mean.toFixed(4)} | ${result.stdDev.toFixed(4)} | ${result.count} |\n`;
    }

    md += `\n`;
  }

  md += `## Notes\n\n`;
  md += `- This is a stub version that only analyzes the first 10 rows of data\n`;
  md += `- Full statistical analysis will be implemented in a future version\n`;
  md += `- Consider adding: correlation analysis, hypothesis testing, visualizations\n\n`;

  md += `---\n`;
  md += `*Generated by ExperimentTracking skill - AnalyzeExperiment tool (stub version)*\n`;

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
