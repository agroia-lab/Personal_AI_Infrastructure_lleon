You are generating a lab status report showing recent research activity.

## Task

Analyze the lab's recent work from the History system and provide a comprehensive status update.

## Instructions

1. **Search Recent Experiments** - Check History/Experiments/ for experiments from the last 30 days
2. **Check Data Analyses** - Review History/DataAnalyses/ for recent statistical analyses
3. **Review Papers** - Check History/Papers/ for recently analyzed literature
4. **Check Protocols** - Look for any updated protocols in History/Protocols/
5. **Review Publications** - Check History/Publications/ for manuscript work

## Output Format

Provide a structured status report:

```
═══════════════════════════════════════════════════
🧬 LAB STATUS REPORT
═══════════════════════════════════════════════════
📅 Report Date: [Current Date]
📊 Reporting Period: Last 30 days

🔬 EXPERIMENTS
[List of recent experiments with IDs, dates, and brief status]
- EXP-YYYY-MM-### | Date | Status | Key finding

📈 DATA ANALYSES
[List of recent analyses]
- Analysis | Date | Dataset | Key result

📚 LITERATURE REVIEW
[Recently analyzed papers]
- Authors Year | Journal | Relevance

📝 PROTOCOLS
[Updated protocols]
- Protocol name | Version | Date updated

✍️ PUBLICATIONS
[Manuscript work in progress]
- Manuscript title | Section | Status

🎯 ACTIVE PROJECTS
[Infer active projects from recent work]

⏭️ UPCOMING PRIORITIES
[Suggested based on recent activity patterns]

💡 INSIGHTS
[Key patterns or trends from recent work]

═══════════════════════════════════════════════════
```

## Search Commands to Use

```bash
# Recent experiments
find ${PAI_DIR}/History/Experiments/ -name "*.md" -mtime -30 -type f

# Recent analyses
find ${PAI_DIR}/History/DataAnalyses/ -name "*.md" -mtime -30 -type f

# Recent papers
find ${PAI_DIR}/History/Papers/ -name "*.md" -mtime -30 -type f

# Recent protocols
find ${PAI_DIR}/History/Protocols/ -name "*.md" -mtime -30 -type f

# Recent publications
find ${PAI_DIR}/History/Publications/ -name "*.md" -mtime -30 -type f
```

## Additional Arguments

If specific arguments are provided: $ARGUMENTS

Process arguments to filter the status report:
- If "experiments" → Focus only on experiments
- If "papers" → Focus only on literature review
- If project name → Filter to that project
- If date range → Adjust time window

## Example Usage

```
lab-status
lab-status experiments
lab-status "last 7 days"
lab-status EnzymeKinetics
```

Now generate the lab status report.
