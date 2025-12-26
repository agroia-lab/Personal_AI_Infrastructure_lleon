---
name: ExperimentTracking
description: Track experiments, parameters, results, and reproducibility. USE WHEN user mentions "plan experiment" OR "log experiment" OR "record results" OR "analyze experiment data" OR "compare experiments". Helps maintain reproducible research with structured documentation.
version: 1.0.0
author: Research Lab
tags: [experiments, lab-notebook, reproducibility, research, data-tracking]
---

# ExperimentTracking

This skill provides comprehensive experiment tracking from planning through analysis, ensuring reproducibility and proper documentation of research work.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/Tools/SkillWorkflowNotification WORKFLOWNAME ExperimentTracking
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **ExperimentTracking** skill...
   ```

| Action | Trigger | Behavior |
|--------|---------|----------|
| **Plan Experiment** | "plan experiment", "design experiment", "set up experiment" | Create structured experiment plan with hypothesis, variables, controls |
| **Record Experiment** | "log experiment", "record experiment", "document results" | Capture experiment details, conditions, observations in structured format |
| **Analyze Results** | "analyze experiment", "process data", "statistical analysis" | Run QC, statistical tests, generate visualizations, compare to past work |
| **Compare Experiments** | "compare experiments", "compare runs", "similar experiments" | Find and compare similar past experiments, identify patterns |
| **Generate Protocol** | "create protocol", "document procedure", "write methods" | Generate reproducible protocol documentation |

## Workflows

### 1. Plan Experiment

**Purpose:** Create structured experiment plans with proper controls and documentation

**Steps:**
1. Gather hypothesis and research question
2. Identify independent and dependent variables
3. Define control groups and experimental conditions
4. List required materials and equipment
5. Estimate sample sizes and replicates
6. Create experiment timeline
7. Generate pre-registration document
8. Save plan to History/Experiments/Plans/

**Output:** Structured experiment plan in markdown format

**Example:**
```
User: "I want to test the effect of temperature on enzyme activity at 20°C, 30°C, and 40°C with 5 replicates each"
Assistant: [Uses ExperimentTracking → Plan Experiment workflow]
```

### 2. Record Experiment

**Purpose:** Document experiment execution with all relevant metadata

**Steps:**
1. Capture experiment metadata:
   - Experiment ID (auto-generated: EXP-YYYY-MM-###)
   - Date, time, researcher name
   - Environmental conditions (if relevant)
2. Record experimental conditions and parameters
3. Document any deviations from protocol
4. Link to raw data files
5. Capture observations and notes
6. Generate structured lab notebook entry
7. Save to History/Experiments/YYYY-MM/

**Output:** Lab notebook entry with complete experiment documentation

**Tool:** Uses `LogExperiment.ts` for structured data capture

### 3. Analyze Results

**Purpose:** Process and analyze experimental data with proper statistics

**Steps:**
1. Load experiment data from file path
2. Run quality control checks:
   - Check for missing values
   - Identify outliers
   - Validate data ranges
3. Perform statistical analysis:
   - Descriptive statistics (mean, SD, SE)
   - Appropriate statistical tests (t-test, ANOVA, etc.)
   - Effect sizes and confidence intervals
4. Generate visualizations:
   - Box plots, bar charts with error bars
   - Scatter plots for relationships
   - Time series if applicable
5. Compare to similar past experiments
6. Interpret results relative to hypothesis
7. Suggest next experiments
8. Save analysis report to History/DataAnalyses/

**Output:** Complete analysis report with statistics and visualizations

**Tool:** Uses `AnalyzeExperiment.ts` for data processing

### 4. Compare Experiments

**Purpose:** Find patterns across multiple experiments

**Steps:**
1. Search History/Experiments/ for similar work
2. Extract key parameters and results
3. Create comparison table
4. Identify trends and patterns
5. Highlight inconsistencies or anomalies
6. Suggest meta-analysis if appropriate

**Output:** Comparative analysis across experiments

**Tool:** Uses `CompareExperiments.ts`

### 5. Generate Protocol

**Purpose:** Create reproducible protocol documentation

**Steps:**
1. Extract methods from experiment records
2. Standardize format (numbered steps)
3. Include materials list with specifications
4. Add safety considerations
5. Include troubleshooting section
6. Version control the protocol
7. Save to Skills/ExperimentTracking/Protocols/

**Output:** Formatted protocol document ready for sharing

## Tools

### LogExperiment.ts
Records experiment details to structured storage in History/Experiments/

**Usage:**
```bash
bunx ~/.claude/Skills/ExperimentTracking/Tools/LogExperiment.ts \
  --id "EXP-2025-01-001" \
  --researcher "Researcher Name" \
  --hypothesis "Temperature increases enzyme activity" \
  --data-path "~/data/experiment_001.csv"
```

### AnalyzeExperiment.ts
Performs statistical analysis on experimental data

**Usage:**
```bash
bunx ~/.claude/Skills/ExperimentTracking/Tools/AnalyzeExperiment.ts \
  --data "~/data/experiment_001.csv" \
  --test "anova" \
  --significance 0.05
```

### CompareExperiments.ts
Compares multiple experiments to find patterns

**Usage:**
```bash
bunx ~/.claude/Skills/ExperimentTracking/Tools/CompareExperiments.ts \
  --experiments "EXP-2025-01-001,EXP-2025-01-002,EXP-2025-01-003"
```

## Examples

**Example 1: Complete experiment workflow**
```
User: "I want to plan an experiment testing three different growth media for bacterial cultures"
Assistant: [Executes Plan Experiment workflow]
→ Creates hypothesis: "Different media affect bacterial growth rates"
→ Defines variables: Media type (LB, TSB, BHI) × Growth time
→ Plans 3 conditions × 5 replicates = 15 cultures
→ Generates experiment plan saved to History/Experiments/Plans/
```

**Example 2: Analyze experiment data**
```
User: "Analyze the enzyme activity data from ~/data/enzyme_assay_042.csv"
Assistant: [Executes Analyze Results workflow]
→ Loads data, validates 15 observations
→ Runs ANOVA: F(2,12)=8.45, p=0.005
→ Generates box plots with error bars
→ Conclusion: Temperature significantly affects activity
→ Suggests follow-up: Test intermediate temperatures
→ Saves report to History/DataAnalyses/2025-12/
```

**Example 3: Compare related experiments**
```
User: "Compare my last 3 enzyme experiments"
Assistant: [Executes Compare Experiments workflow]
→ Searches History/Experiments/ for enzyme-related work
→ Finds EXP-2025-11-015, EXP-2025-12-003, EXP-2025-12-008
→ Extracts parameters: temperature, pH, substrate concentration
→ Creates comparison table
→ Identifies trend: Activity peaks at 37°C across all experiments
```

## Configuration

The skill uses these default configurations (customizable in lab settings):

```yaml
experiment_id_format: "EXP-YYYY-MM-###"
default_replicates: 3
significance_level: 0.05
min_sample_size: 5
data_formats: ["csv", "xlsx", "tsv", "json"]
storage_path: "${PAI_DIR}/History/Experiments/"
analysis_tools: ["descriptive", "t-test", "anova", "regression", "correlation"]
visualization_formats: ["png", "svg", "pdf"]
```

## Integration Points

**Hooks:**
- `experimentComplete.ts` - Triggers after analysis completes
- `sessionEnd.ts` - Summarizes experiment work in session

**History System:**
- Plans → `History/Experiments/Plans/YYYY-MM/`
- Lab notebooks → `History/Experiments/YYYY-MM/`
- Analysis reports → `History/DataAnalyses/YYYY-MM/`
- Protocols → `Skills/ExperimentTracking/Protocols/`

**Agents:**
- **DataScientist** - Called for complex statistical analysis
- **ScientificWriter** - Called for methods section generation

**MCP Servers:**
- `python-analysis` - For advanced statistical computations
- `jupyter` - For interactive analysis notebooks

## Data Format Standards

### Experiment Log Entry Format
```markdown
# Experiment: [Experiment ID]

**Date:** YYYY-MM-DD
**Researcher:** [Name]
**Hypothesis:** [Hypothesis statement]

## Experimental Design
- **Independent Variable:** [Variable and levels]
- **Dependent Variable:** [What's measured]
- **Controls:** [Control conditions]
- **Replicates:** [Number]

## Materials
- [Equipment list]
- [Reagents with concentrations]

## Procedure
1. [Step-by-step protocol reference]

## Observations
- [Time-stamped observations]
- [Deviations from protocol]

## Data
- **Raw Data:** `[filepath]`
- **Analysis:** `[filepath to analysis report]`

## Results Summary
[Brief summary of findings]

## Next Steps
[Follow-up experiments or analyses]
```

### Analysis Report Format
```markdown
# Analysis Report: [Experiment ID]

**Date:** YYYY-MM-DD
**Analyst:** [Name]
**Data:** `[filepath]`

## Data Summary
- Observations: [n]
- Variables: [list]
- Missing values: [count]

## Quality Control
- Outliers detected: [details]
- Data range validation: [pass/fail]

## Statistical Analysis
### Descriptive Statistics
[Table of means, SD, SE by group]

### Inferential Statistics
- **Test:** [test name]
- **Result:** [test statistic, df, p-value]
- **Effect size:** [Cohen's d, eta-squared, etc.]
- **Conclusion:** [interpretation]

## Visualizations
![Figure 1](path/to/figure1.png)
*Figure 1: [caption]*

## Interpretation
[Interpretation relative to hypothesis]

## Comparison to Previous Work
[Links to similar experiments and comparison]

## Recommendations
[Next steps, additional experiments needed]
```

## Best Practices

1. **Pre-register experiments** - Plan before executing
2. **Use consistent IDs** - Follow EXP-YYYY-MM-### format
3. **Document deviations** - Record any protocol changes
4. **Link raw data** - Always preserve original data files
5. **Statistical rigor** - Check assumptions, report effect sizes
6. **Reproducibility** - Include enough detail for replication
7. **Version protocols** - Track protocol changes over time
8. **Compare regularly** - Look for patterns across experiments

## Troubleshooting

**Issue:** Statistical test assumptions not met
**Solution:** Use non-parametric alternatives (Mann-Whitney, Kruskal-Wallis)

**Issue:** Missing data points
**Solution:** Document reason, decide on handling (exclude, impute, or analyze separately)

**Issue:** Unexpected results
**Solution:** Check raw data for errors, compare to similar past experiments, consider confounding variables

**Issue:** Can't find similar past experiments
**Solution:** Broaden search terms, search by technique rather than specific hypothesis

---

**This skill integrates with your lab workflow to ensure reproducible, well-documented research. All experiment records are automatically versioned and stored in the History system for future reference.**