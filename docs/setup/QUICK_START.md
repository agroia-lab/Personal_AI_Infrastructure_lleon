# Auto-Claude Quick Start Guide

**⏱️ Time to complete: 20-30 minutes**

---

## Prerequisites Check

Before starting, verify you have:

```bash
✓ Python 3.12+:    python3 --version
✓ Node.js 24+:     node --version
✓ npm 10+:         npm --version
✓ Git 2.40+:       git --version
✓ Anthropic API key (from console.anthropic.com)
✓ GitHub account (member of target organization)
```

---

## Installation (5 minutes)

### Ubuntu/Linux

```bash
# Download
wget -O /tmp/auto-claude.deb \
  https://github.com/AndyMik90/Auto-Claude/releases/download/v2.7.1/Auto-Claude-2.7.1-linux-amd64.deb

# Install
sudo dpkg -i /tmp/auto-claude.deb
sudo apt-get install -f

# Verify
which auto-claude-ui
# Output: /usr/bin/auto-claude-ui
```

### macOS

```bash
# Download
curl -L -o /tmp/auto-claude.dmg \
  https://github.com/AndyMik90/Auto-Claude/releases/download/v2.7.1/Auto-Claude-2.7.1-mac.dmg

# Install
open /tmp/auto-claude.dmg
# Drag to Applications folder

# Launch
open -a "Auto Claude"
```

---

## GitHub Token Setup (10 minutes)

### Step 1: Create Token

Go to: https://github.com/settings/tokens/new?type=beta

**Critical settings:**
- **Token name:** `Auto-Claude PAI Integration`
- **Resource owner:** ⚠️ **Select your ORGANIZATION** (e.g., `agroia-lab`)
  - **NOT** your personal account!
- **Repository access:** "Only select repositories"
- **Select:** Your forked repository (e.g., `Personal_AI_Infrastructure_lleon`)

### Step 2: Set Permissions

Click "Repositories" tab in Permissions:

| Permission | Level |
|-----------|--------|
| Contents | Read-only |
| Issues | **Read and write** |
| Metadata | Read-only (auto) |

### Step 3: Generate & Copy

- Click "Generate token"
- **IMMEDIATELY COPY** the token (starts with `github_pat_`)
- You'll only see it once!

---

## Auto-Claude Configuration (10 minutes)

### Step 1: Launch Auto-Claude

```bash
# Linux
auto-claude-ui &

# macOS
open -a "Auto Claude"
```

Wait for Python dependencies to install (watch terminal output).

### Step 2: Configure GitHub Integration

1. Open Settings (gear icon)
2. Go to: **Integrations** → **GitHub**
3. Toggle **"Enable GitHub Issues"** to ON
4. Paste your GitHub token in **"Personal Access Token"**
5. Enter **Repository**: `org-name/repo-name`
   - Example: `agroia-lab/Personal_AI_Infrastructure_lleon`
   - ⚠️ **Use exact name** including any suffixes
6. Set **Default Branch**: `main`
7. Optional: Toggle **"Auto-Sync on Load"** to ON

### Step 3: Configure API Keys

1. Go to: **Integrations** → **Claude Auth**
2. Enter your **Anthropic API key** (starts with `sk-ant-`)
3. Optional: Add OpenAI key for memory backend

### Step 4: Verify Connection

Look for **Connection Status** section:

✓ **Success:**
```
Connected to org-name/repo-name
[Repository description]
```

❌ **Failure (404):**
- Check: Token resource owner = organization
- Check: Repository name exact match
- See troubleshooting below

### Step 5: Save

Click **"Save Settings"**

---

## Load Your Project (5 minutes)

1. In Auto-Claude, go to project selector (left sidebar)
2. Click "Select a project..."
3. Browse to your local repository
4. Select the folder
5. Auto-Claude will load the project
6. Check sidebar for **Issues** panel - should show synced GitHub issues

---

## Verification

Run these checks:

```bash
# ✓ Auto-Claude installed
which auto-claude-ui  # Linux
ls /Applications/Auto\ Claude.app  # macOS

# ✓ Configuration exists
ls ~/.config/auto-claude-ui/

# ✓ Project loaded
ls [your-project]/.auto-claude/.env

# ✓ Connection working
# In Auto-Claude GUI: Settings → GitHub → Connection Status should be green
```

---

## Quick Troubleshooting

### Problem: GitHub 404 Error

**Cause:** Token created under personal account instead of organization

**Fix:**
1. Delete current token in GitHub
2. Create new token with **organization as resource owner**
3. Update token in Auto-Claude settings

### Problem: Repository Name Not Working

**Cause:** Name mismatch (e.g., missing suffix)

**Fix:**
- GitHub repo: `agroia-lab/Personal_AI_Infrastructure_lleon`
- Auto-Claude config: Must match exactly ☝️
- Check GitHub URL for exact name

### Problem: No Issues Showing

**Fix:**
1. Verify "Enable GitHub Issues" is ON
2. Check repository has issues created
3. Click refresh icon in Issues panel
4. Enable "Auto-Sync on Load"

### Problem: API Key Not Accepted

**Fix:**
- Verify key format: `sk-ant-api03-...`
- Check key is active at console.anthropic.com
- Try creating new key
- Verify not hitting rate limits

---

## Next Steps

🎉 **Setup Complete!**

Now you can:
1. Create tasks in Auto-Claude
2. Sync with GitHub Issues
3. Let autonomous agents work on tasks
4. Track progress in both Auto-Claude and GitHub

### Learn More

- **Full documentation:** `docs/setup/AUTO_CLAUDE_INSTALLATION.md`
- **Resume work:** `docs/setup/RESUME_PROMPT.md`
- **Auto-Claude guide:** https://github.com/AndyMik90/Auto-Claude

---

## Quick Commands Reference

```bash
# Launch
auto-claude-ui              # Linux
open -a "Auto Claude"       # macOS

# View logs
tail -f ~/.config/auto-claude-ui/debug.log

# Kill if hung
pkill -9 -f auto-claude-ui

# Check process
ps aux | grep auto-claude

# Config location
cd ~/.config/auto-claude-ui/

# Project config
cd [project]/.auto-claude/
cat .env
```

---

## Time-Saving Tips

1. **Create installation script** for multi-machine setup
   - See: `docs/setup/AUTO_CLAUDE_INSTALLATION.md` → "Multi-Computer Setup"

2. **Store GitHub token securely**
   - Use password manager
   - Same token works on multiple machines

3. **Template your .env**
   - Copy working config
   - Replace keys for new projects
   - Keep template in private repo

4. **Automate checks**
   ```bash
   # Save this as check-auto-claude.sh
   #!/bin/bash
   echo "=== Auto-Claude Health Check ==="
   which auto-claude-ui && echo "✓ Installed" || echo "✗ Not installed"
   ps aux | grep -q auto-claude-ui && echo "✓ Running" || echo "✗ Not running"
   [ -d ~/.config/auto-claude-ui ] && echo "✓ Config exists" || echo "✗ No config"
   ```

---

**Need help?** See full documentation: `docs/setup/AUTO_CLAUDE_INSTALLATION.md`

**Questions?** Contact agroia-lab DevOps team

