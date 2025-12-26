# Auto-Claude Setup - Conversation Resume Prompt

Use this prompt when resuming work on Auto-Claude setup after a break, on a new machine, or in a new terminal session.

---

## Standard Resume Prompt

Copy and paste this into your new Claude Code session:

```
I'm working on the Auto-Claude installation and configuration for agroia-lab's Personal AI Infrastructure project. This is a continuation of a previous conversation. Here's the complete context:

**Project Overview:**
- Repository: agroia-lab/Personal_AI_Infrastructure_lleon (GitHub)
- Local path: /home/malezainia1/dev/Personal_AI_Infrastructure (or equivalent on this machine)
- Purpose: Personal AI Infrastructure using PAI framework + Auto-Claude autonomous development
- Organization: agroia-lab

**Current Environment:**
- OS: [Ubuntu 24.04 / macOS Sonoma / Other]
- Auto-Claude version: 2.7.1
- Python: 3.12+
- Node.js: 24+
- Git: 2.40+

**Installation Status:**
✓ Completed:
- Auto-Claude installed (/opt/Auto-Claude on Linux, /Applications on macOS)
- GitHub integration configured
- Fine-grained personal access token created (resource owner: agroia-lab)
- Repository connected: agroia-lab/Personal_AI_Infrastructure_lleon
- Anthropic API key configured
- Default branch: main
- GitHub Issues sync: enabled

⏸ In Progress:
- [Describe what you were working on]

❓ Pending:
- [List remaining tasks]

**Configuration Details:**
- App location: /opt/Auto-Claude/ (Linux) or /Applications/Auto Claude.app (macOS)
- Config directory: ~/.config/auto-claude-ui/
- Project .auto-claude/.env: Configured with API keys
- GitHub PAT: Stored in Auto-Claude settings
- Permissions: Issues (Read+Write), Contents (Read-only)

**Documentation Reference:**
All setup procedures are documented in:
- Main guide: docs/setup/AUTO_CLAUDE_INSTALLATION.md
- This resume prompt: docs/setup/RESUME_PROMPT.md

**Current Task:**
[Describe specifically what you need to do now]

**Question/Issue:**
[If troubleshooting, describe the problem]

Please help me continue from where we left off. Reference the documentation in docs/setup/ as needed.
```

---

## Quick Context for Specific Tasks

### Task: Setting Up New Machine

```
I need to replicate the Auto-Claude setup from our Ubuntu workstation to a new [Ubuntu/macOS] machine.

Reference setup:
- Documented in docs/setup/AUTO_CLAUDE_INSTALLATION.md
- Original machine: Ubuntu 24.04
- Target machine: [OS and version]
- Same GitHub org: agroia-lab
- Same repository: Personal_AI_Infrastructure_lleon

I have:
- GitHub account access (member of agroia-lab)
- Anthropic API key
- Access to create organization PATs

Please guide me through the installation following the multi-computer setup section in our documentation.
```

### Task: Troubleshooting GitHub Integration

```
I'm troubleshooting Auto-Claude GitHub integration issues.

Setup:
- Auto-Claude 2.7.1 on [OS]
- Organization: agroia-lab
- Repository: agroia-lab/Personal_AI_Infrastructure_lleon

Issue:
[Describe the specific error, e.g., "Getting 404 Not Found when testing connection"]

What I've tried:
- [List troubleshooting steps already attempted]

Error details:
```
[Paste error message]
```

Reference: docs/setup/AUTO_CLAUDE_INSTALLATION.md (Troubleshooting section)

Please help diagnose and fix this issue.
```

### Task: Creating GitHub Token for Another Team Member

```
I need to help a new team member create a GitHub fine-grained token for Auto-Claude.

Context:
- New member: [Name]
- GitHub username: [username]
- Organization: agroia-lab
- Repository: Personal_AI_Infrastructure_lleon
- They need: Issues (Read+Write), Contents (Read-only)

The critical point I need to emphasize:
- Resource owner MUST be "agroia-lab" (not personal account)
- Repository selection must exactly match name including suffix

Please provide step-by-step instructions I can send them, referencing docs/setup/AUTO_CLAUDE_INSTALLATION.md section "GitHub Integration Setup".
```

### Task: Updating Configuration

```
I need to update Auto-Claude configuration for:
[Select one or describe:]
- [ ] Different repository
- [ ] New API key
- [ ] Additional integrations (Linear, etc.)
- [ ] Model settings
- [ ] Memory backend configuration

Current state:
- Auto-Claude working correctly
- Want to change: [specific setting]
- Current value: [what it is now]
- Desired value: [what you want]

Reference: docs/setup/AUTO_CLAUDE_INSTALLATION.md (API Configuration section)

Please guide me through updating this configuration safely.
```

---

## Platform-Specific Resume Prompts

### Ubuntu/Linux

```
**Platform: Ubuntu 24.04 LTS**

Installation paths:
- Binary: /usr/bin/auto-claude-ui
- Application: /opt/Auto-Claude/
- Config: ~/.config/auto-claude-ui/
- Logs: ~/.config/auto-claude-ui/logs/

Commands used:
- Launch: `auto-claude-ui &`
- Logs: `tail -f ~/.config/auto-claude-ui/debug.log`
- Process: `ps aux | grep auto-claude-ui`

[Continue with standard resume prompt above]
```

### macOS

```
**Platform: macOS [Sonoma/Ventura/etc.]**

Installation paths:
- Application: /Applications/Auto Claude.app
- Config: ~/.config/auto-claude-ui/
- Logs: ~/.config/auto-claude-ui/logs/

Commands used:
- Launch: `open -a "Auto Claude"`
- Logs: `tail -f ~/.config/auto-claude-ui/debug.log`
- Process: `ps aux | grep "Auto Claude"`

Special considerations:
- Gatekeeper permissions granted
- Added to PATH if using CLI

[Continue with standard resume prompt above]
```

---

## Conversation Export Template

When ending a session, export context using this format:

```markdown
# Auto-Claude Setup Session Export
**Date:** [YYYY-MM-DD]
**Duration:** [X hours]
**Participants:** [Names]

## Session Summary
[Brief description of what was accomplished]

## Completed Tasks
- [x] Task 1
- [x] Task 2
- [x] Task 3

## In Progress
- [ ] Task 4 (Status: 60% - blocked by X)
- [ ] Task 5 (Status: Started, need to Y)

## Pending Tasks
- [ ] Task 6
- [ ] Task 7

## Issues Encountered
1. **Issue:** [Description]
   - **Solution:** [How it was resolved]
   - **Reference:** [Doc section or link]

2. **Issue:** [Description]
   - **Status:** Unresolved
   - **Next steps:** [What to try next]

## Configuration Changes
- Changed: [Setting X] from [old value] to [new value]
- Added: [New configuration Y]
- Removed: [Deprecated setting Z]

## Key Learnings
- [Important insight 1]
- [Important insight 2]
- [Gotcha to remember]

## Next Session Priorities
1. [Priority task 1]
2. [Priority task 2]
3. [Priority task 3]

## Files Modified
- `docs/setup/AUTO_CLAUDE_INSTALLATION.md` - [Changes made]
- `.auto-claude/.env` - [Configuration updates]
- [Other files]

## Resume Prompt
Use the standard resume prompt from `docs/setup/RESUME_PROMPT.md` with these specifics:
- Current task: [X]
- Blocked on: [Y]
- Next action: [Z]
```

---

## Quick Reference Cards

### For Team Onboarding

**New Team Member Setup Checklist:**

```
□ 1. Verify prerequisites (Python 3.12+, Node 24+, Git)
□ 2. Get Anthropic API key from team lead
□ 3. Install Auto-Claude:
     Ubuntu: sudo dpkg -i Auto-Claude-2.7.1-linux-amd64.deb
     macOS: Install from Auto-Claude-2.7.1-mac.dmg
□ 4. Launch Auto-Claude (auto-claude-ui or Applications)
□ 5. Create GitHub fine-grained token:
     - Go to: github.com/settings/tokens/new?type=beta
     - Resource owner: agroia-lab ⚠️ IMPORTANT
     - Repository: Personal_AI_Infrastructure_lleon
     - Permissions: Issues (RW), Contents (R)
□ 6. Configure Auto-Claude:
     Settings → Integrations → GitHub
     - Paste token
     - Repository: agroia-lab/Personal_AI_Infrastructure_lleon
     - Default branch: main
□ 7. Add API keys:
     Settings → Integrations → Claude Auth
     - CLAUDE_CODE_OAUTH_TOKEN: [from team lead]
□ 8. Test connection:
     - Should see green checkmark
     - Issues panel should show GitHub issues
□ 9. Clone project locally
□ 10. Load project in Auto-Claude

Estimated time: 30-45 minutes
Reference doc: docs/setup/AUTO_CLAUDE_INSTALLATION.md
```

### For Quick Troubleshooting

**Common Issues Quick Fix:**

```
Issue: 404 GitHub Error
Fix: Verify resource owner is "agroia-lab" not personal account
     Recreate token with correct owner

Issue: Can't see Issues panel
Fix: Check "Enable GitHub Issues" toggle is ON
     Verify repository name exactly matches (including _lleon)

Issue: API key not working
Fix: Verify key format: sk-ant-api03-...
     Check key is active in console.anthropic.com

Issue: Auto-Claude won't launch
Fix: Kill hung process: pkill -9 -f auto-claude-ui
     Check logs: ~/.config/auto-claude-ui/logs/
     Reinstall if corrupted

Issue: Dependencies fail
Fix: Manually install: cd ~/.config/auto-claude-ui/python-venv
     source bin/activate
     pip install -r /opt/Auto-Claude/resources/auto-claude/requirements.txt
```

---

## Advanced: CI/CD Integration Context

```
I'm setting up CI/CD integration for Auto-Claude in our agroia-lab infrastructure.

Context:
- Organization: agroia-lab
- Repository: Personal_AI_Infrastructure_lleon
- CI Platform: [GitHub Actions / GitLab CI / Jenkins]
- Goal: [Automated testing / Deployment / Other]

Current Auto-Claude setup:
- Runs locally on developer machines
- GitHub integration working
- Need to: [Describe CI/CD requirement]

Reference:
- docs/setup/AUTO_CLAUDE_INSTALLATION.md
- Permissions matrix for CI/CD workflows

Please help design the CI/CD integration strategy.
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-26 | Initial resume prompt template |

---

**Next Update:** Add templates for specific agroia-lab workflows

