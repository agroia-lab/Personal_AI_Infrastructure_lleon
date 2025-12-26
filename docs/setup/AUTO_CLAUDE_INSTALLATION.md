# Auto-Claude Installation and Configuration Guide

**Version:** 1.0
**Last Updated:** December 26, 2025
**Author:** agroia-lab
**Target Systems:** Ubuntu 24.04+, macOS

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [GitHub Integration Setup](#github-integration-setup)
5. [API Configuration](#api-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Multi-Computer Setup](#multi-computer-setup)

---

## Overview

Auto-Claude is an autonomous multi-agent coding framework that automates software development. This guide covers installation on Ubuntu/Linux and macOS systems, with specific focus on integration with organizational GitHub repositories.

### What Auto-Claude Does

- **Multi-agent coordination**: Plans, builds, and validates software autonomously
- **Parallel execution**: Multiple agent terminals working simultaneously
- **Git worktree isolation**: Protects main branch with isolated environments
- **GitHub Issues integration**: Syncs tasks and tracks progress
- **Memory backend**: Optional Graphiti integration for context retention

---

## Prerequisites

### System Requirements

✓ **Python 3.12+**
✓ **Node.js 24+**
✓ **npm 10+**
✓ **Git 2.40+**
✓ **Claude Code CLI** (comes with Claude Pro/Max or API access)

### Required Accounts/Credentials

1. **Anthropic API Key** or **Claude Pro/Max subscription**
   - Get API key from: https://console.anthropic.com/
   - Or subscribe at: https://claude.ai/upgrade

2. **GitHub Account** with organization access
   - Must be member of target organization
   - Must have permission to create fine-grained tokens for organization

### Check Installed Versions

```bash
# Verify prerequisites
python3 --version  # Should be 3.12+
node --version     # Should be v24+
npm --version      # Should be 10+
git --version      # Should be 2.40+
which claude-code  # Should return path (if using Claude Code CLI)
```

---

## Installation Steps

### Step 1: Download Auto-Claude

#### Ubuntu/Linux

```bash
# Download the .deb package
cd /tmp
wget -O Auto-Claude-2.7.1-linux-amd64.deb \
  https://github.com/AndyMik90/Auto-Claude/releases/download/v2.7.1/Auto-Claude-2.7.1-linux-amd64.deb

# Install the package
sudo dpkg -i Auto-Claude-2.7.1-linux-amd64.deb

# Fix any dependency issues
sudo apt-get install -f

# Verify installation
which auto-claude-ui
# Should output: /usr/bin/auto-claude-ui

# Check installation directory
ls -la /opt/Auto-Claude/
```

**Installed Locations:**
- Binary: `/usr/bin/auto-claude-ui`
- Application: `/opt/Auto-Claude/`
- Config: `~/.config/auto-claude-ui/`

#### macOS

```bash
# Download the .dmg file
curl -L -o Auto-Claude-2.7.1-mac.dmg \
  https://github.com/AndyMik90/Auto-Claude/releases/download/v2.7.1/Auto-Claude-2.7.1-mac.dmg

# Open the DMG and drag to Applications
open Auto-Claude-2.7.1-mac.dmg

# After installation, launch from Applications
open -a "Auto Claude"
```

### Step 2: First Launch

```bash
# Ubuntu/Linux
auto-claude-ui &

# macOS - launch from Applications folder or:
open -a "Auto Claude"
```

**What happens on first launch:**
1. Python virtual environment is created at `~/.config/auto-claude-ui/python-venv/`
2. Dependencies are installed automatically
3. GUI opens showing welcome screen
4. You may see update check errors (404) - these are harmless

**Wait for:** Background process installing Python dependencies (watch terminal output)

### Step 3: Initial Configuration

When the GUI opens:

1. Go to **Settings** (gear icon)
2. Navigate through each section:
   - **Appearance**: Set theme preferences
   - **Agent Settings**: Configure default model (claude-opus-4-5-20251101 recommended)
   - **Paths**: Verify Python and framework paths
   - **Integrations**: Configure API keys and GitHub (see next section)

---

## GitHub Integration Setup

### Overview

GitHub integration allows Auto-Claude to:
- Sync issues from your repository
- Create tasks automatically from GitHub Issues
- Track progress back to GitHub
- Branch from your default branch for isolated work

### Step-by-Step Configuration

#### Part 1: Create GitHub Personal Access Token (PAT)

**IMPORTANT:** When working with **organization repositories**, the token must be created with the **organization as the resource owner**.

##### 1. Navigate to Token Creation

- Go to: https://github.com/settings/tokens/new?type=beta
- Or: GitHub → Profile → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token

##### 2. Configure Token Details

```
Token name: Auto-Claude PAI Integration
Description: Token for Auto-Claude to access agroia-lab repositories
```

##### 3. Set Resource Owner

**CRITICAL STEP:**

```
Resource owner: [Select your organization, e.g., "agroia-lab"]
```

⚠️ **Common Mistake:** Selecting personal account instead of organization causes 404 errors!

##### 4. Set Expiration

```
Expiration: 30 days (Jan 25, 2026)
```

*Note: You'll need to regenerate after expiration*

##### 5. Configure Repository Access

Select: **"Only select repositories"**

Click "Select repositories" and choose:
```
agroia-lab/Personal_AI_Infrastructure_lleon
```

*Note: Match the exact repository name including any suffixes*

##### 6. Set Permissions

Under **Repository permissions**, add:

| Permission | Access Level | Reason |
|------------|--------------|---------|
| **Contents** | Read-only | Access repository files |
| **Issues** | **Read and write** | Create and sync issues |
| **Metadata** | Read-only | Required (automatic) |

**Visualization:**

```
Repositories (3 permissions)
├── Contents      [Read-only]
├── Issues        [Read and write]  ← Must be write!
└── Metadata      [Read-only] (Required)
```

##### 7. Generate Token

- Click **"Generate token"**
- **IMMEDIATELY COPY THE TOKEN** - starts with `github_pat_` or `ghp_`
- Store securely - you'll only see it once!

Example token format:
```
github_pat_11ALM7XRI0r2cCkfy218N_IPEG...
```

#### Part 2: Configure Auto-Claude

##### 1. Open Settings

In Auto-Claude GUI:
- Click **Settings** (gear icon)
- Select **Integrations** from left sidebar
- Scroll to **GitHub** section

##### 2. Enable GitHub Issues

Toggle **"Enable GitHub Issues"** to ON

##### 3. Enter Personal Access Token

Paste the token you generated:
```
Personal Access Token: github_pat_11ALM7XRI0r2cCkfy218N_IPEG...
```

##### 4. Configure Repository

Enter repository in format `owner/repo`:

```
Repository: agroia-lab/Personal_AI_Infrastructure_lleon
```

⚠️ **Common Mistake:** Using generic name instead of actual repository name
- ❌ Wrong: `agroia-lab/Personal_AI_Infrastructure`
- ✓ Correct: `agroia-lab/Personal_AI_Infrastructure_lleon`

##### 5. Set Default Branch

```
Default Branch: main
```

This is the branch Auto-Claude will branch from when creating task worktrees.

##### 6. Configure Auto-Sync (Optional)

Toggle **"Auto-Sync on Load"** to:
- **ON**: Fetch issues automatically when project loads
- **OFF**: Manual sync only

Recommended: **ON** for active projects

##### 7. Verify Connection

After entering details, look for **Connection Status**:

✓ **Success:**
```
Connection Status
Connected to agroia-lab/Personal_AI_Infrastructure_lleon
Personal AI Infrastructure for upgrading lab operation
```

❌ **Failure:**
```
Connection Status
GitHub API error: 404 Not Found
```

**If 404 error**, verify:
1. Token was created with organization as resource owner
2. Repository name exactly matches (including suffixes)
3. Token has Issues read/write permission
4. Repository is accessible to your account

##### 8. Save Settings

Click **"Save Settings"** button

### Verification

After saving:

1. Close and reopen Auto-Claude
2. Load your project
3. Check sidebar for **Issues** panel
4. Should show synced GitHub issues (if any exist)

---

## API Configuration

### Claude API Key Setup

#### Where to Configure

Settings → **Integrations** → **API Keys** section

#### Required for Core Functionality

```bash
# Primary authentication (REQUIRED)
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-api03-...
```

**How to get:**
1. Go to: https://console.anthropic.com/settings/keys
2. Click **"Create Key"**
3. Name it: `auto-claude-agroia-lab`
4. Copy the key (starts with `sk-ant-`)
5. Paste into Auto-Claude settings

#### Optional: Memory Backend (Graphiti)

For semantic memory/embeddings, configure OpenAI key:

```bash
# Optional - for Graphiti memory backend
OPENAI_API_KEY=sk-...
```

**Get from:** https://platform.openai.com/api-keys

**Alternative:** Use Ollama (local, free) instead
```bash
GRAPHITI_EMBEDDER_PROVIDER=ollama
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
OLLAMA_EMBEDDING_DIM=768
```

### Environment Variables (.env file)

Auto-Claude stores configuration in project `.auto-claude/.env`:

```bash
# Location
~/.config/auto-claude-ui/[project-name]/.auto-claude/.env

# Or in project directory
/path/to/your/project/.auto-claude/.env
```

**Example configuration:**

```bash
# Claude Authentication
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-api03-YOUR_KEY

# Model Override (optional)
AUTO_BUILD_MODEL=claude-opus-4-5-20251101

# GitHub Integration (configured via UI)
GITHUB_TOKEN=github_pat_YOUR_TOKEN
GITHUB_REPO=agroia-lab/Personal_AI_Infrastructure_lleon
DEFAULT_BRANCH=main

# Memory Backend (optional)
GRAPHITI_ENABLED=true
OPENAI_API_KEY=sk-YOUR_OPENAI_KEY
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. GitHub 404 Error

**Symptom:**
```
Connection Status
GitHub API error: 404 Not Found
```

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Token created under personal account | Recreate token with organization as resource owner |
| Repository name mismatch | Verify exact repository name (including suffixes like `_lleon`) |
| Missing permissions | Ensure Issues has "Read and write" access |
| Organization policy blocks tokens | Check org settings: Settings → Personal access tokens → Allow fine-grained tokens |

**Verification Steps:**

```bash
# Test token with curl
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/agroia-lab/Personal_AI_Infrastructure_lleon

# Should return repository JSON, not 404
```

#### 2. Python Dependencies Fail to Install

**Symptom:**
```
[PythonEnvManager] Failed to install dependencies
```

**Solutions:**

```bash
# Check Python version
python3 --version  # Must be 3.12+

# Manual dependency installation
cd ~/.config/auto-claude-ui/python-venv
source bin/activate
pip install -r /opt/Auto-Claude/resources/auto-claude/requirements.txt

# Check for errors in specific packages
```

#### 3. Auto-Claude Won't Launch

**Symptom:** Application fails to start or crashes immediately

**Solutions:**

```bash
# Ubuntu: Check logs
journalctl --user -u auto-claude-ui
# Or
~/.config/auto-claude-ui/logs/

# Kill existing processes
pkill -f auto-claude-ui

# Launch with debug output
auto-claude-ui --verbose

# Check for port conflicts
netstat -tulpn | grep 3456  # Default port
```

#### 4. Repository Not Found in Auto-Claude

**Symptom:** Can't select or load your project

**Solutions:**

1. Verify repository is cloned locally
2. Check `.auto-claude/` directory exists in project
3. Re-run setup wizard: Settings → Re-run Wizard

```bash
# Verify project structure
ls -la /path/to/your/project/.auto-claude/
# Should contain: .env, ideation/, insights/, roadmap/, specs/
```

#### 5. API Rate Limits

**Symptom:**
```
Error: Rate limit exceeded
```

**Solutions:**

- Wait for rate limit reset (check response headers)
- Use multiple API keys and rotate
- Reduce auto-sync frequency
- Use caching (Graphiti memory) to reduce API calls

### Debug Mode

Enable detailed logging:

**Via GUI:**
Settings → General → Debug Mode → Enable

**Via .env:**
```bash
DEBUG=true
DEBUG_LEVEL=3  # 1=basic, 2=detailed, 3=verbose
DEBUG_LOG_FILE=auto-claude/debug.log
```

**View logs:**
```bash
tail -f ~/.config/auto-claude-ui/debug.log
```

---

## Multi-Computer Setup

### Scenario: Replicate Setup Across Machines

You need Auto-Claude on:
- Ubuntu workstation (primary)
- Ubuntu laptop (secondary)
- MacBook Pro (portable)

### Approach 1: Shared Configuration Repository

**1. Store Credentials Securely**

Create a private config repository:

```bash
# On primary machine
mkdir ~/auto-claude-configs
cd ~/auto-claude-configs

# Copy credentials (DO NOT COMMIT KEYS TO PUBLIC REPOS!)
cp ~/.config/auto-claude-ui/[project]/.auto-claude/.env ./env.template

# Edit template - replace actual keys with placeholders
nano env.template
```

**env.template example:**
```bash
# Claude Authentication
CLAUDE_CODE_OAUTH_TOKEN=__ANTHROPIC_KEY_HERE__

# GitHub Integration
GITHUB_TOKEN=__GITHUB_PAT_HERE__
GITHUB_REPO=agroia-lab/Personal_AI_Infrastructure_lleon
DEFAULT_BRANCH=main

# Memory Backend
GRAPHITI_ENABLED=true
OPENAI_API_KEY=__OPENAI_KEY_HERE__
```

**2. Store in Private Repo**

```bash
# Initialize private config repo
git init
echo "# Auto-Claude Configuration Templates" > README.md
echo ".env" >> .gitignore  # Never commit actual keys!
echo "*.key" >> .gitignore

git add .
git commit -m "Add Auto-Claude config templates"

# Push to private GitHub repo
git remote add origin git@github.com:agroia-lab/auto-claude-configs-private.git
git push -u origin main
```

**3. On New Machine**

```bash
# Clone config repo
git clone git@github.com:agroia-lab/auto-claude-configs-private.git
cd auto-claude-configs-private

# Copy template and fill in actual keys
cp env.template .env
nano .env  # Add real API keys

# Copy to Auto-Claude project
cp .env ~/.config/auto-claude-ui/[project]/.auto-claude/.env
```

### Approach 2: Manual Installation Script

Create a setup script for quick installation:

**install-auto-claude.sh:**

```bash
#!/bin/bash
# Auto-Claude Installation Script
# Usage: ./install-auto-claude.sh

set -e

echo "=== Auto-Claude Installation Script ==="
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    PKG_URL="https://github.com/AndyMik90/Auto-Claude/releases/download/v2.7.1/Auto-Claude-2.7.1-linux-amd64.deb"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    PKG_URL="https://github.com/AndyMik90/Auto-Claude/releases/download/v2.7.1/Auto-Claude-2.7.1-mac.dmg"
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

echo "Detected OS: $OS"
echo ""

# Check prerequisites
echo "Checking prerequisites..."
command -v python3 >/dev/null 2>&1 || { echo "Python 3 required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js required but not installed. Aborting." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git required but not installed. Aborting." >&2; exit 1; }

PYTHON_VERSION=$(python3 --version | awk '{print $2}')
NODE_VERSION=$(node --version | sed 's/v//')
GIT_VERSION=$(git --version | awk '{print $3}')

echo "✓ Python: $PYTHON_VERSION"
echo "✓ Node.js: $NODE_VERSION"
echo "✓ Git: $GIT_VERSION"
echo ""

# Download and install
echo "Downloading Auto-Claude..."
cd /tmp

if [[ "$OS" == "linux" ]]; then
    wget -O auto-claude.deb "$PKG_URL"
    echo "Installing..."
    sudo dpkg -i auto-claude.deb
    sudo apt-get install -f -y
    echo "✓ Auto-Claude installed to /opt/Auto-Claude"
elif [[ "$OS" == "macos" ]]; then
    curl -L -o auto-claude.dmg "$PKG_URL"
    echo "Opening DMG - please drag to Applications folder"
    open auto-claude.dmg
    echo "Waiting for installation..."
    sleep 10
fi

echo ""
echo "=== Installation Complete ==="
echo ""
echo "Next steps:"
echo "1. Launch Auto-Claude: auto-claude-ui (Linux) or from Applications (macOS)"
echo "2. Go to Settings → Integrations"
echo "3. Configure GitHub token and repository"
echo "4. Add your Anthropic API key"
echo ""
echo "See documentation: docs/setup/AUTO_CLAUDE_INSTALLATION.md"
```

Make executable and run:

```bash
chmod +x install-auto-claude.sh
./install-auto-claude.sh
```

### Platform-Specific Notes

#### Ubuntu Additional Setup

```bash
# If AppArmor issues
sudo aa-disable /opt/Auto-Claude/auto-claude-ui

# Desktop shortcut
cat > ~/.local/share/applications/auto-claude.desktop <<EOF
[Desktop Entry]
Name=Auto Claude
Comment=Autonomous AI Development Framework
Exec=/usr/bin/auto-claude-ui
Icon=/opt/Auto-Claude/resources/icon.ico
Terminal=false
Type=Application
Categories=Development;
EOF
```

#### macOS Additional Setup

```bash
# Allow execution if blocked by Gatekeeper
xattr -d com.apple.quarantine /Applications/Auto\ Claude.app

# Add to PATH (if using terminal)
echo 'export PATH="/Applications/Auto Claude.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

## Resuming Work: Conversation Context Prompt

When starting work on a new computer or after a break, use this prompt to quickly resume:

```
I'm working on the Auto-Claude installation and configuration for agroia-lab's Personal AI Infrastructure project. Here's our current state:

**Environment:**
- OS: [Ubuntu 24.04 / macOS]
- Auto-Claude version: 2.7.1
- Project: Personal_AI_Infrastructure (forked to agroia-lab)

**Completed:**
- ✓ Auto-Claude installed at /opt/Auto-Claude (Linux) or /Applications (macOS)
- ✓ GitHub integration configured with fine-grained token
- ✓ Repository: agroia-lab/Personal_AI_Infrastructure_lleon
- ✓ API keys configured in Settings → Integrations
- ✓ Default branch: main

**Configuration locations:**
- App: /opt/Auto-Claude/ (Linux) or /Applications/Auto Claude.app (macOS)
- Config: ~/.config/auto-claude-ui/
- Project: /home/malezainia1/dev/Personal_AI_Infrastructure

**Current task:**
[Describe what you're working on]

**Question/Issue:**
[Describe what you need help with]

Please help me [continue/troubleshoot/configure] based on the documentation in docs/setup/AUTO_CLAUDE_INSTALLATION.md
```

---

## Quick Reference

### Essential Commands

```bash
# Launch Auto-Claude
auto-claude-ui              # Linux
open -a "Auto Claude"       # macOS

# Check installation
which auto-claude-ui
ls -la /opt/Auto-Claude/    # Linux
ls -la /Applications/Auto\ Claude.app  # macOS

# View logs
tail -f ~/.config/auto-claude-ui/debug.log

# Check running processes
ps aux | grep auto-claude

# Kill hung process
pkill -9 -f auto-claude-ui
```

### Configuration File Locations

| Item | Location |
|------|----------|
| Application (Linux) | `/opt/Auto-Claude/` |
| Application (macOS) | `/Applications/Auto Claude.app` |
| User config | `~/.config/auto-claude-ui/` |
| Project config | `[project]/.auto-claude/.env` |
| Python venv | `~/.config/auto-claude-ui/python-venv/` |
| Logs | `~/.config/auto-claude-ui/logs/` |

### API Endpoints

| Service | Endpoint |
|---------|----------|
| Anthropic Console | https://console.anthropic.com/ |
| GitHub PAT | https://github.com/settings/tokens |
| OpenAI Keys | https://platform.openai.com/api-keys |

### GitHub Token Permissions Matrix

| Use Case | Contents | Issues | PRs | Workflows |
|----------|----------|--------|-----|-----------|
| Basic sync | Read | Read | - | - |
| Full integration | Read | Read+Write | Read | - |
| CI/CD | Read | Read+Write | Read+Write | Read+Write |

**Our setup:** Contents (Read) + Issues (Read+Write)

---

## Appendix: Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Auto-Claude System                      │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Electron   │  │   Python     │  │  Claude API  │
    │   Frontend   │  │   Backend    │  │   (Anthropic)│
    │   (GUI)      │  │   (Agents)   │  │              │
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                 │
           │                 │                 │
           │        ┌────────┴────────┐        │
           │        │                 │        │
           ▼        ▼                 ▼        ▼
    ┌──────────────────────────────────────────────┐
    │           Project Workspace                  │
    │                                              │
    │  ┌────────────────┐    ┌──────────────────┐ │
    │  │ Git Worktrees  │    │  .auto-claude/   │ │
    │  │ (Isolated      │◄──►│  - .env          │ │
    │  │  branches)     │    │  - ideation/     │ │
    │  └────────────────┘    │  - insights/     │ │
    │                        │  - roadmap/      │ │
    │                        │  - specs/        │ │
    │                        └──────────────────┘ │
    └──────────────┬───────────────────────────────┘
                   │
                   │ GitHub API
                   │
                   ▼
    ┌──────────────────────────────┐
    │   GitHub Repository          │
    │   agroia-lab/Personal_AI_... │
    │                              │
    │   - Issues (synced)          │
    │   - Branches                 │
    │   - Pull Requests            │
    └──────────────────────────────┘
```

### Configuration Flow

```
User Setup
    │
    ├─► 1. Install Auto-Claude
    │       ├─ Download .deb/.dmg
    │       ├─ Install package
    │       └─ Launch application
    │
    ├─► 2. Create GitHub Token
    │       ├─ Select organization as owner
    │       ├─ Choose repository
    │       ├─ Set permissions (Issues: RW)
    │       └─ Generate & copy token
    │
    ├─► 3. Configure Auto-Claude
    │       ├─ Open Settings → Integrations
    │       ├─ Paste GitHub token
    │       ├─ Enter repository name
    │       ├─ Add Anthropic API key
    │       └─ Save settings
    │
    └─► 4. Verify & Start
            ├─ Check connection status
            ├─ Load project
            ├─ Sync GitHub issues
            └─ Begin development
```

---

## Support and Resources

### Official Documentation
- Auto-Claude GitHub: https://github.com/AndyMik90/Auto-Claude
- Claude API Docs: https://docs.anthropic.com/
- GitHub API: https://docs.github.com/en/rest

### agroia-lab Internal
- This documentation: `docs/setup/AUTO_CLAUDE_INSTALLATION.md`
- Project repository: https://github.com/agroia-lab/Personal_AI_Infrastructure_lleon
- Configuration templates: [Internal config repo]

### Getting Help

1. **Check troubleshooting section** in this document
2. **Review debug logs**: `~/.config/auto-claude-ui/logs/`
3. **GitHub Issues**: https://github.com/AndyMik90/Auto-Claude/issues
4. **Internal team**: Contact agroia-lab DevOps team

---

**Document Version:** 1.0
**Last Updated:** 2025-12-26
**Maintainer:** agroia-lab DevOps Team

