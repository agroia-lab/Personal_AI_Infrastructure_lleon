# Research Lab History System Guide

This guide explains how the History system is organized for research lab workflows. The History system automatically captures and organizes all work performed through PAI.

## Directory Structure

```
History/
├── Experiments/              # All experiment-related work
│   ├── Plans/               # Pre-registered experiment plans
│   │   └── YYYY-MM/
│   └── YYYY-MM/             # Completed experiment logs
├── Papers/                  # Literature reviews and paper analyses
│   └── YYYY-MM/
├── DataAnalyses/            # Statistical analyses and visualizations
│   └── YYYY-MM/
├── Protocols/               # Lab protocols and SOPs
│   └── YYYY-MM/
├── LabMeetings/             # Lab meeting notes and presentations
│   └── YYYY-MM/
├── Grants/                  # Grant writing and proposal work
│   └── YYYY-MM/
├── Publications/            # Manuscript drafting and revisions
│   └── YYYY-MM/
├── TeamKnowledge/           # Shared lab knowledge and insights
│   └── YYYY-MM/
├── Sessions/                # General session summaries (PAI default)
│   └── YYYY-MM/
└── Learnings/               # Problem-solving and lessons learned (PAI default)
    └── YYYY-MM/
```

## File Naming Conventions

All files follow this format:
```
YYYY-MM-DD-HHMMSS_[CATEGORY]_[PROJECT]_[DESCRIPTION].md
```

### Examples:

**Experiments:**
```
2025-12-26-143022_Experiment_EnzymeKinetics_EXP-2025-12-001_Log.md
2025-12-26-150033_ExperimentPlan_ProteinPurification_PreRegistration.md
```

**Papers:**
```
2025-12-26-161544_Paper_SmithEtAl2024_CRISPR_Analysis.md
2025-12-26-165022_LiteratureSynthesis_PhageTherapy_Review.md
```

**Data Analyses:**
```
2025-12-26-171033_Analysis_EXP-2025-12-001_ANOVA_Results.md
2025-12-26-173544_Visualization_GrowthCurves_Figure2.md
```

**Protocols:**
```
2025-12-26-140022_Protocol_WesternBlot_v2.1.md
2025-12-26-142033_SOP_CellCulture_HEK293.md
```

## What Gets Saved Where

### Experiments/ - Experiment Documentation

**What goes here:**
- Complete experiment logs with metadata
- Experimental observations and notes
- Links to raw data files
- Deviations from protocols
- Preliminary results

**Created by:**
- ExperimentTracking skill → Record Experiment workflow
- LogExperiment.ts tool
- Manual experiment documentation

**Example content:**
```markdown
# Experiment: EXP-2025-12-001

**Date:** 2025-12-26
**Researcher:** Dr. Smith
**Hypothesis:** Temperature affects enzyme activity

## Experimental Design
- Independent Variable: Temperature (20°C, 30°C, 40°C)
- Dependent Variable: Enzyme activity (μmol/min)
- Controls: No enzyme control
- Replicates: 5

## Data
- Raw Data: `~/data/enzyme_assay_001.csv`
- Analysis: `History/DataAnalyses/2025-12/2025-12-26-171033_Analysis_...`

## Results Summary
Temperature significantly affects enzyme activity (ANOVA p<0.001)
```

### Experiments/Plans/ - Pre-Registered Experiments

**What goes here:**
- Experiment plans created before execution
- Hypothesis statements
- Planned sample sizes and statistical approaches
- Materials lists
- Expected timelines

**Created by:**
- ExperimentTracking skill → Plan Experiment workflow

**Why important:**
- Prevents p-hacking
- Documents original intent
- Helps with reproducibility
- Required by many journals

### Papers/ - Literature Analysis

**What goes here:**
- Deep analyses of individual papers
- Literature synthesis across multiple papers
- Comparative studies
- Method extractions from papers
- Citation information

**Created by:**
- LiteratureReview skill → Analyze Paper workflow
- LiteratureReview skill → Compare Studies workflow
- AnalyzePaper.ts tool
- ComparePapers.ts tool

**Example content:**
```markdown
# Paper Analysis: CRISPR-mediated gene editing in rice

**Citation:** Smith et al. Nature 625, 123-130 (2024)
**DOI:** 10.1038/nature12345

## Research Question
Can Cas9 variant X improve editing efficiency in rice?

## Methods
- Study Design: RCT with 3 Cas9 variants
- Sample: Rice cv. Nipponbare
- Techniques: CRISPR/Cas9, NGS, phenotyping

## Key Findings
1. Variant X showed 2.3× higher editing efficiency (p<0.001)
2. Off-target effects reduced by 60%
3. Germline transmission stable over 3 generations

## Relevance to Our Work
This variant could improve our maize editing experiments
```

### DataAnalyses/ - Statistical Analysis Reports

**What goes here:**
- Statistical test results
- Data quality control reports
- Generated visualizations
- R/Python analysis scripts
- Interpretation of results

**Created by:**
- ExperimentTracking skill → Analyze Results workflow
- DataScientist agent
- AnalyzeExperiment.ts tool

**Subdirectories (optional):**
```
DataAnalyses/YYYY-MM/
├── figures/          # Generated plots
├── scripts/          # R/Python code
└── reports/          # Analysis reports
```

**Example content:**
```markdown
# Analysis Report: EXP-2025-12-001

**Data:** `~/data/enzyme_assay_001.csv`
**Analyst:** DataScientist Agent

## Descriptive Statistics
- Control (20°C): 45.2 ± 3.8 μmol/min (n=5)
- Medium (30°C): 78.5 ± 4.2 μmol/min (n=5)
- High (40°C): 52.3 ± 5.1 μmol/min (n=5)

## Statistical Analysis
- Test: One-way ANOVA
- Result: F(2,12) = 34.56, p < 0.001
- Effect size: η² = 0.85 (large effect)
- Post-hoc: Tukey HSD (all pairwise comparisons significant)

## Visualization
![Box plot](./figures/enzyme_activity_boxplot.png)

## Interpretation
Temperature significantly affects enzyme activity with optimum at 30°C
```

### Protocols/ - Lab Protocols and SOPs

**What goes here:**
- Detailed experimental protocols
- Standard operating procedures (SOPs)
- Protocol version history
- Troubleshooting guides
- Safety information

**Created by:**
- ExperimentTracking skill → Generate Protocol workflow
- LiteratureReview skill → Extract Methods workflow
- Manual protocol documentation

**Versioning:**
```
2025-12-01_Protocol_WesternBlot_v2.0.md
2025-12-15_Protocol_WesternBlot_v2.1.md  # Updated based on troubleshooting
```

### LabMeetings/ - Lab Meeting Documentation

**What goes here:**
- Weekly lab meeting notes
- Progress presentations
- Discussion summaries
- Action items and assignments
- Data presentations

**Created by:**
- Manual documentation
- SessionEnd hook (if configured to capture lab meetings)

**Example content:**
```markdown
# Lab Meeting - 2025-12-26

**Attendees:** Dr. Smith, Dr. Jones, Lab Members A, B, C

## Presentations
### Dr. Smith - Enzyme Kinetics Project
- Completed experiments EXP-2025-12-001 through -003
- Found temperature optimum at 30°C
- Next: Test pH effects

### Lab Member A - Literature Review
- Reviewed 15 papers on phage therapy
- Identified gap: resistance evolution
- Proposal: Track resistance in our system

## Action Items
- [ ] Dr. Smith: Write methods section by next week
- [ ] Lab Member A: Design resistance tracking experiment
- [ ] Lab Member B: Order new antibodies (see list)

## Next Meeting: 2026-01-02
```

### Grants/ - Grant Writing Work

**What goes here:**
- Grant proposal drafts
- Specific aims sections
- Background and significance
- Research design sections
- Budget justifications
- Biosketches and CVs

**Created by:**
- ScientificWriter agent
- Manual grant writing sessions

### Publications/ - Manuscript Work

**What goes here:**
- Manuscript drafts (all sections)
- Abstract versions
- Figure legends
- Response to reviewers
- Revision tracking

**Created by:**
- ScientificWriter agent
- DataScientist agent (for figures)
- Manual writing sessions

**Organization by paper:**
```
Publications/2025-12/
├── 2025-12-15_Manuscript_EnzymeKinetics_v1_Draft.md
├── 2025-12-18_Manuscript_EnzymeKinetics_v2_RevisedIntro.md
├── 2025-12-20_Abstract_EnzymeKinetics_Nature_250words.md
├── 2025-12-22_ResponseToReviewers_EnzymeKinetics_v1.md
```

### TeamKnowledge/ - Shared Lab Knowledge

**What goes here:**
- Insights and lessons learned
- Troubleshooting solutions that worked
- Methodological tips
- Equipment quirks and solutions
- "Tribal knowledge" documentation
- Cross-project insights

**Created by:**
- Manual documentation
- SessionEnd hook capturing valuable insights
- Learnings hook redirected for team-relevant content

**Why important:**
- Preserves institutional knowledge
- Reduces repeated mistakes
- Onboards new lab members faster
- Makes tacit knowledge explicit

**Example content:**
```markdown
# Troubleshooting: Western Blot Background Issues

**Problem:** High background signal in Western blots
**Discovered:** 2025-12-26 by Lab Member B

## Solution Found
1. Increased blocking time from 1h to 2h
2. Used 5% BSA instead of milk for phospho-antibodies
3. Added 0.1% Tween-20 to wash buffer

## Before/After Results
- Before: Background signal ~40% of target
- After: Background signal ~5% of target

## When to Apply
Use this modified protocol for all phospho-antibodies going forward

## Related Protocols
See updated protocol: `History/Protocols/2025-12/Western_Blot_v2.1.md`
```

## Automatic vs Manual Capture

### Automatically Captured (via Hooks)
- Experiment analyses → Experiments/
- Paper analyses → Papers/
- Data analyses → DataAnalyses/
- Session summaries → Sessions/
- Problem-solving → Learnings/

### Manually Created (user-initiated)
- Experiment plans → Experiments/Plans/
- Protocols → Protocols/
- Lab meeting notes → LabMeetings/
- Grant drafts → Grants/
- Manuscript drafts → Publications/

## Searching the History

### Quick Keyword Search
```bash
# Search all history
rg -i "CRISPR" ~/.claude/History/

# Search specific category
rg -i "enzyme kinetics" ~/.claude/History/Experiments/

# Search by date range
ls -lt ~/.claude/History/Experiments/2025-12/ | head -20

# Search for specific experiment
rg "EXP-2025-12-001" ~/.claude/History/
```

### Find Related Work
```bash
# Find all work related to a project
rg "PhageTherapy" ~/.claude/History/ --type md

# Find papers by author
rg "Smith.*2024" ~/.claude/History/Papers/

# Find analyses using specific statistical test
rg "ANOVA" ~/.claude/History/DataAnalyses/
```

## Best Practices

### For Individuals

1. **Review history before starting work** - Check what's been done before
2. **Link related documents** - Reference experiment IDs across documents
3. **Use consistent project names** - Makes searching easier
4. **Capture insights immediately** - Document while fresh in mind
5. **Version protocols** - Keep old versions for reproducibility

### For Teams

1. **Shared naming conventions** - Agree on project abbreviations
2. **Regular knowledge sharing** - Move valuable insights to TeamKnowledge/
3. **Cross-reference work** - Link to colleagues' related experiments
4. **Document handoffs** - When projects transfer between people
5. **Weekly history review** - Discuss new insights in lab meetings

## Integration with Skills

### ExperimentTracking Skill
- Saves to: `Experiments/`, `DataAnalyses/`
- Reads from: `Experiments/` (for comparisons)

### LiteratureReview Skill
- Saves to: `Papers/`, `TeamKnowledge/`
- Reads from: `Papers/` (for synthesis)

### ScientificWriter Agent
- Reads from: `Experiments/`, `DataAnalyses/`, `Papers/`
- Saves to: `Publications/`, `Grants/`

### DataScientist Agent
- Reads from: `Experiments/`
- Saves to: `DataAnalyses/`

## Maintenance

### Monthly Tasks
```bash
# Archive old months (optional)
tar -czf History_Archive_2025-11.tar.gz ~/.claude/History/*/2025-11/

# Generate monthly summary
# List all work done in December
ls -lR ~/.claude/History/*/2025-12/ > monthly_summary_2025-12.txt
```

### Yearly Tasks
```bash
# Create yearly backup
tar -czf History_Backup_2025.tar.gz ~/.claude/History/

# Review and organize TeamKnowledge
# Consolidate duplicate insights
# Update protocols with year's learnings
```

## Privacy and Sharing

### Public vs Private
- **Always Private:** Raw data with patient/participant info
- **Private by default:** All experiment logs, analyses
- **Potentially Shareable:** Protocols, anonymized methods
- **Public after publication:** Published papers, public datasets

### Sanitization for Sharing
If sharing protocols or methods:
1. Remove specific reagent batch numbers
2. Remove internal project codes
3. Remove unpublished data references
4. Generalize to make broadly applicable

## Backup Strategy

**Critical: History contains irreplaceable work!**

### Recommended Backup
```bash
# Daily: Automatic git commits (if using git)
cd ~/.claude/History
git add .
git commit -m "Daily history update $(date +%Y-%m-%d)"
git push

# Weekly: External backup
rsync -av ~/.claude/History/ /path/to/backup/drive/History/

# Monthly: Archive to cloud storage
tar -czf History_$(date +%Y-%m).tar.gz ~/.claude/History/
# Upload to institutional storage, Dropbox, etc.
```

---

## Quick Reference Card

**Where does it go?**
- Experiment log → `Experiments/YYYY-MM/`
- Experiment plan → `Experiments/Plans/YYYY-MM/`
- Paper analysis → `Papers/YYYY-MM/`
- Statistical analysis → `DataAnalyses/YYYY-MM/`
- Protocol → `Protocols/YYYY-MM/`
- Lab meeting → `LabMeetings/YYYY-MM/`
- Grant draft → `Grants/YYYY-MM/`
- Manuscript draft → `Publications/YYYY-MM/`
- Shared insight → `TeamKnowledge/YYYY-MM/`

**How do I find it?**
```bash
rg -i "keyword" ~/.claude/History/
```

**How do I back it up?**
```bash
tar -czf history_backup.tar.gz ~/.claude/History/
```

---

*This History system is designed to capture all research work automatically, making your lab's collective knowledge searchable, reusable, and preserved for the future.*
