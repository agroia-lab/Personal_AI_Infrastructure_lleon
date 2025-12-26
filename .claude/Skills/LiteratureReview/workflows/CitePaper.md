# Cite Paper Workflow

## Purpose
Generate properly formatted citations using GenerateCitation.ts for various citation styles.

## Usage
```
Use GenerateCitation.ts to format citations in required style
```

## Input
- Paper identifier (DOI, PubMed ID, or arXiv ID)
- Citation style (APA, MLA, Chicago, Vancouver, etc.)
- Citation format (inline, bibliography entry, BibTeX)

## Process
1. Fetch paper metadata
2. Extract citation elements (authors, title, journal, year, etc.)
3. Apply specified citation style formatting
4. Generate inline and bibliography formats
5. Create BibTeX entry if requested

## Output
- Formatted citation in requested style
- Inline citation format
- Full bibliography entry
- BibTeX entry (optional)

## Related Workflows
- AnalyzePaper.md - Get paper details
- UpdateKnowledgeBase.md - Save citation library
