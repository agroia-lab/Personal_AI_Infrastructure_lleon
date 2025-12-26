#!/usr/bin/env bun

/**
 * ComparePapers - Compare titles and authors across multiple papers
 *
 * Usage:
 *   bunx ComparePapers.ts --papers "12345678,87654321,11223344"
 *
 * This tool loads paper metadata and creates a comparison table in History/Research/
 */

import { parseArgs } from "util";
import { writeFile, mkdir, readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

interface PaperComparison {
  pmid: string;
  title: string;
  authors: string[];
  found: boolean;
}

async function main() {
  // Parse command line arguments
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      papers: { type: "string", short: "p" },
      help: { type: "boolean" },
    },
  });

  if (values.help) {
    console.log(`
ComparePapers - Compare titles and authors across multiple papers

Usage:
  bunx ComparePapers.ts [options]

Required Options:
  -p, --papers <string>          Comma-separated PMIDs (2-3 papers)

Optional Options:
  --help                         Show this help message

Example:
  bunx ComparePapers.ts --papers "12345678,87654321,11223344"
    `);
    process.exit(0);
  }

  // Validate required arguments
  if (!values.papers) {
    console.error("Error: --papers is required");
    console.error("Run with --help for usage information");
    process.exit(1);
  }

  const pmids = (values.papers as string)
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  if (pmids.length < 2 || pmids.length > 3) {
    console.error("Error: Please provide 2-3 PMIDs");
    process.exit(1);
  }

  console.log(`📚 Comparing papers: ${pmids.join(", ")}`);

  // Determine papers directory
  const paiDir = process.env.PAI_DIR || join(homedir(), ".claude");
  const papersDir = join(paiDir, "History", "Papers");

  if (!existsSync(papersDir)) {
    console.error(`Error: Papers directory not found at ${papersDir}`);
    console.error(`Note: This is a stub tool - paper files should be in History/Papers/`);
    process.exit(1);
  }

  // Load paper data
  const comparisons: PaperComparison[] = [];

  for (const pmid of pmids) {
    console.log(`\n📖 Loading PMID ${pmid}...`);
    const comparison = await loadPaper(papersDir, pmid);
    comparisons.push(comparison);

    if (comparison.found) {
      console.log(`  ✓ Found paper: ${comparison.title.substring(0, 60)}...`);
    } else {
      console.log(`  ✗ Paper not found`);
    }
  }

  // Generate comparison markdown
  const markdown = generateComparisonMarkdown(comparisons);

  // Determine save location
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T").join("-").split("Z")[0];
  const yearMonth = dateStr.substring(0, 7); // YYYY-MM
  const researchDir = join(paiDir, "History", "Research", yearMonth);

  // Create directory if it doesn't exist
  if (!existsSync(researchDir)) {
    await mkdir(researchDir, { recursive: true });
    console.log(`\nCreated directory: ${researchDir}`);
  }

  // Write to file
  const filename = `${timestamp}_Paper_Comparison_${pmids.join("-")}.md`;
  const filepath = join(researchDir, filename);
  await writeFile(filepath, markdown, "utf-8");

  console.log(`\n✅ Comparison complete!`);
  console.log(`📄 Report saved to: ${filepath}`);

  // Return JSON output for programmatic use
  return {
    success: true,
    filepath,
    pmids,
    timestamp: now.toISOString(),
    comparisons: comparisons.map((c) => ({
      pmid: c.pmid,
      found: c.found,
    })),
  };
}

async function loadPaper(
  papersDir: string,
  pmid: string
): Promise<PaperComparison> {
  // Search for paper file
  // Expected formats: PMID_12345678.json, PMID_12345678.md, or files containing the PMID

  try {
    const files = await readdir(papersDir);
    const matchingFile = files.find((file) =>
      file.includes(pmid) && (file.endsWith(".json") || file.endsWith(".md"))
    );

    if (!matchingFile) {
      return {
        pmid,
        title: "*Paper not found*",
        authors: [],
        found: false,
      };
    }

    // Read paper file
    const filepath = join(papersDir, matchingFile);
    const content = await readFile(filepath, "utf-8");

    // Try to parse as JSON first
    if (matchingFile.endsWith(".json")) {
      try {
        const paperData = JSON.parse(content);
        return {
          pmid,
          title: paperData.title || "*No title found*",
          authors: paperData.authors || [],
          found: true,
        };
      } catch {
        // If JSON parsing fails, fall through to markdown parsing
      }
    }

    // Parse markdown format
    const title = extractTitle(content);
    const authors = extractAuthors(content);

    return {
      pmid,
      title: title || "*No title found*",
      authors: authors || [],
      found: true,
    };
  } catch (error) {
    return {
      pmid,
      title: "*Error loading paper*",
      authors: [],
      found: false,
    };
  }
}

function extractTitle(content: string): string | null {
  // Look for title in markdown (# Title or **Title:** patterns)
  const lines = content.split("\n");

  // Try to find # Title (main heading)
  for (const line of lines) {
    if (line.trim().startsWith("# ") && !line.includes("Paper") && !line.includes("Analysis")) {
      return line.trim().substring(2).trim();
    }
  }

  // Try to find **Title:** pattern
  const titleMatch = content.match(/\*\*Title:\*\*\s*(.+?)(?:\n|$)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  // Try to find Title: pattern
  const titleMatch2 = content.match(/^Title:\s*(.+?)(?:\n|$)/mi);
  if (titleMatch2) {
    return titleMatch2[1].trim();
  }

  return null;
}

function extractAuthors(content: string): string[] {
  // Look for authors in markdown
  const authorMatch = content.match(/\*\*Authors?:\*\*\s*(.+?)(?:\n|$)/i);
  if (authorMatch) {
    const authorsStr = authorMatch[1].trim();
    // Split by comma, semicolon, or "and"
    return authorsStr
      .split(/[,;]|\s+and\s+/)
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
  }

  // Try without bold
  const authorMatch2 = content.match(/^Authors?:\s*(.+?)(?:\n|$)/mi);
  if (authorMatch2) {
    const authorsStr = authorMatch2[1].trim();
    return authorsStr
      .split(/[,;]|\s+and\s+/)
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
  }

  return [];
}

function generateComparisonMarkdown(comparisons: PaperComparison[]): string {
  let md = `# Paper Comparison\n\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**PMIDs:** ${comparisons.map((c) => c.pmid).join(", ")}\n\n`;

  md += `## Comparison Table\n\n`;

  // Create table header
  md += `| Aspect | ${comparisons.map((c) => `PMID ${c.pmid}`).join(" | ")} |\n`;
  md += `|--------|${comparisons.map(() => "--------").join("|")}|\n`;

  // Title row
  md += `| **Title** | ${comparisons
    .map((c) => c.title.replace(/\|/g, "\\|").substring(0, 80) + (c.title.length > 80 ? "..." : ""))
    .join(" | ")} |\n`;

  // Authors row
  md += `| **Authors** | ${comparisons
    .map((c) => {
      if (c.authors.length === 0) return "*No authors found*";
      const authorsStr = c.authors.slice(0, 3).join(", ");
      return c.authors.length > 3 ? authorsStr + " et al." : authorsStr;
    })
    .join(" | ")} |\n`;

  md += `\n`;

  // Detailed sections
  md += `## Detailed Information\n\n`;

  for (const comparison of comparisons) {
    md += `### PMID ${comparison.pmid}\n\n`;

    md += `**Title:** ${comparison.title}\n\n`;

    if (comparison.authors.length > 0) {
      md += `**Authors:**\n`;
      comparison.authors.forEach((author) => {
        md += `- ${author}\n`;
      });
      md += `\n`;
    } else {
      md += `**Authors:** *No authors found*\n\n`;
    }

    md += `---\n\n`;
  }

  md += `## Notes\n\n`;
  md += `- This is a stub version with basic metadata extraction\n`;
  md += `- Full comparison features will be implemented in a future version\n`;
  md += `- Consider adding: abstracts, methods, results, conclusions\n\n`;

  md += `---\n`;
  md += `*Generated by LiteratureReview skill - ComparePapers tool (stub version)*\n`;

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
