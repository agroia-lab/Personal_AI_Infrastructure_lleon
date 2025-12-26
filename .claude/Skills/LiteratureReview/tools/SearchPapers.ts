#!/usr/bin/env bun

/**
 * SearchPapers - Search scientific literature databases
 *
 * Usage:
 *   bunx SearchPapers.ts --query "CRISPR gene editing" --databases "pubmed,arxiv" --year-from "2023"
 *
 * This tool searches multiple scientific databases and returns relevant papers
 */

import { parseArgs } from "util";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

interface Paper {
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  doi?: string;
  arxivId?: string;
  abstract?: string;
  url: string;
  source: string;
  relevanceScore?: number;
}

interface SearchResult {
  query: string;
  databases: string[];
  totalResults: number;
  papers: Paper[];
  timestamp: string;
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      query: { type: "string", short: "q" },
      databases: { type: "string", short: "d" },
      "year-from": { type: "string" },
      "year-to": { type: "string" },
      "max-results": { type: "string", short: "n" },
      "study-type": { type: "string" },
      output: { type: "string", short: "o" },
      help: { type: "boolean" },
    },
  });

  if (values.help) {
    console.log(`
SearchPapers - Search scientific literature databases

Usage:
  bunx SearchPapers.ts [options]

Required Options:
  -q, --query <string>           Search query (keywords, phrases)

Optional Options:
  -d, --databases <string>       Comma-separated databases (default: "pubmed,arxiv")
                                 Options: pubmed, arxiv, scholar, biorxiv
  --year-from <string>           Minimum publication year (e.g., "2020")
  --year-to <string>             Maximum publication year (e.g., "2024")
  -n, --max-results <number>     Maximum results to return (default: 50)
  --study-type <string>          Filter by study type (e.g., "review", "clinical trial")
  -o, --output <path>            Save results to file (default: History/Research/)
  --help                         Show this help message

Databases:
  pubmed    - PubMed/PMC (biomedical literature)
  arxiv     - arXiv (preprints across sciences)
  scholar   - Google Scholar (broad academic search)
  biorxiv   - bioRxiv (biology preprints)

Examples:
  # Basic search
  bunx SearchPapers.ts --query "CRISPR gene editing plants"

  # Search with date filter
  bunx SearchPapers.ts --query "phage therapy" --year-from "2023"

  # Multiple databases
  bunx SearchPapers.ts --query "protein folding" --databases "pubmed,arxiv,biorxiv"

  # Limit results
  bunx SearchPapers.ts --query "machine learning drug discovery" --max-results 20
    `);
    process.exit(0);
  }

  if (!values.query) {
    console.error("Error: --query is required");
    console.error("Run with --help for usage information");
    process.exit(1);
  }

  const query = values.query as string;
  const databases = (values.databases as string || "pubmed,arxiv").split(",");
  const yearFrom = values["year-from"] ? parseInt(values["year-from"] as string) : undefined;
  const yearTo = values["year-to"] ? parseInt(values["year-to"] as string) : undefined;
  const maxResults = parseInt(values["max-results"] as string || "50");
  const studyType = values["study-type"] as string | undefined;

  console.log(`🔍 Searching for: "${query}"`);
  console.log(`📚 Databases: ${databases.join(", ")}`);
  if (yearFrom) console.log(`📅 From year: ${yearFrom}`);
  if (yearTo) console.log(`📅 To year: ${yearTo}`);
  console.log(`📊 Max results: ${maxResults}`);
  console.log("");

  const papers: Paper[] = [];

  // Search each database
  for (const db of databases) {
    console.log(`Searching ${db}...`);
    const dbResults = await searchDatabase(db, query, { yearFrom, yearTo, maxResults: Math.floor(maxResults / databases.length), studyType });
    papers.push(...dbResults);
    console.log(`  Found ${dbResults.length} results from ${db}`);
  }

  // Sort by relevance score (if available) or year
  papers.sort((a, b) => {
    if (a.relevanceScore !== undefined && b.relevanceScore !== undefined) {
      return b.relevanceScore - a.relevanceScore;
    }
    return b.year - a.year;
  });

  // Limit to max results
  const limitedPapers = papers.slice(0, maxResults);

  const result: SearchResult = {
    query,
    databases,
    totalResults: limitedPapers.length,
    papers: limitedPapers,
    timestamp: new Date().toISOString(),
  };

  // Display results
  console.log(`\n✅ Found ${result.totalResults} papers:\n`);
  limitedPapers.forEach((paper, index) => {
    console.log(`${index + 1}. ${paper.title}`);
    console.log(`   ${paper.authors.slice(0, 3).join(", ")}${paper.authors.length > 3 ? " et al." : ""}`);
    console.log(`   ${paper.journal || paper.source} (${paper.year})`);
    if (paper.doi) console.log(`   DOI: ${paper.doi}`);
    if (paper.arxivId) console.log(`   arXiv: ${paper.arxivId}`);
    console.log(`   ${paper.url}`);
    console.log("");
  });

  // Save results
  const paiDir = process.env.PAI_DIR || join(homedir(), ".claude");
  const now = new Date();
  const yearMonth = now.toISOString().substring(0, 7);
  const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T").join("-").split("Z")[0];
  const outputDir = values.output ? values.output as string : join(paiDir, "History", "Research", yearMonth);

  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  const sanitizedQuery = query.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
  const outputFile = join(outputDir, `${timestamp}_Literature_Search_${sanitizedQuery}.md`);
  const markdown = generateMarkdown(result);
  await writeFile(outputFile, markdown, "utf-8");

  console.log(`💾 Results saved to: ${outputFile}`);

  return result;
}

async function searchDatabase(
  database: string,
  query: string,
  options: { yearFrom?: number; yearTo?: number; maxResults?: number; studyType?: string }
): Promise<Paper[]> {
  const mockPapers: Paper[] = [];

  switch (database.toLowerCase()) {
    case "pubmed":
      return await searchPubMed(query, options);

    case "arxiv":
      return await searchArXiv(query, options);

    case "scholar":
      // Mock Google Scholar results
      mockPapers.push({
        title: `${query} in Modern Research`,
        authors: ["Williams, M.", "Davis, S.", "Wilson, T."],
        year: 2023,
        journal: "Science",
        doi: "10.1126/science.abc1234",
        url: "https://scholar.google.com/scholar?q=...",
        source: "Google Scholar",
        relevanceScore: 0.82,
      });
      break;

    case "biorxiv":
      // Mock bioRxiv results
      mockPapers.push({
        title: `Experimental Evidence for ${query}`,
        authors: ["Taylor, A.", "Martinez, C."],
        year: 2024,
        doi: "10.1101/2024.01.01.123456",
        url: "https://www.biorxiv.org/content/10.1101/2024.01.01.123456v1",
        source: "bioRxiv",
        abstract: `Mock bioRxiv preprint. Real implementation would fetch from bioRxiv API.`,
        relevanceScore: 0.76,
      });
      break;
  }

  // Apply filters
  let filteredPapers = mockPapers;
  if (options.yearFrom) {
    filteredPapers = filteredPapers.filter((p) => p.year >= options.yearFrom!);
  }
  if (options.yearTo) {
    filteredPapers = filteredPapers.filter((p) => p.year <= options.yearTo!);
  }

  return filteredPapers;
}

async function searchPubMed(
  query: string,
  options: { yearFrom?: number; yearTo?: number; maxResults?: number; studyType?: string }
): Promise<Paper[]> {
  try {
    // Build date range filter if provided
    let dateFilter = "";
    if (options.yearFrom || options.yearTo) {
      const minYear = options.yearFrom || 1900;
      const maxYear = options.yearTo || new Date().getFullYear();
      dateFilter = `+AND+${minYear}:${maxYear}[pdat]`;
    }

    // Step 1: Search for PMIDs using esearch
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}${dateFilter}&retmax=5&retmode=xml`;

    const searchResponse = await fetch(searchUrl);
    const searchXml = await searchResponse.text();

    // Extract PMIDs from XML
    const pmidMatches = searchXml.match(/<Id>(\d+)<\/Id>/g);
    if (!pmidMatches || pmidMatches.length === 0) {
      return [];
    }

    const pmids = pmidMatches.map(match => match.replace(/<\/?Id>/g, ""));

    // Step 2: Fetch titles using esummary
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(",")}&retmode=xml`;

    const summaryResponse = await fetch(summaryUrl);
    const summaryXml = await summaryResponse.text();

    // Parse titles and years from XML
    const papers: Paper[] = [];
    const docSummaries = summaryXml.split("<DocSum>");

    for (let i = 1; i < docSummaries.length; i++) {
      const doc = docSummaries[i];

      // Extract PMID
      const pmidMatch = doc.match(/<Id>(\d+)<\/Id>/);
      const pmid = pmidMatch ? pmidMatch[1] : "";

      // Extract title
      const titleMatch = doc.match(/<Item Name="Title"[^>]*>(.*?)<\/Item>/);
      const title = titleMatch ? titleMatch[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") : "No title available";

      // Extract year
      const yearMatch = doc.match(/<Item Name="PubDate"[^>]*>(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();

      papers.push({
        title: title,
        authors: ["Authors not fetched yet"],
        year: year,
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}`,
        source: "PubMed",
      });
    }

    return papers;
  } catch (error) {
    console.error(`Error searching PubMed: ${error}`);
    return [];
  }
}

async function searchArXiv(
  query: string,
  options: { yearFrom?: number; yearTo?: number; maxResults?: number; studyType?: string }
): Promise<Paper[]> {
  try {
    // arXiv API query
    const searchUrl = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5&sortBy=relevance&sortOrder=descending`;

    const response = await fetch(searchUrl);
    const xml = await response.text();

    // Parse entries from XML
    const papers: Paper[] = [];
    const entries = xml.split("<entry>");

    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i];

      // Extract title
      const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
      const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : "No title available";

      // Extract authors
      const authorMatches = entry.match(/<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g);
      const authors = authorMatches
        ? authorMatches.map(a => {
            const nameMatch = a.match(/<name>(.*?)<\/name>/);
            return nameMatch ? nameMatch[1].trim() : "";
          }).filter(a => a)
        : ["Unknown"];

      // Extract published date and year
      const publishedMatch = entry.match(/<published>(\d{4})-\d{2}-\d{2}/);
      const year = publishedMatch ? parseInt(publishedMatch[1]) : new Date().getFullYear();

      // Apply year filter if provided
      if (options.yearFrom && year < options.yearFrom) continue;
      if (options.yearTo && year > options.yearTo) continue;

      // Extract arXiv ID
      const idMatch = entry.match(/<id>http:\/\/arxiv\.org\/abs\/(.*?)<\/id>/);
      const arxivId = idMatch ? idMatch[1].trim() : "";

      // Extract abstract
      const abstractMatch = entry.match(/<summary>(.*?)<\/summary>/s);
      const abstract = abstractMatch ? abstractMatch[1].trim().replace(/\s+/g, " ") : undefined;

      papers.push({
        title: title,
        authors: authors,
        year: year,
        arxivId: arxivId,
        url: `https://arxiv.org/abs/${arxivId}`,
        source: "arXiv",
        abstract: abstract,
      });
    }

    return papers;
  } catch (error: any) {
    console.error(`Error searching arXiv: ${error.message || error}`);
    return [];
  }
}

function generateMarkdown(result: SearchResult): string {
  let md = `# Literature Search Results\n\n`;
  md += `**Query:** ${result.query}\n`;
  md += `**Databases:** ${result.databases.join(", ")}\n`;
  md += `**Search Date:** ${new Date(result.timestamp).toLocaleDateString()}\n`;
  md += `**Total Results:** ${result.totalResults}\n\n`;

  md += `## Papers Found\n\n`;

  result.papers.forEach((paper, index) => {
    md += `### ${index + 1}. ${paper.title}\n\n`;
    md += `**Authors:** ${paper.authors.join(", ")}\n\n`;
    md += `**Year:** ${paper.year}\n\n`;
    if (paper.journal) {
      md += `**Journal:** ${paper.journal}\n\n`;
    }
    if (paper.doi) {
      md += `**DOI:** ${paper.doi}\n\n`;
    }
    if (paper.arxivId) {
      md += `**arXiv ID:** ${paper.arxivId}\n\n`;
    }
    md += `**URL:** ${paper.url}\n\n`;
    md += `**Source:** ${paper.source}\n\n`;
    if (paper.abstract) {
      md += `**Abstract:**\n${paper.abstract}\n\n`;
    }
    if (paper.relevanceScore) {
      md += `**Relevance Score:** ${(paper.relevanceScore * 100).toFixed(1)}%\n\n`;
    }
    md += `---\n\n`;
  });

  md += `## Next Steps\n\n`;
  md += `- [ ] Review abstracts and select papers for deep analysis\n`;
  md += `- [ ] Use AnalyzePaper tool for detailed paper analysis\n`;
  md += `- [ ] Add relevant papers to lab knowledge base\n`;
  md += `- [ ] Consider comparative analysis using ComparePapers tool\n\n`;

  md += `---\n`;
  md += `*Generated by LiteratureReview skill - SearchPapers tool*\n`;
  md += `*Note: This is a demonstration tool. For production use, integrate with actual APIs (PubMed E-utilities, arXiv API, etc.)*\n`;

  return md;
}

main()
  .then((result) => {
    if (result) {
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
