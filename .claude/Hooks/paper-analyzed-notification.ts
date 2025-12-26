#!/usr/bin/env bun
/**
 * Paper Analyzed Notification Hook
 *
 * Triggers when literature review/paper analysis completes to:
 * 1. Add paper to lab knowledge base index
 * 2. Generate quick summary for team
 * 3. Identify related lab work
 * 4. Suggest action items
 *
 * Hook Type: PostToolUse
 * Triggers when: LiteratureReview skill completes paper analysis
 */

import { readFileSync, appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface HookPayload {
  toolName: string;
  content: string;
  result?: string;
  metadata?: Record<string, any>;
}

interface PaperMetadata {
  title?: string;
  authors?: string[];
  journal?: string;
  year?: number;
  doi?: string;
  arxivId?: string;
  keyFindings?: string[];
  relevanceToLab?: string;
}

async function main() {
  try {
    // Read event data from stdin
    const stdinData = readFileSync(0, 'utf-8');
    if (!stdinData.trim()) {
      process.exit(0);
    }

    const event = JSON.parse(stdinData);
    const payload: HookPayload = event.payload || {};

    // Check if this is a paper analysis completion
    const isPaperAnalysis =
      payload.content?.includes('LiteratureReview') ||
      payload.content?.includes('Analyze Paper') ||
      payload.content?.includes('AnalyzePaper') ||
      (payload.result &&
        (payload.result.includes('paper analysis') || payload.result.includes('literature review')));

    if (!isPaperAnalysis) {
      // Not a paper analysis, exit silently
      process.exit(0);
    }

    const paiDir = process.env.PAI_DIR || join(homedir(), '.claude');
    const now = new Date();
    const timestamp = now.toISOString().split('.')[0].replace(/[:-]/g, '').replace('T', '-');

    console.log('📚 Paper analysis completed! Processing results...');

    // 1. Extract paper metadata
    const metadata = extractPaperMetadata(payload);

    // 2. Update knowledge base index
    await updateKnowledgeBaseIndex(paiDir, metadata, timestamp);

    // 3. Generate quick summary
    const summary = generatePaperSummary(metadata);

    // 4. Save notification log
    const notificationLog = {
      timestamp: now.toISOString(),
      paperTitle: metadata.title || 'Unknown',
      authors: metadata.authors || [],
      journal: metadata.journal,
      year: metadata.year,
      summary,
      event: 'paper_analyzed',
    };

    const logDir = join(paiDir, 'History', 'Papers', 'Notifications');
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    const sanitizedTitle = (metadata.title || 'paper')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    const logFile = join(logDir, `${timestamp}_${sanitizedTitle}_Analyzed.json`);
    writeFileSync(logFile, JSON.stringify(notificationLog, null, 2));

    // 5. Voice notification (if voice server is running)
    try {
      const voicePort = process.env.VOICE_SERVER_PORT || '3000';
      const firstAuthor = metadata.authors?.[0]?.split(',')[0] || 'paper';
      const voiceMessage = `Paper analysis complete for ${firstAuthor} ${metadata.year || ''}`;

      await fetch(`http://localhost:${voicePort}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: voiceMessage,
          rate: 280,
          voice_enabled: true,
        }),
      }).catch(() => {
        // Voice server not running, that's okay
      });
    } catch (e) {
      // Voice notification failed, continue silently
    }

    // 6. Output user-visible summary
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('📖 PAPER ANALYSIS COMPLETE');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📄 Title: ${metadata.title || 'Unknown'}`);
    if (metadata.authors && metadata.authors.length > 0) {
      const authorList = metadata.authors.slice(0, 3).join(', ');
      const suffix = metadata.authors.length > 3 ? ' et al.' : '';
      console.log(`👥 Authors: ${authorList}${suffix}`);
    }
    if (metadata.journal) {
      console.log(`📰 Journal: ${metadata.journal} (${metadata.year || 'n/a'})`);
    }
    if (metadata.doi) {
      console.log(`🔗 DOI: ${metadata.doi}`);
    }
    if (metadata.arxivId) {
      console.log(`🔗 arXiv: ${metadata.arxivId}`);
    }
    console.log(``);
    console.log(`📊 Summary:`);
    console.log(summary);
    console.log(``);
    console.log(`💾 Added to knowledge base index`);
    console.log(`   ${logFile}`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');

    // 7. Suggest next steps
    console.log('💡 Suggested Next Steps:');
    console.log('   • Review full analysis in History/Papers/');
    console.log('   • Search for related papers: SearchPapers tool');
    console.log('   • Compare to other studies: ComparePapers tool');
    console.log('   • Extract methods if replicating: Extract Methods workflow');
    console.log('   • Share with team: lab-share command');
    console.log('');

  } catch (error) {
    // Hook errors should not block the main process
    console.error('Hook error (non-fatal):', error);
  }

  process.exit(0);
}

function extractPaperMetadata(payload: HookPayload): PaperMetadata {
  const result = payload.result || '';
  const content = payload.content || '';
  const combined = result + ' ' + content;

  const metadata: PaperMetadata = {};

  // Extract title
  const titleMatch = combined.match(/(?:Title|title):\s*(.+?)(?:\n|$)/);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Extract authors
  const authorsMatch = combined.match(/(?:Authors|authors):\s*(.+?)(?:\n|$)/);
  if (authorsMatch) {
    metadata.authors = authorsMatch[1].split(/[,;&]/).map((a) => a.trim());
  }

  // Extract journal
  const journalMatch = combined.match(/(?:Journal|journal):\s*(.+?)(?:\n|$)/);
  if (journalMatch) {
    metadata.journal = journalMatch[1].trim();
  }

  // Extract year
  const yearMatch = combined.match(/(?:Year|year):\s*(\d{4})/);
  if (yearMatch) {
    metadata.year = parseInt(yearMatch[1]);
  }

  // Extract DOI
  const doiMatch = combined.match(/(?:DOI|doi):\s*([^\s\n]+)/);
  if (doiMatch) {
    metadata.doi = doiMatch[1].trim();
  }

  // Extract arXiv ID
  const arxivMatch = combined.match(/(?:arXiv|arxiv):\s*([^\s\n]+)/);
  if (arxivMatch) {
    metadata.arxivId = arxivMatch[1].trim();
  }

  // Extract key findings (simple approach)
  const findingsMatches = combined.match(/(?:Finding|Result|Conclusion)s?:\s*(.+?)(?:\n|$)/gi);
  if (findingsMatches) {
    metadata.keyFindings = findingsMatches.map((f) => f.split(':')[1].trim()).slice(0, 3);
  }

  // Extract relevance
  const relevanceMatch = combined.match(/(?:Relevance|Relation|Implication).*?:\s*(.+?)(?:\n|$)/i);
  if (relevanceMatch) {
    metadata.relevanceToLab = relevanceMatch[1].trim();
  }

  return metadata;
}

async function updateKnowledgeBaseIndex(paiDir: string, metadata: PaperMetadata, timestamp: string) {
  // Update a simple index file that tracks all analyzed papers
  const indexFile = join(paiDir, 'History', 'Papers', 'paper_index.jsonl');

  const indexEntry = {
    timestamp,
    title: metadata.title,
    authors: metadata.authors,
    journal: metadata.journal,
    year: metadata.year,
    doi: metadata.doi,
    arxivId: metadata.arxivId,
    relevance: metadata.relevanceToLab,
  };

  try {
    appendFileSync(indexFile, JSON.stringify(indexEntry) + '\n');
  } catch (e) {
    // Index update failed, continue
  }
}

function generatePaperSummary(metadata: PaperMetadata): string {
  let summary = '';

  if (metadata.keyFindings && metadata.keyFindings.length > 0) {
    summary += 'Key findings:\n';
    metadata.keyFindings.forEach((finding, i) => {
      summary += `   ${i + 1}. ${finding}\n`;
    });
  }

  if (metadata.relevanceToLab) {
    summary += `\n   Relevance to lab: ${metadata.relevanceToLab}\n`;
  }

  if (!summary) {
    summary = '   Paper analysis completed. Review full report in History/Papers/\n';
  }

  return summary;
}

main();
