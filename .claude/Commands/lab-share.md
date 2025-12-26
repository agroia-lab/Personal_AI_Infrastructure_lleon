You are helping the user share a research finding, insight, or result with the lab team.

## Task

Take the provided content and format it for team sharing, then save it to the TeamKnowledge directory for future reference.

## Instructions

1. **Process the Content** - Analyze what the user wants to share
2. **Categorize** - Determine the type of knowledge:
   - Experimental finding
   - Technical insight
   - Troubleshooting solution
   - Protocol tip
   - Paper summary
   - Tool recommendation
   - Best practice
3. **Format for Sharing** - Create a clear, actionable summary
4. **Save to TeamKnowledge** - Store in History/TeamKnowledge/YYYY-MM/
5. **Generate Sharing Output** - Create text suitable for:
   - Lab meeting discussion
   - Slack/email message
   - Lab notebook entry

## Input

Content to share:

$ARGUMENTS

## Output Format

Provide three outputs:

### 1. Team Knowledge Entry (saved to file)
```markdown
# [Title - What was learned]

**Date:** YYYY-MM-DD
**Contributor:** [Name]
**Category:** [Type of knowledge]

## Summary
[2-3 sentence summary]

## Details
[Full explanation with context]

## Application
[When/how to use this knowledge]

## Related Work
[Links to experiments, papers, protocols if applicable]

## Keywords
[Searchable tags for future reference]

---
*Shared via lab-share command*
```

### 2. Lab Meeting Format
```
📢 TEAM SHARE: [Title]

TL;DR: [One sentence summary]

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]

Impact: [Why this matters to the team]

Details: See full write-up in History/TeamKnowledge/YYYY-MM/[filename]
```

### 3. Quick Message Format
```
Hey team! Quick share:

[2-3 sentence explanation]

This might be useful for [applicable scenarios].

Full details: [filepath]
```

## Save Location

Save the team knowledge entry to:
```
${PAI_DIR}/History/TeamKnowledge/YYYY-MM/YYYY-MM-DD-HHMMSS_[CATEGORY]_[TITLE].md
```

## Examples

**Example 1: Troubleshooting tip**
```
lab-share "I fixed the high background in Western blots by increasing blocking time to 2h and switching to BSA instead of milk for phospho-antibodies. Background dropped from 40% to 5%."
```

**Example 2: Experimental finding**
```
lab-share "EXP-2025-12-001 showed that enzyme activity peaks at 30°C, not 37°C as literature suggested. Tested across 3 pH values, trend holds."
```

**Example 3: Paper insight**
```
lab-share "Smith et al 2024 Nature paper shows new CRISPR variant with 2.3x better efficiency. Could improve our maize editing. DOI: 10.1038/nature12345"
```

**Example 4: Protocol improvement**
```
lab-share "New cell counting method using automated counter reduced variability. CV improved from 15% to 4%. Recommend switching all projects."
```

## Additional Features

- Extract experiment IDs and link to relevant experiments
- Extract paper citations and link to analyses
- Suggest related protocols or past work
- Tag with appropriate keywords for searching
- Estimate impact level (high/medium/low priority for team)

Now process the sharing request and generate all three outputs.
