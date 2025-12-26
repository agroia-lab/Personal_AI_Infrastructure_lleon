#!/usr/bin/env node

/**
 * GenerateCitation - Fetch paper metadata from PubMed and generate citations
 *
 * Usage: node GenerateCitation.ts --pmid <PMID> --style <style>
 */

interface PubMedAuthor {
  name: string;
}

interface PubMedMetadata {
  title: string;
  authors: PubMedAuthor[];
  journal: string;
  year: string;
}

/**
 * Parse command-line arguments
 */
function parseArgs(): { pmid: string; style: string } {
  const args = process.argv.slice(2);
  let pmid = '';
  let style = 'nature';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pmid' && args[i + 1]) {
      pmid = args[i + 1];
      i++;
    } else if (args[i] === '--style' && args[i + 1]) {
      style = args[i + 1];
      i++;
    }
  }

  if (!pmid) {
    console.error('Error: --pmid argument is required');
    console.error('Usage: node GenerateCitation.ts --pmid <PMID> [--style <style>]');
    process.exit(1);
  }

  return { pmid, style };
}

/**
 * Fetch metadata from PubMed E-utilities API
 */
async function fetchPubMedMetadata(pmid: string): Promise<PubMedMetadata> {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`PubMed API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.result[pmid];

    if (!result) {
      throw new Error(`No data found for PMID: ${pmid}`);
    }

    // Extract authors
    const authors = result.authors?.map((author: any) => ({
      name: author.name || ''
    })) || [];

    return {
      title: result.title || 'Unknown title',
      authors,
      journal: result.fulljournalname || result.source || 'Unknown journal',
      year: result.pubdate?.split(' ')[0] || 'Unknown year'
    };
  } catch (error) {
    throw new Error(`Failed to fetch metadata: ${(error as Error).message}`);
  }
}

/**
 * Format citation in Nature style
 * Format: "FirstAuthor et al. Journal (year)."
 */
function formatNatureStyle(metadata: PubMedMetadata): string {
  const { authors, journal, year } = metadata;

  if (authors.length === 0) {
    return `Unknown author. ${journal} (${year}).`;
  }

  const firstAuthor = authors[0].name.split(',')[0]; // Get last name
  const citation = `${firstAuthor} et al. ${journal} (${year}).`;

  return citation;
}

/**
 * Format citation based on style
 */
function formatCitation(metadata: PubMedMetadata, style: string): string {
  switch (style.toLowerCase()) {
    case 'nature':
      return formatNatureStyle(metadata);
    default:
      console.error(`Warning: Style '${style}' not supported yet, using Nature style`);
      return formatNatureStyle(metadata);
  }
}

/**
 * Main function
 */
async function main() {
  const { pmid, style } = parseArgs();

  console.log(`Fetching metadata for PMID: ${pmid}...`);

  try {
    const metadata = await fetchPubMedMetadata(pmid);
    const citation = formatCitation(metadata, style);

    console.log('\nCitation:');
    console.log(citation);

    // Also print metadata for debugging
    console.log('\nMetadata:');
    console.log(`Title: ${metadata.title}`);
    console.log(`Authors: ${metadata.authors.map(a => a.name).join(', ')}`);
    console.log(`Journal: ${metadata.journal}`);
    console.log(`Year: ${metadata.year}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
