#!/usr/bin/env bun
/**
 * Experiment Complete Notification Hook
 *
 * Triggers when experiment analysis completes to:
 * 1. Notify team via voice/visual
 * 2. Update lab dashboard
 * 3. Generate quick summary
 * 4. Suggest next steps
 *
 * Hook Type: PostToolUse
 * Triggers when: ExperimentTracking skill completes analysis workflow
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

async function main() {
  try {
    // Read event data from stdin
    const stdinData = readFileSync(0, 'utf-8');
    if (!stdinData.trim()) {
      process.exit(0);
    }

    const event = JSON.parse(stdinData);
    const payload: HookPayload = event.payload || {};

    // Check if this is an experiment analysis completion
    const isExperimentAnalysis =
      payload.content?.includes('ExperimentTracking') ||
      payload.content?.includes('Analyze Results') ||
      payload.content?.includes('AnalyzeExperiment') ||
      (payload.result && payload.result.includes('experiment') && payload.result.includes('analysis'));

    if (!isExperimentAnalysis) {
      // Not an experiment analysis, exit silently
      process.exit(0);
    }

    const paiDir = process.env.PAI_DIR || join(homedir(), '.claude');
    const now = new Date();
    const timestamp = now.toISOString().split('.')[0].replace(/[:-]/g, '').replace('T', '-');

    console.log('🧪 Experiment analysis completed! Processing results...');

    // 1. Extract experiment ID if available
    const expIdMatch = payload.result?.match(/EXP-\d{4}-\d{2}-\d{3}/);
    const experimentId = expIdMatch ? expIdMatch[0] : 'Unknown';

    // 2. Generate quick summary
    const summary = generateSummary(payload, experimentId);

    // 3. Save notification log
    const notificationLog = {
      timestamp: now.toISOString(),
      experimentId,
      summary,
      event: 'experiment_complete',
    };

    const logDir = join(paiDir, 'History', 'Experiments', 'Notifications');
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    const logFile = join(logDir, `${timestamp}_${experimentId}_Complete.json`);
    writeFileSync(logFile, JSON.stringify(notificationLog, null, 2));

    // 4. Voice notification (if voice server is running)
    try {
      const voicePort = process.env.VOICE_SERVER_PORT || '3000';
      const voiceMessage = `Experiment ${experimentId} analysis complete`;

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

    // 5. Output user-visible summary
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🧬 EXPERIMENT ANALYSIS COMPLETE');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📋 Experiment: ${experimentId}`);
    console.log(`⏰ Completed: ${now.toLocaleString()}`);
    console.log(``);
    console.log(`📊 Summary:`);
    console.log(summary);
    console.log(``);
    console.log(`💾 Notification saved to:`);
    console.log(`   ${logFile}`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');

    // 6. Suggest next steps
    console.log('💡 Suggested Next Steps:');
    console.log('   • Review analysis report in History/DataAnalyses/');
    console.log('   • Compare to similar experiments using CompareExperiments tool');
    console.log('   • Share findings with lab using lab-share command');
    console.log('   • Draft methods section with ScientificWriter agent');
    console.log('');

  } catch (error) {
    // Hook errors should not block the main process
    console.error('Hook error (non-fatal):', error);
  }

  process.exit(0);
}

function generateSummary(payload: HookPayload, experimentId: string): string {
  // Extract key information from the result
  const result = payload.result || '';

  // Try to extract statistical results
  const pValueMatch = result.match(/p\s*[=<]\s*0?\.\d+/);
  const effectSizeMatch = result.match(/(Cohen's d|eta-squared|r-squared)\s*[=:]\s*0?\.\d+/);
  const nMatch = result.match(/n\s*=\s*\d+/);

  let summary = `Experiment ${experimentId} analysis completed.\n`;

  if (pValueMatch) {
    summary += `   Statistical significance: ${pValueMatch[0]}\n`;
  }

  if (effectSizeMatch) {
    summary += `   Effect size: ${effectSizeMatch[0]}\n`;
  }

  if (nMatch) {
    summary += `   Sample size: ${nMatch[0]}\n`;
  }

  // Check for significance
  if (result.includes('significant') || (pValueMatch && parseFloat(pValueMatch[0].split(/[=<]/)[1]) < 0.05)) {
    summary += `   ✅ Result: Statistically significant effect detected\n`;
  } else if (result.includes('not significant') || result.includes('no effect')) {
    summary += `   ⚠️  Result: No statistically significant effect detected\n`;
  }

  return summary;
}

main();
