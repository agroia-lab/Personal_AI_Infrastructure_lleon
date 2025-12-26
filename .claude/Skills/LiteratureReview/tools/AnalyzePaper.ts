#!/usr/bin/env node
/**
 * AnalyzePaper - Fetch paper metadata from PubMed and save to markdown
 *
 * Usage: npx tsx AnalyzePaper.ts --pmid <PMID>
 */

import { parseArgs } from 'node:util';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

interface PubMedMetadata {
  pmid: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  pubDate: string;
  doi?: string;
}

async function fetchPubMedMetadata(pmid: string): Promise<PubMedMetadata> {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PubMed data: ${response.statusText}`);
  }

  const xml = await response.text();

  // Basic XML parsing (simple regex-based for minimal implementation)
  const title = xml.match(/<ArticleTitle>(.*?)<\/ArticleTitle>/s)?.[1]?.trim() || 'Unknown Title';
  const abstract = xml.match(/<AbstractText[^>]*>(.*?)<\/AbstractText>/s)?.[1]?.trim() || 'No abstract available';
  const journal = xml.match(/<Title>(.*?)<\/Title>/)?.[1]?.trim() || 'Unknown Journal';
  const pubDate = xml.match(/<PubDate>.*?<Year>(.*?)<\/Year>/s)?.[1]?.trim() || 'Unknown';
  const doi = xml.match(/<ArticleId IdType="doi">(.*?)<\/ArticleId>/)?.[1]?.trim();

  // Extract authors
  const authorMatches = xml.matchAll(/<Author[^>]*>.*?<LastName>(.*?)<\/LastName>.*?<ForeName>(.*?)<\/ForeName>.*?<\/Author>/gs);
  const authors: string[] = [];
  for (const match of authorMatches) {
    authors.push(`${match[1]} ${match[2]}`);
  }

  return {
    pmid,
    title,
    authors,
    abstract,
    journal,
    pubDate,
    doi
  };
}

function generateMarkdown(metadata: PubMedMetadata): string {
  const { pmid, title, authors, abstract, journal, pubDate, doi } = metadata;

  return `# ${title}

## Metadata

- **PMID**: ${pmid}
- **Journal**: ${journal}
- **Publication Date**: ${pubDate}
- **Authors**: ${authors.join(', ')}
${doi ? `- **DOI**: ${doi}` : ''}

## Abstract

${abstract}

---

*Fetched from PubMed on ${new Date().toISOString().split('T')[0]}*
`;
}

async function main() {
  // Parse arguments
  const { values } = parseArgs({
    options: {
      pmid: {
        type: 'string',
        short: 'p',
      },
    },
  });

  const pmid = values.pmid;

  if (!pmid) {
    console.error('Error: --pmid argument is required');
    console.log('Usage: npx tsx AnalyzePaper.ts --pmid <PMID>');
    process.exit(1);
  }

  console.log(`Fetching metadata for PMID: ${pmid}...`);

  try {
    // Fetch metadata
    const metadata = await fetchPubMedMetadata(pmid);

    console.log(`Title: ${metadata.title}`);
    console.log(`Authors: ${metadata.authors.slice(0, 3).join(', ')}${metadata.authors.length > 3 ? ' et al.' : ''}`);

    // Generate markdown
    const markdown = generateMarkdown(metadata);

    // Save to file (find project root by looking for .claude directory)
    let projectRoot = resolve(process.cwd());
    while (!existsSync(join(projectRoot, '.claude')) && projectRoot !== '/') {
      projectRoot = resolve(projectRoot, '..');
    }

    const outputDir = join(projectRoot, 'History', 'Papers', '2025-12');
    mkdirSync(outputDir, { recursive: true });

    const filename = `PMID_${pmid}.md`;
    const filepath = join(outputDir, filename);

    writeFileSync(filepath, markdown, 'utf-8');

    console.log(`\n✓ Paper metadata saved to: ${filepath}`);

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
