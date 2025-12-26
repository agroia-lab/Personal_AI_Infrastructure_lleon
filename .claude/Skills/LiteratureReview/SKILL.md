---
name: LiteratureReview
description: Analyze scientific papers, manage citations, and synthesize research findings. USE WHEN user mentions "analyze paper" OR "review literature" OR "find papers" OR "summarize research" OR "citation management". Helps maintain comprehensive knowledge of the scientific literature.
version: 1.0.0
author: Research Lab
tags: [papers, literature, citations, research, knowledge-synthesis]
---

# LiteratureReview

This skill provides comprehensive literature review capabilities including paper analysis, citation management, and knowledge synthesis across multiple studies.

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/Tools/SkillWorkflowNotification WORKFLOWNAME LiteratureReview
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **LiteratureReview** skill...
   ```

| Action | Trigger | Behavior |
|--------|---------|----------|
| **Analyze Paper** | "analyze paper", "review this paper", "summarize paper" | Deep analysis of single paper: methods, results, limitations |
| **Find Papers** | "find papers on", "search literature", "relevant papers" | Search PubMed, arXiv, Google Scholar for relevant literature |
| **Compare Studies** | "compare papers", "compare studies", "synthesis" | Comparative analysis across multiple papers |
| **Extract Methods** | "extract methods", "how did they do", "methodology" | Extract detailed methodology from papers |
| **Cite Paper** | "cite this", "citation for", "format citation" | Generate properly formatted citations |
| **Update Knowledge Base** | "add to knowledge base", "save paper summary" | Add paper to lab's knowledge repository |

## Workflows

### 1. Analyze Paper

**Purpose:** Deep analysis of a single scientific paper

**Steps:**
1. Fetch paper (via DOI, arXiv ID, or PDF path)
2. Extract metadata (title, authors, journal, year)
3. Identify research question and hypothesis
4. Analyze methodology:
   - Study design
   - Sample size and population
   - Experimental techniques
   - Statistical methods
5. Extract key results:
   - Main findings
   - Supporting data
   - Statistical significance
6. Identify limitations and caveats
7. Extract cited works and references
8. Generate summary and save to History/Papers/

**Output:** Comprehensive paper analysis in structured format

**Tool:** Uses `AnalyzePaper.ts`

**Example:**
```
User: "Analyze the paper at doi:10.1038/nature12345"
Assistant: [Executes Analyze Paper workflow]
→ Fetches paper metadata and full text
→ Extracts: Smith et al. 2024, Nature
→ Research question: Effect of X on Y
→ Methods: RCT, n=100, statistical test Z
→ Results: Significant effect (p<0.001, d=0.8)
→ Limitations: Small sample, single site
→ Saves analysis to History/Papers/2025-12/
```

### 2. Find Papers

**Purpose:** Search scientific literature for relevant papers

**Steps:**
1. Parse search query and identify key terms
2. Search multiple sources in parallel:
   - PubMed/PMC (biomedical)
   - arXiv (preprints)
   - Google Scholar (broad)
   - Your lab's citation database
3. Filter by:
   - Publication date range
   - Study type
   - Relevance score
4. Rank results by relevance
5. Generate summary list with abstracts
6. Optionally deep-analyze top results

**Output:** Ranked list of relevant papers with abstracts

**Tool:** Uses `SearchPapers.ts`

**Example:**
```
User: "Find recent papers on CRISPR gene editing in plants published after 2023"
Assistant: [Executes Find Papers workflow]
→ Searches PubMed + arXiv for "CRISPR gene editing plants"
→ Filters: year >= 2023
→ Found 47 papers
→ Top 10 ranked by relevance:
  1. Zhang et al. 2024 - Novel Cas9 variant...
  2. Kumar et al. 2024 - Off-target effects...
  [etc.]
```

### 3. Compare Studies

**Purpose:** Synthesize findings across multiple papers

**Steps:**
1. Collect papers to compare (from search or user-provided list)
2. Extract comparable elements:
   - Research questions
   - Methodologies
   - Sample sizes
   - Results and effect sizes
   - Conclusions
3. Create comparison matrix
4. Identify:
   - Consistent findings (consensus)
   - Conflicting results (discrepancies)
   - Gaps in literature
   - Methodological differences
5. Generate synthesis narrative
6. Save to History/Research/

**Output:** Comparative analysis with synthesis

**Tool:** Uses `ComparePapers.ts`

**Example:**
```
User: "Compare these three papers on enzyme kinetics"
Assistant: [Executes Compare Studies workflow]
→ Analyzes Paper A, B, C
→ Common finding: Temperature optimum at 37°C
→ Discrepancy: pH optimum varies (Paper A: 7.0, Paper B: 7.5, Paper C: 7.2)
→ Methodological difference: Paper A used different buffer system
→ Gap: No studies tested pH < 6.0
→ Generates synthesis table and narrative
```

### 4. Extract Methods

**Purpose:** Get detailed methodology for experimental replication

**Steps:**
1. Load paper
2. Identify methods section
3. Extract detailed protocol information:
   - Materials and equipment
   - Step-by-step procedures
   - Reagent concentrations
   - Timing and conditions
   - Statistical analysis approach
4. Identify any referenced protocols or supplementary methods
5. Flag any unclear or ambiguous steps
6. Format as reproducible protocol
7. Save to Skills/ExperimentTracking/Protocols/ (if applicable)

**Output:** Detailed methods extraction for replication

**Example:**
```
User: "Extract the methods from this paper so I can replicate the experiment"
Assistant: [Executes Extract Methods workflow]
→ Identifies methods section
→ Extracts: Cell culture (HEK293, DMEM + 10% FBS)
→ Treatment protocol: 24h incubation with compound X (10μM)
→ Analysis: Western blot, ImageJ quantification
→ Statistical test: One-way ANOVA with Tukey post-hoc
→ Generates formatted protocol
```

### 5. Cite Paper

**Purpose:** Generate properly formatted citations

**Steps:**
1. Extract paper metadata (author, title, journal, year, DOI)
2. Identify citation style required (APA, Nature, Science, etc.)
3. Format citation according to style
4. Generate both in-text and bibliography formats
5. Optionally add to citation database (BibTeX, Zotero, etc.)

**Output:** Formatted citation in requested style

**Tool:** Uses `GenerateCitation.ts`

**Example:**
```
User: "Cite this paper in Nature format"
Assistant: [Executes Cite Paper workflow]
→ Extracts: Smith, J. et al. Nature 625, 123-130 (2024)
→ In-text: Smith et al.¹
→ Bibliography: 1. Smith, J., Jones, A. & Brown, K. CRISPR-mediated gene editing in rice. Nature 625, 123-130 (2024).
```

### 6. Update Knowledge Base

**Purpose:** Add paper to lab's persistent knowledge repository

**Steps:**
1. Analyze paper (if not already done)
2. Extract key information for indexing:
   - Topic tags
   - Techniques used
   - Organisms/systems studied
   - Key findings
3. Add to lab knowledge base at History/Papers/
4. Update searchable index
5. Link to related papers in knowledge base
6. Generate "Related Work" suggestions

**Output:** Paper added to knowledge base with metadata

## Tools

### AnalyzePaper.ts
Performs deep analysis of a single scientific paper

**Usage:**
```bash
bunx ~/.claude/Skills/LiteratureReview/Tools/AnalyzePaper.ts \
  --doi "10.1038/nature12345"
  # OR --arxiv "2401.12345"
  # OR --pdf "/path/to/paper.pdf"
```

### SearchPapers.ts
Searches scientific literature databases

**Usage:**
```bash
bunx ~/.claude/Skills/LiteratureReview/Tools/SearchPapers.ts \
  --query "CRISPR gene editing plants" \
  --databases "pubmed,arxiv" \
  --year-from "2023" \
  --max-results 20
```

### ComparePapers.ts
Compares and synthesizes multiple papers

**Usage:**
```bash
bunx ~/.claude/Skills/LiteratureReview/Tools/ComparePapers.ts \
  --papers "doi:10.1038/nature12345,doi:10.1126/science.abc123,arxiv:2401.12345"
```

### GenerateCitation.ts
Formats citations in various styles

**Usage:**
```bash
bunx ~/.claude/Skills/LiteratureReview/Tools/GenerateCitation.ts \
  --doi "10.1038/nature12345" \
  --style "nature"  # or apa, mla, chicago, etc.
```

## Examples

**Example 1: Comprehensive paper review**
```
User: "I need to review this paper thoroughly: doi:10.1126/science.abc123"
Assistant: [Executes Analyze Paper workflow]
→ Fetches paper: "Gene regulation in E. coli" (Jones et al., Science 2024)
→ Research question: How does protein X regulate gene Y?
→ Methods: RNA-seq (n=3 biological replicates), ChIP-seq, EMSA
→ Key results:
  • Protein X binds to gene Y promoter (Kd = 50nM)
  • Binding increases Y expression 5-fold (p<0.001)
  • Effect abolished in X knockout strain
→ Limitations: Only tested in laboratory strain, one growth condition
→ Cited 8 key previous studies
→ Saved comprehensive analysis to History/Papers/2025-12/
```

**Example 2: Literature search and synthesis**
```
User: "What do we know about phage therapy for antibiotic-resistant infections?"
Assistant: [Executes Find Papers → Compare Studies workflows]
→ Searches PubMed for "phage therapy antibiotic resistance"
→ Found 156 papers, filtering to reviews and clinical trials
→ Top 15 papers analyzed
→ Synthesis:
  • Clinical trials show 60-80% success rate
  • Most effective against P. aeruginosa and S. aureus
  • Personalized phage cocktails outperform single phage
  • Main limitation: regulatory approval challenges
  • Gap: Limited data on phage resistance evolution
→ Generated synthesis saved to History/Research/
```

**Example 3: Method extraction for replication**
```
User: "I want to replicate the Western blot protocol from this paper"
Assistant: [Executes Extract Methods workflow]
→ Extracts detailed Western blot protocol:
  1. Sample preparation: RIPA buffer + protease inhibitors
  2. Protein quantification: BCA assay (Pierce #23225)
  3. Gel: 4-12% Bis-Tris (Invitrogen), 20μg protein/lane
  4. Transfer: PVDF membrane, 100V for 1h at 4°C
  5. Blocking: 5% milk in TBST, 1h room temp
  6. Primary antibody: anti-GFP (1:1000, Abcam ab290), overnight 4°C
  7. Secondary: HRP-conjugated anti-rabbit (1:5000), 1h room temp
  8. Detection: ECL substrate, ChemiDoc imaging
  9. Quantification: ImageJ densitometry, normalized to β-actin
→ Saved as reusable protocol
```

## Configuration

```yaml
citation_style_default: "nature"  # or apa, mla, chicago, science, cell
search_databases: ["pubmed", "arxiv", "scholar"]
max_search_results: 50
paper_storage: "${PAI_DIR}/History/Papers/"
cache_papers: true  # Cache fetched PDFs locally
auto_download_pdfs: false  # Require explicit permission to download
pubmed_api_key: "${NCBI_API_KEY}"  # Optional, increases rate limits
```

## Integration Points

**Hooks:**
- `paperAnalyzed.ts` - Triggers after paper analysis completes
- `knowledgeBaseUpdated.ts` - Triggers when knowledge base is updated

**History System:**
- Paper analyses → `History/Papers/YYYY-MM/`
- Literature syntheses → `History/Research/YYYY-MM/`
- Citation library → `History/References/`

**Agents:**
- **LiteratureReviewer** - Specialized in paper analysis and synthesis
- **ScientificWriter** - Called for writing literature review sections

**MCP Servers:**
- `pubmed` - PubMed/PMC literature search
- `arxiv` - arXiv preprint server
- `content` - General web content fetching for papers

**External Integration:**
- Zotero (citation management)
- Mendeley (reference manager)
- Connected Papers (citation network visualization)

## Data Format Standards

### Paper Analysis Format
```markdown
# Paper Analysis: [Short Title]

**Citation:** [Full citation]
**DOI/arXiv:** [Identifier]
**Analysis Date:** YYYY-MM-DD
**Analyst:** [Name]

## Metadata
- **Authors:** [Full author list]
- **Journal:** [Journal name]
- **Year:** [Publication year]
- **Article Type:** [Research article, Review, etc.]

## Research Question
[What question does the paper address?]

## Hypothesis
[Stated or implied hypothesis]

## Methods
### Study Design
[Experimental design overview]

### Sample/Population
- **n =** [Sample size]
- **Species/System:** [What was studied]
- **Groups:** [Control and experimental groups]

### Techniques
- [Technique 1]: [Details]
- [Technique 2]: [Details]

### Statistical Analysis
- **Tests used:** [List of statistical tests]
- **Significance threshold:** α = [typically 0.05]
- **Software:** [Statistical software used]

## Results
### Key Findings
1. [Finding 1 with statistics]
2. [Finding 2 with statistics]
3. [Finding 3 with statistics]

### Supporting Data
- [Figure/Table summary]

### Statistical Results
- [Specific test results with p-values and effect sizes]

## Discussion
### Interpretation
[Authors' interpretation of results]

### Comparison to Literature
[How results relate to previous work]

## Limitations
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]

## Relevance to Our Work
[How this paper relates to your lab's research]

## Key Takeaways
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]

## References Cited
[Key papers cited that might be relevant]

## Action Items
- [ ] [Follow-up reading]
- [ ] [Potential experiment to run]
- [ ] [Method to adopt]

---
*Generated by LiteratureReview skill - AnalyzePaper tool*
```

### Literature Synthesis Format
```markdown
# Literature Synthesis: [Topic]

**Date:** YYYY-MM-DD
**Papers Reviewed:** [n]
**Analyst:** [Name]

## Research Question
[What question does this synthesis address?]

## Papers Included
1. [Citation 1]
2. [Citation 2]
3. [Citation 3]
[...]

## Comparison Matrix
| Study | Sample | Method | Key Finding | Effect Size |
|-------|--------|--------|-------------|-------------|
| Study 1 | n=50 | RCT | X increases Y | d=0.8 |
| Study 2 | n=100 | Obs | X increases Y | r=0.6 |
| Study 3 | n=75 | RCT | No effect | d=0.1 |

## Consensus Findings
[What do most/all studies agree on?]

## Discrepancies
[Where do studies disagree?]
- **Discrepancy:** [Description]
- **Possible reasons:** [Methodological differences, etc.]

## Methodological Variations
[How do methods differ across studies?]

## Gaps in Literature
[What hasn't been studied yet?]

## Quality Assessment
- **High quality studies:** [n]
- **Medium quality:** [n]
- **Lower quality:** [n]
- **Common limitations:** [List]

## Synthesis Narrative
[2-3 paragraph synthesis of the literature]

## Implications for Our Research
[How does this inform your lab's work?]

## Recommended Next Steps
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

---
*Generated by LiteratureReview skill - ComparePapers tool*
```

## Best Practices

1. **Always check primary sources** - Don't rely solely on abstract or citations
2. **Assess study quality** - Consider sample size, design, statistical rigor
3. **Note methodological details** - Critical for replication
4. **Track citation networks** - Follow cited and citing papers
5. **Maintain organized notes** - Use consistent format for all papers
6. **Regular literature updates** - Schedule periodic searches for new papers
7. **Cross-reference findings** - Look for convergent evidence across studies
8. **Critical evaluation** - Question assumptions and identify limitations

## Troubleshooting

**Issue:** Can't access full-text paper
**Solution:** Try institutional access, preprint servers, or contact authors directly

**Issue:** Conflicting results across studies
**Solution:** Look for methodological differences, examine effect sizes, consider meta-analysis

**Issue:** Too many search results
**Solution:** Narrow search terms, add filters (date, study type), focus on reviews first

**Issue:** Citation format doesn't match requirements
**Solution:** Specify exact style guide or provide example citation

**Issue:** Methods section lacks detail
**Solution:** Check supplementary materials, contact corresponding author

---

**This skill integrates with your lab workflow to maintain comprehensive knowledge of the scientific literature. All paper analyses are indexed and searchable for future reference.**
