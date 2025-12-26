#!/usr/bin/env bun

/**
 * LogExperiment - Record experiment details to structured storage
 *
 * Usage:
 *   bunx LogExperiment.ts --id "EXP-2025-01-001" --researcher "Name" --hypothesis "..." --data-path "~/data/file.csv"
 *
 * This tool creates structured experiment log entries in History/Experiments/
 */

import { parseArgs } from "util";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve, join } from "path";
import { homedir } from "os";

interface ExperimentLog {
  id: string;
  date: string;
  researcher: string;
  hypothesis: string;
  design?: {
    independentVariable?: string;
    dependentVariable?: string;
    controls?: string;
    replicates?: number;
  };
  materials?: string[];
  procedure?: string;
  observations?: string[];
  dataPath?: string;
  analysisPath?: string;
  resultsSummary?: string;
  nextSteps?: string[];
}

async function main() {
  // Parse command line arguments
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      id: { type: "string", short: "i" },
      researcher: { type: "string", short: "r" },
      hypothesis: { type: "string", short: "h" },
      "data-path": { type: "string", short: "d" },
      "independent-var": { type: "string" },
      "dependent-var": { type: "string" },
      controls: { type: "string" },
      replicates: { type: "string" },
      materials: { type: "string", multiple: true },
      observations: { type: "string", multiple: true },
      "results-summary": { type: "string" },
      help: { type: "boolean" },
    },
  });

  if (values.help) {
    console.log(`
LogExperiment - Record experiment details to structured storage

Usage:
  bunx LogExperiment.ts [options]

Required Options:
  -i, --id <string>              Experiment ID (e.g., EXP-2025-01-001)
  -r, --researcher <string>      Researcher name
  -h, --hypothesis <string>      Hypothesis statement

Optional Options:
  -d, --data-path <string>       Path to raw data file
  --independent-var <string>     Independent variable description
  --dependent-var <string>       Dependent variable description
  --controls <string>            Control conditions
  --replicates <number>          Number of replicates
  --materials <string>           Materials used (can specify multiple times)
  --observations <string>        Observations (can specify multiple times)
  --results-summary <string>     Brief results summary
  --help                         Show this help message

Example:
  bunx LogExperiment.ts \\
    --id "EXP-2025-01-001" \\
    --researcher "Dr. Smith" \\
    --hypothesis "Temperature affects enzyme activity" \\
    --data-path "~/data/enzyme_assay.csv" \\
    --independent-var "Temperature (20°C, 30°C, 40°C)" \\
    --dependent-var "Enzyme activity (μmol/min)" \\
    --replicates 5
    `);
    process.exit(0);
  }

  // Validate required arguments
  if (!values.id || !values.researcher || !values.hypothesis) {
    console.error("Error: --id, --researcher, and --hypothesis are required");
    console.error("Run with --help for usage information");
    process.exit(1);
  }

  // Build experiment log object
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T").join("-").split("Z")[0];

  const experimentLog: ExperimentLog = {
    id: values.id as string,
    date: dateStr,
    researcher: values.researcher as string,
    hypothesis: values.hypothesis as string,
  };

  // Add optional design parameters
  if (
    values["independent-var"] ||
    values["dependent-var"] ||
    values.controls ||
    values.replicates
  ) {
    experimentLog.design = {
      independentVariable: values["independent-var"] as string,
      dependentVariable: values["dependent-var"] as string,
      controls: values.controls as string,
      replicates: values.replicates ? parseInt(values.replicates as string) : undefined,
    };
  }

  // Add materials
  if (values.materials && Array.isArray(values.materials)) {
    experimentLog.materials = values.materials as string[];
  }

  // Add observations
  if (values.observations && Array.isArray(values.observations)) {
    experimentLog.observations = values.observations as string[];
  }

  // Add data path
  if (values["data-path"]) {
    experimentLog.dataPath = values["data-path"] as string;
  }

  // Add results summary
  if (values["results-summary"]) {
    experimentLog.resultsSummary = values["results-summary"] as string;
  }

  // Generate markdown document
  const markdown = generateMarkdown(experimentLog);

  // Determine save location
  const paiDir = process.env.PAI_DIR || join(homedir(), ".claude");
  const yearMonth = dateStr.substring(0, 7); // YYYY-MM
  const historyDir = join(paiDir, "History", "Experiments", yearMonth);

  // Create directory if it doesn't exist
  if (!existsSync(historyDir)) {
    await mkdir(historyDir, { recursive: true });
    console.log(`Created directory: ${historyDir}`);
  }

  // Write to file
  const filename = `${timestamp}_${values.id}_Log.md`;
  const filepath = join(historyDir, filename);
  await writeFile(filepath, markdown, "utf-8");

  console.log(`✅ Experiment log saved successfully!`);
  console.log(`📄 Location: ${filepath}`);
  console.log(`🔬 Experiment ID: ${values.id}`);
  console.log(`👤 Researcher: ${values.researcher}`);

  // Return JSON output for programmatic use
  return {
    success: true,
    filepath,
    experimentId: values.id,
    timestamp: now.toISOString(),
  };
}

function generateMarkdown(log: ExperimentLog): string {
  let md = `# Experiment: ${log.id}\n\n`;
  md += `**Date:** ${log.date}\n`;
  md += `**Researcher:** ${log.researcher}\n`;
  md += `**Hypothesis:** ${log.hypothesis}\n\n`;

  if (log.design) {
    md += `## Experimental Design\n`;
    if (log.design.independentVariable) {
      md += `- **Independent Variable:** ${log.design.independentVariable}\n`;
    }
    if (log.design.dependentVariable) {
      md += `- **Dependent Variable:** ${log.design.dependentVariable}\n`;
    }
    if (log.design.controls) {
      md += `- **Controls:** ${log.design.controls}\n`;
    }
    if (log.design.replicates) {
      md += `- **Replicates:** ${log.design.replicates}\n`;
    }
    md += `\n`;
  }

  if (log.materials && log.materials.length > 0) {
    md += `## Materials\n`;
    log.materials.forEach((material) => {
      md += `- ${material}\n`;
    });
    md += `\n`;
  }

  md += `## Procedure\n`;
  md += `[Protocol reference or step-by-step instructions]\n\n`;

  if (log.observations && log.observations.length > 0) {
    md += `## Observations\n`;
    log.observations.forEach((obs) => {
      md += `- ${obs}\n`;
    });
    md += `\n`;
  }

  md += `## Data\n`;
  if (log.dataPath) {
    md += `- **Raw Data:** \`${log.dataPath}\`\n`;
  }
  if (log.analysisPath) {
    md += `- **Analysis:** \`${log.analysisPath}\`\n`;
  }
  md += `\n`;

  if (log.resultsSummary) {
    md += `## Results Summary\n`;
    md += `${log.resultsSummary}\n\n`;
  }

  if (log.nextSteps && log.nextSteps.length > 0) {
    md += `## Next Steps\n`;
    log.nextSteps.forEach((step) => {
      md += `- ${step}\n`;
    });
    md += `\n`;
  }

  md += `---\n`;
  md += `*Generated by ExperimentTracking skill - LogExperiment tool*\n`;

  return md;
}

// Run main function
main()
  .then((result) => {
    if (result) {
      console.log(JSON.stringify(result, null, 2));
    }
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
