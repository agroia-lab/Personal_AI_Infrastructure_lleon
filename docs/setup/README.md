# Auto-Claude Setup Documentation

**Documentation for installing and configuring Auto-Claude with agroia-lab infrastructure**

---

## Document Index

| Document | Purpose | Audience | Time Required |
|----------|---------|----------|---------------|
| **[QUICK_START.md](QUICK_START.md)** | Fast installation guide | New users | 20-30 min |
| **[AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)** | Comprehensive setup guide | All users | 1-2 hours (reference) |
| **[RESUME_PROMPT.md](RESUME_PROMPT.md)** | Continue previous work | Returning users | 5 min |
| **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** | System architecture | Technical team | Reference |

---

## Quick Navigation

### 🚀 I want to get started FAST
→ **[QUICK_START.md](QUICK_START.md)**
- Minimal steps to get running
- 20-30 minute setup
- Copy-paste commands

### 📚 I need comprehensive documentation
→ **[AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)**
- Complete installation procedures
- Detailed GitHub integration
- Troubleshooting section
- Multi-computer setup
- Platform-specific notes

### 🔄 I'm resuming previous work
→ **[RESUME_PROMPT.md](RESUME_PROMPT.md)**
- Context templates for continuing work
- Session export format
- Quick reference cards
- Team onboarding checklists

### 🏗️ I want to understand the architecture
→ **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)**
- System components
- Data flow diagrams
- Configuration relationships
- Integration points

---

## Common Tasks

### First-Time Setup

1. Check prerequisites
   ```bash
   python3 --version  # Need 3.12+
   node --version     # Need 24+
   git --version      # Need 2.40+
   ```

2. Follow → **[QUICK_START.md](QUICK_START.md)**

3. If issues, consult → **[AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)** troubleshooting section

### Setting Up New Machine

1. Review → **[AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)** → "Multi-Computer Setup"
2. Use installation script
3. Copy configuration from existing machine
4. Use → **[RESUME_PROMPT.md](RESUME_PROMPT.md)** to restore context

### Troubleshooting

**Common issues:**

| Issue | Quick Fix | Full Reference |
|-------|-----------|----------------|
| GitHub 404 | Recreate token with org as owner | [AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)#github-404-error |
| Won't launch | `pkill -9 -f auto-claude-ui` | [AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)#auto-claude-wont-launch |
| No issues showing | Check "Enable GitHub Issues" toggle | [AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)#repository-not-found |
| API key rejected | Verify format: `sk-ant-api03-...` | [AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)#api-configuration |

**Still stuck?**
→ Full troubleshooting: **[AUTO_CLAUDE_INSTALLATION.md](AUTO_CLAUDE_INSTALLATION.md)** → "Troubleshooting" section

### Team Onboarding

**New team member joining?**

1. Send them → **[QUICK_START.md](QUICK_START.md)**
2. Provide API keys (via secure channel)
3. Use checklist from → **[RESUME_PROMPT.md](RESUME_PROMPT.md)** → "Quick Reference Cards"
4. Verify setup: Settings → GitHub → Connection Status should be green

---

## Setup Workflow

```
┌─────────────────────────────────────────────────────┐
│                  Setup Workflow                     │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────┐
         │ Check Prerequisites      │
         │ (Python, Node, Git)      │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │ Install Auto-Claude      │
         │ (.deb/.dmg)              │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │ Create GitHub Token      │
         │ (org as resource owner)  │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │ Configure Auto-Claude    │
         │ (Paste token, set repo)  │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │ Add API Keys             │
         │ (Anthropic, optional     │
         │  OpenAI)                 │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │ Verify Connection        │
         │ (Green checkmark)        │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │ Load Project             │
         │ (Select local folder)    │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │  ✓ Ready to Work!        │
         └──────────────────────────┘
```

---

## File Locations Reference

### Auto-Claude Installation

| Platform | Location |
|----------|----------|
| **Linux binary** | `/usr/bin/auto-claude-ui` |
| **Linux app** | `/opt/Auto-Claude/` |
| **macOS app** | `/Applications/Auto Claude.app` |

### Configuration

| Type | Location |
|------|----------|
| **User config** | `~/.config/auto-claude-ui/` |
| **Project config** | `[project]/.auto-claude/.env` |
| **Python venv** | `~/.config/auto-claude-ui/python-venv/` |
| **Logs** | `~/.config/auto-claude-ui/logs/` |

### Documentation

| Document | Path |
|----------|------|
| **This README** | `docs/setup/README.md` |
| **Quick start** | `docs/setup/QUICK_START.md` |
| **Full guide** | `docs/setup/AUTO_CLAUDE_INSTALLATION.md` |
| **Resume prompts** | `docs/setup/RESUME_PROMPT.md` |
| **Architecture** | `docs/setup/ARCHITECTURE_DIAGRAM.md` |

---

## Version Information

| Component | Version | Release Date |
|-----------|---------|--------------|
| **Auto-Claude** | 2.7.1 | 2025-12-25 |
| **Documentation** | 1.0 | 2025-12-26 |
| **PAI Framework** | 0.9.1 | 2025-12-04 |

---

## External Resources

### Official Documentation
- **Auto-Claude GitHub**: https://github.com/AndyMik90/Auto-Claude
- **Claude API Docs**: https://docs.anthropic.com/
- **GitHub Fine-grained Tokens**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token

### Get Credentials
- **Anthropic API Keys**: https://console.anthropic.com/settings/keys
- **GitHub Tokens**: https://github.com/settings/tokens
- **OpenAI API Keys**: https://platform.openai.com/api-keys (optional)

### Support
- **Auto-Claude Issues**: https://github.com/AndyMik90/Auto-Claude/issues
- **PAI Issues**: https://github.com/danielmiessler/Personal_AI_Infrastructure/issues
- **agroia-lab Internal**: [Contact DevOps team]

---

## Quick Commands

### Check Installation
```bash
# Verify Auto-Claude installed
which auto-claude-ui  # Linux
ls /Applications/Auto\ Claude.app  # macOS

# Check version
auto-claude-ui --version  # If supported
```

### Launch
```bash
# Linux
auto-claude-ui &

# macOS
open -a "Auto Claude"
```

### Debug
```bash
# View logs
tail -f ~/.config/auto-claude-ui/debug.log

# Check process
ps aux | grep auto-claude

# Kill if hung
pkill -9 -f auto-claude-ui
```

### Verify GitHub Connection
```bash
# Test your GitHub token
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/agroia-lab/Personal_AI_Infrastructure_lleon

# Should return repository JSON, not 404
```

---

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|---------|
| 1.0 | 2025-12-26 | Initial documentation suite | agroia-lab |

---

## Contributing

To update this documentation:

1. Edit relevant .md files in `docs/setup/`
2. Update version numbers in this README
3. Test all procedures on clean install
4. Commit with descriptive message
5. Push to `agroia-lab/Personal_AI_Infrastructure_lleon`

**Maintainers:** agroia-lab DevOps Team

---

## License

This documentation is part of the Personal AI Infrastructure project (MIT License).

Auto-Claude is developed by AndyMik90 and is subject to its own license.

---

**Last Updated:** 2025-12-26
**Next Review:** 2026-01-26

