# Research Lab Setup Guide for PAI

This guide walks you through customizing PAI (Personal AI Infrastructure) for your research lab workflow.

## Overview

We've created research-specific customizations including:
- ✅ **ExperimentTracking** skill - Plan, log, and analyze experiments
- ✅ **LiteratureReview** skill - Analyze papers and synthesize research
- ✅ **ScientificWriter** agent - Draft manuscripts and methods
- ✅ **DataScientist** agent - Statistical analysis and visualization
- ✅ **Research History system** - Organized experiment/paper/protocol tracking
- ✅ **Lab hooks** - Auto-notifications when analyses complete
- ✅ **Lab commands** - `lab-status` and `lab-share` utilities

---

## Prerequisites

Before starting:
1. PAI is installed (see main README.md)
2. You have access to `.claude/` directory
3. Basic familiarity with command line
4. (Optional) Research lab team size: 2-5 people

---

## Setup Steps

### Step 1: Configure Lab Identity (5 minutes)

Edit `.claude/Skills/CORE/SKILL.md` to add your lab's identity:

```bash
# Open the CORE configuration
code ~/.claude/Skills/CORE/SKILL.md  # or use your preferred editor
```

Add a new section after line 100:

```markdown
---

## LAB IDENTITY & CONFIGURATION

**Lab Information:**
- LAB_NAME: [Your Lab Name]
- LAB_FOCUS: [e.g., "Molecular Biology", "Computational Neuroscience"]
- PRINCIPAL_INVESTIGATOR: [PI Name]
- TEAM_MEMBERS: [Researcher 1, Researcher 2, etc.]

**Lab Standards:**
- CITATION_FORMAT: nature  # or apa, science, cell, etc.
- DATA_FORMAT: csv  # primary data file format
- NOTEBOOK_FORMAT: jupyter  # or rmarkdown
- STATISTICAL_SOFTWARE: R  # or python
- VERSION_CONTROL: git

**Lab Workflows:**
- EXPERIMENT_PREFIX: EXP  # Experiment ID format: EXP-YYYY-MM-###
- DEFAULT_REPLICATES: 3
- SIGNIFICANCE_LEVEL: 0.05
- MIN_SAMPLE_SIZE: 5

**Lab Resources:**
- DATA_STORAGE: ~/lab_data/  # where raw data lives
- SHARED_PROTOCOLS: ~/protocols/  # shared protocol directory
- LITERATURE_ACCESS: [institution, PubMed, arXiv, etc.]

---
```

**Save the file.** This configuration loads automatically at every session start.

### Step 2: Set Up API Keys (5 minutes)

The research skills may use external APIs. Create `.claude/.env` if it doesn't exist:

```bash
cd ~/.claude
cp .env.example .env  # if you have .env.example
# OR create new .env file
code .env
```

Add research-specific API keys:

```bash
# Literature access (optional but recommended)
NCBI_API_KEY=your_pubmed_api_key_here  # Get from https://www.ncbi.nlm.nih.gov/account/

# If using arXiv extensively
ARXIV_API_KEY=your_arxiv_key  # Usually not needed

# For web scraping papers (if needed)
BRIGHTDATA_API_KEY=your_brightdata_key

# Statistical computing (if using cloud services)
# RSTUDIO_SERVER=http://your-rstudio-server.edu

# Voice notifications (already configured if you have voice server)
VOICE_SERVER_PORT=3000
```

**Important:** Never commit `.env` to version control!

### Step 3: Enable Lab-Specific Hooks (2 minutes)

The lab hooks are already created. Now enable them in settings:

```bash
code ~/.claude/settings.json
```

Find the `"hooks"` section and add:

```json
{
  "hooks": {
    "postToolUse": [
      "Hooks/capture-all-events.ts",
      "Hooks/capture-tool-output.ts",
      "Hooks/experiment-complete-notification.ts",
      "Hooks/paper-analyzed-notification.ts"
    ]
  }
}
```

This enables automatic notifications when experiments and papers are analyzed.

### Step 4: Create Initial History Directories (1 minute)

The History structure is already created, but verify it exists:

```bash
ls -la ~/.claude/History/
```

You should see:
- `Experiments/` - Experiment logs
- `Papers/` - Paper analyses
- `DataAnalyses/` - Statistical analyses
- `Protocols/` - Lab protocols
- `LabMeetings/` - Meeting notes
- `Publications/` - Manuscript work
- `TeamKnowledge/` - Shared insights

If any are missing:

```bash
mkdir -p ~/.claude/History/{Experiments/{Plans,YYYY-MM},Papers/YYYY-MM,DataAnalyses/YYYY-MM,Protocols/YYYY-MM,LabMeetings/YYYY-MM,Publications/YYYY-MM,TeamKnowledge/YYYY-MM}
```

### Step 5: Test the Skills (10 minutes)

Let's verify everything works:

#### Test 1: ExperimentTracking Skill

Start Claude and try:

```
Plan an experiment to test three growth media (LB, TSB, minimal) with 5 replicates each for bacterial growth.
```

Expected: Claude uses ExperimentTracking skill → Plan Experiment workflow

#### Test 2: LiteratureReview Skill

```
Search for papers on CRISPR gene editing published in 2024.
```

Expected: Claude uses LiteratureReview skill → Find Papers workflow

#### Test 3: DataScientist Agent

```
I need to analyze enzyme activity data comparing three temperatures. The data shows: 20°C (45.2±3.8, n=5), 30°C (78.5±4.2, n=5), 40°C (52.3±5.1, n=5). What statistical test should I use and what do the results mean?
```

Expected: Claude delegates to DataScientist agent for statistical analysis

#### Test 4: Lab Commands

```
lab-status
```

Expected: Shows current lab work status from History system

#### Test 5: ScientificWriter Agent

```
Write an abstract (250 words, Nature format) for our enzyme study showing that activity peaks at 30°C.
```

Expected: Claude delegates to ScientificWriter agent

### Step 6: Customize for Your Lab (Optional)

#### Option A: Adjust Experiment ID Format

Edit `.claude/Skills/ExperimentTracking/SKILL.md` line 211:

```yaml
experiment_id_format: "LAB-YYYY-MM-###"  # Change "LAB" to your prefix
```

#### Option B: Add Lab-Specific Protocols

Create your first protocol:

```bash
code ~/.claude/Skills/ExperimentTracking/Protocols/YourProtocolName.md
```

Use the format from `History/RESEARCH_LAB_HISTORY_GUIDE.md`

#### Option C: Add MCP Servers for Research

Edit `.claude/.mcp.json` to add research-specific servers:

```json
{
  "mcpServers": {
    "pubmed": {
      "command": "bunx",
      "args": ["mcp-server-pubmed"],
      "env": { "NCBI_API_KEY": "${NCBI_API_KEY}" }
    },
    "arxiv": {
      "command": "bunx",
      "args": ["mcp-server-arxiv"]
    },
    "jupyter": {
      "command": "bunx",
      "args": ["mcp-server-jupyter"],
      "env": { "JUPYTER_SERVER": "http://localhost:8888" }
    }
  }
}
```

Then restart Claude to load the new servers.

---

## Team Collaboration Setup (for 2-5 person teams)

### Option 1: Shared PAI Core (Recommended)

1. **Create Shared Repository**
   ```bash
   cd ~/
   git clone <your-lab-repo> LabPAI
   ```

2. **Symlink Shared Skills**
   ```bash
   ln -s ~/LabPAI/.claude/Skills/ExperimentTracking ~/.claude/Skills/
   ln -s ~/LabPAI/.claude/Skills/LiteratureReview ~/.claude/Skills/
   ln -s ~/LabPAI/.claude/Agents/ScientificWriter.md ~/.claude/Agents/
   ln -s ~/LabPAI/.claude/Agents/DataScientist.md ~/.claude/Agents/
   ```

3. **Keep Personal History**
   - Each person maintains their own `History/` directory
   - Share insights via `lab-share` command → `TeamKnowledge/`

4. **Sync Protocol Updates**
   ```bash
   # Pull latest protocols
   cd ~/LabPAI
   git pull

   # Push your protocol updates
   git add Skills/ExperimentTracking/Protocols/
   git commit -m "Update Western blot protocol"
   git push
   ```

### Option 2: Individual PAI Instances

1. **Each Researcher Has Full PAI**
   - Complete independence
   - Share via exported files

2. **Regular Knowledge Sync**
   ```bash
   # Weekly: Share key insights
   rsync -av ~/.claude/History/TeamKnowledge/ /shared/TeamKnowledge/

   # Monthly: Sync protocols
   rsync -av ~/.claude/Skills/ExperimentTracking/Protocols/ /shared/Protocols/
   ```

---

## Daily Workflow Examples

### Scenario 1: Running an Experiment

**Before Experiment:**
```
User: "Plan experiment to test pH effects on enzyme activity (pH 6, 7, 8)"
Claude: [Uses ExperimentTracking → Plan Experiment]
→ Creates structured plan
→ Saves to History/Experiments/Plans/
```

**After Experiment:**
```
User: "Log experiment EXP-2025-12-001. Tested pH 6,7,8 with n=5 each. Data: ~/data/ph_test.csv"
Claude: [Uses LogExperiment tool]
→ Creates lab notebook entry
→ Saves to History/Experiments/
```

**Analyzing Data:**
```
User: "Analyze ~/data/ph_test.csv comparing the three pH levels"
Claude: [Uses DataScientist agent]
→ Runs ANOVA
→ Generates visualizations
→ Saves analysis to History/DataAnalyses/
→ Hook triggers: "🧪 Experiment analysis completed!"
```

### Scenario 2: Literature Review

**Finding Papers:**
```
User: "Find recent papers on phage therapy for antibiotic resistance"
Claude: [Uses LiteratureReview → Find Papers]
→ Searches PubMed, arXiv
→ Returns ranked list
```

**Deep Analysis:**
```
User: "Analyze this paper in detail: doi:10.1038/nature12345"
Claude: [Uses LiteratureReview → Analyze Paper]
→ Extracts methods, results, limitations
→ Saves analysis to History/Papers/
→ Hook triggers: "📚 Paper analysis completed!"
```

**Synthesis:**
```
User: "Compare the last 3 papers I analyzed on phage therapy"
Claude: [Uses LiteratureReview → Compare Studies]
→ Creates comparison matrix
→ Identifies consensus and gaps
→ Saves to History/Research/
```

### Scenario 3: Writing a Manuscript

**Methods Section:**
```
User: "Write the methods section for EXP-2025-12-001"
Claude: [Uses ScientificWriter agent]
→ Pulls experiment details from History
→ Formats for journal style
→ Includes statistical methods
→ Saves to History/Publications/
```

**Results with Figures:**
```
User: "Write results section with Figure 2 showing pH effects"
Claude: [Coordinates DataScientist + ScientificWriter]
→ DataScientist creates publication-quality figure
→ ScientificWriter drafts results text
→ Both saved to History/Publications/
```

### Scenario 4: Team Sharing

**Share a Finding:**
```
User: "lab-share I found that increasing blocking time to 2h fixed Western blot background"
Claude: [Uses lab-share command]
→ Creates formatted entry
→ Saves to History/TeamKnowledge/
→ Generates lab meeting format
→ Outputs quick message for Slack
```

**Check Lab Status:**
```
User: "lab-status experiments"
Claude: [Uses lab-status command]
→ Lists all experiments from last 30 days
→ Shows status and key findings
→ Identifies active projects
```

---

## Best Practices

### For Individuals

1. **Pre-register experiments** - Use "Plan Experiment" before running
2. **Document immediately** - Log experiments right after completion
3. **Analyze systematically** - Always use DataScientist for statistics
4. **Link related work** - Reference experiment IDs across documents
5. **Review history** - Before starting, check what's been done: `lab-status`

### For Teams

1. **Weekly lab-status review** - Discuss in lab meetings
2. **Share insights immediately** - Use `lab-share` for valuable findings
3. **Sync protocols regularly** - Version control is critical
4. **Cross-reference experiments** - Link to colleagues' related work
5. **Maintain TeamKnowledge** - Document tribal knowledge

### For Reproducibility

1. **Always link raw data** - Include file paths in experiment logs
2. **Version protocols** - Track changes over time
3. **Save analysis code** - Store R/Python scripts with analyses
4. **Document deviations** - Note any changes from protocol
5. **Use consistent IDs** - Follow experiment naming convention

---

## Troubleshooting

### Issue: Skills Not Activating

**Symptom:** Claude doesn't use ExperimentTracking or LiteratureReview

**Solutions:**
1. Check skill frontmatter has correct "USE WHEN" format
2. Restart Claude session
3. Try explicit trigger: "Use the ExperimentTracking skill to..."
4. Verify skill is in `.claude/Skills/` directory

### Issue: Hooks Not Triggering

**Symptom:** No notifications after experiment analysis

**Solutions:**
1. Check settings.json has hooks enabled
2. Verify hook files are executable: `chmod +x ~/.claude/Hooks/*.ts`
3. Check hook logs for errors
4. Test manually: `echo '{}' | bunx ~/.claude/Hooks/experiment-complete-notification.ts`

### Issue: Commands Not Found

**Symptom:** `lab-status` or `lab-share` not recognized

**Solutions:**
1. Verify files exist in `.claude/Commands/`
2. Restart Claude session
3. Try full command name: `/lab-status`

### Issue: History Not Saving

**Symptom:** Analyses complete but nothing in History/

**Solutions:**
1. Check directory permissions: `ls -la ~/.claude/History/`
2. Verify PAI_DIR environment variable: `echo $PAI_DIR`
3. Check tool output for error messages
4. Manually create directories if needed (see Step 4)

### Issue: Agent Not Responding

**Symptom:** DataScientist or ScientificWriter agent doesn't activate

**Solutions:**
1. Verify agent files exist: `ls ~/.claude/Agents/`
2. Check agent frontmatter format
3. Try explicit: "Delegate to DataScientist agent to analyze this data"
4. Check model availability (agents use 'sonnet' by default)

---

## Next Steps

After setup, we recommend:

### Week 1: Individual Familiarization
- Run through all test scenarios
- Create your first experiment plan
- Analyze one paper
- Test each agent

### Week 2: Customize for Your Work
- Add your lab's existing protocols
- Set up experiment ID format
- Configure citation style
- Add commonly used statistical tests

### Week 3: Team Integration (if applicable)
- Set up shared repository
- Sync initial protocols
- Train team members on basics
- Establish team conventions

### Week 4: Production Use
- Start logging real experiments
- Build up paper analysis library
- Use for actual manuscript writing
- Collect feedback and iterate

---

## Additional Resources

### Documentation
- `LAB_SETUP_GUIDE.md` - This file
- `History/RESEARCH_LAB_HISTORY_GUIDE.md` - History system details
- `.claude/Skills/ExperimentTracking/SKILL.md` - Experiment tracking workflows
- `.claude/Skills/LiteratureReview/SKILL.md` - Literature review workflows
- `.claude/Agents/ScientificWriter.md` - Scientific writing capabilities
- `.claude/Agents/DataScientist.md` - Statistical analysis capabilities

### Tools
- `.claude/Skills/ExperimentTracking/Tools/LogExperiment.ts`
- `.claude/Skills/ExperimentTracking/Tools/AnalyzeExperiment.ts`
- `.claude/Skills/LiteratureReview/Tools/SearchPapers.ts`
- `.claude/Skills/LiteratureReview/Tools/AnalyzePaper.ts`

### Commands
- `lab-status` - Lab work status report
- `lab-share <content>` - Share findings with team

### Getting Help
- Check PAI main documentation: `README.md`
- Review skill workflows in SKILL.md files
- Test individual tools with `--help` flag
- Ask Claude: "How do I [task] with the research lab setup?"

---

## Configuration Checklist

Use this checklist to verify your setup:

- [ ] Lab identity configured in CORE/SKILL.md
- [ ] API keys added to .env file
- [ ] Lab hooks enabled in settings.json
- [ ] History directories created
- [ ] ExperimentTracking skill tested
- [ ] LiteratureReview skill tested
- [ ] DataScientist agent tested
- [ ] ScientificWriter agent tested
- [ ] lab-status command working
- [ ] lab-share command working
- [ ] Team collaboration strategy chosen (if applicable)
- [ ] First real experiment logged
- [ ] First paper analyzed
- [ ] Team trained (if applicable)

---

## Feedback and Iteration

This is a living system. As you use it:

1. **Document what works** - Use `lab-share` to capture successful workflows
2. **Iterate on protocols** - Update and version as you learn
3. **Customize skills** - Add workflows specific to your research
4. **Share improvements** - If using shared repo, contribute back
5. **Build institutional knowledge** - TeamKnowledge grows over time

---

**You're now ready to use PAI for research lab workflows! Start with simple experiments and build from there. The system learns and improves as you use it.**

For questions or issues, refer to the troubleshooting section above or the main PAI documentation.
