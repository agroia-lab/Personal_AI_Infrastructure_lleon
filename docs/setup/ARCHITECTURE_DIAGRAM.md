# Auto-Claude System Architecture

**Visual reference for Auto-Claude system components, data flow, and integrations**

---

## High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Auto-Claude Ecosystem                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
   │   Frontend    │     │   Backend     │     │  External     │
   │   (Electron)  │◄───►│   (Python)    │◄───►│  Services     │
   │               │     │               │     │               │
   │  - GUI        │     │  - Agents     │     │  - Claude API │
   │  - Settings   │     │  - Workflows  │     │  - GitHub API │
   │  - Dashboard  │     │  - Memory     │     │  - Git        │
   └───────────────┘     └───────────────┘     └───────────────┘
           │                      │                      │
           └──────────────────────┼──────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   Project Workspace     │
                    │                         │
                    │  - Source Code          │
                    │  - Git Worktrees        │
                    │  - .auto-claude/        │
                    │  - Build Artifacts      │
                    └─────────────────────────┘
```

---

## Detailed Component Architecture

### 1. Frontend Layer (Electron + TypeScript)

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Main UI    │  │   Settings   │  │  Observability  │  │
│  │              │  │              │  │   Dashboard     │  │
│  │ - Projects   │  │ - Appearance │  │                 │  │
│  │ - Issues     │  │ - Agents     │  │ - Live metrics  │  │
│  │ - Tasks      │  │ - API Keys   │  │ - Event stream  │  │
│  │ - Terminal   │  │ - GitHub     │  │ - Agent status  │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
│         │                 │                   │            │
│         └─────────────────┼───────────────────┘            │
│                           │                                │
│                  ┌────────▼─────────┐                      │
│                  │   IPC Bridge     │                      │
│                  │  (Main ↔ Render) │                      │
│                  └────────┬─────────┘                      │
└───────────────────────────┼────────────────────────────────┘
                            │
                            ▼
                   Python Backend
```

**Key Components:**
- **Project Manager**: Select, load, and manage projects
- **Settings UI**: Configure API keys, GitHub, agents
- **Issues Panel**: Sync and display GitHub issues
- **Task Dashboard**: Track autonomous agent progress
- **Observability**: Real-time WebSocket monitoring

**Technologies:**
- Electron 28+
- TypeScript
- React (likely)
- Node.js 24+

---

### 2. Backend Layer (Python)

```
┌─────────────────────────────────────────────────────────────┐
│                     Python Backend                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Agent Orchestration                    │   │
│  │                                                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐   │   │
│  │  │  Planner │  │  Coder   │  │  QA Reviewer   │   │   │
│  │  │          │  │          │  │                │   │   │
│  │  │ - Spec   │  │ - Impl   │  │ - Test         │   │   │
│  │  │ - Design │  │ - Debug  │  │ - Validate     │   │   │
│  │  └────┬─────┘  └────┬─────┘  └────────┬───────┘   │   │
│  │       │             │                  │           │   │
│  │       └─────────────┼──────────────────┘           │   │
│  │                     │                              │   │
│  └─────────────────────┼──────────────────────────────┘   │
│                        │                                  │
│  ┌─────────────────────▼──────────────────────────────┐   │
│  │            Workflow Engine                         │   │
│  │                                                    │   │
│  │  - Task routing                                    │   │
│  │  - Parallel execution                              │   │
│  │  - State management                                │   │
│  │  - Error handling                                  │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        │                                  │
│  ┌─────────────────────▼──────────────────────────────┐   │
│  │           Integration Layer                        │   │
│  │                                                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │   │
│  │  │  Claude  │  │  GitHub  │  │  Git Worktree  │  │   │
│  │  │  Client  │  │  Client  │  │  Manager       │  │   │
│  │  └──────────┘  └──────────┘  └────────────────┘  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │          Memory Backend (Optional)                 │   │
│  │                                                    │   │
│  │  ┌──────────────────┐  ┌────────────────────────┐ │   │
│  │  │    Graphiti      │  │  LadybugDB (Embedded)  │ │   │
│  │  │  - Knowledge     │  │  - Local graph store   │ │   │
│  │  │  - Embeddings    │  │  - No Docker needed    │ │   │
│  │  └──────────────────┘  └────────────────────────┘ │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**

1. **Agent System**
   - Planner: Creates specifications and implementation plans
   - Coder: Implements features, fixes bugs
   - QA Reviewer: Tests and validates changes
   - QA Fixer: Addresses test failures

2. **Workflow Engine**
   - Manages agent execution
   - Handles parallel tasks
   - Maintains state across sessions

3. **Integration Layer**
   - Claude API client (Anthropic SDK)
   - GitHub API client (REST + GraphQL)
   - Git operations (worktree isolation)

4. **Memory Backend** (Optional)
   - Graphiti: Semantic memory layer
   - LadybugDB: Embedded graph database
   - Embeddings: OpenAI, Ollama, Voyage, etc.

**Technologies:**
- Python 3.12+
- Anthropic SDK
- PyGithub / httpx
- GitPython

---

### 3. External Services Integration

```
┌─────────────────────────────────────────────────────────────┐
│                  External Services                          │
└─────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌──────────────┐
│  Claude API   │       │  GitHub API   │       │  Optional    │
│  (Anthropic)  │       │               │       │  Services    │
│               │       │               │       │              │
│ - Chat        │       │ - Issues      │       │ - OpenAI     │
│ - Streaming   │       │ - PRs         │       │ - Linear     │
│ - Tools       │       │ - Repos       │       │ - Voyage AI  │
│ - Embeddings  │       │ - Commits     │       │              │
└───────┬───────┘       └───────┬───────┘       └──────┬───────┘
        │                       │                      │
        │                       │                      │
        └───────────────────────┼──────────────────────┘
                                │
                    Authentication Required:
                    - API Keys
                    - GitHub PAT
                    - OAuth tokens
```

**Authentication Flow:**

1. **Anthropic (Claude)**
   ```
   User → Auto-Claude Settings → CLAUDE_CODE_OAUTH_TOKEN
                                         │
                                         ▼
                              Anthropic API (claude-opus-4-5)
                                         │
                                         ▼
                              Responses → Auto-Claude Agents
   ```

2. **GitHub**
   ```
   User → GitHub Settings → Create Fine-grained Token
                                   │
                                   ├─ Resource owner: agroia-lab
                                   ├─ Repository: Personal_AI_Infrastructure_lleon
                                   └─ Permissions: Issues (RW), Contents (R)
                                         │
                                         ▼
                              Auto-Claude Settings → GitHub Integration
                                         │
                                         ▼
                              GitHub API (sync issues, create tasks)
   ```

---

## Data Flow Diagrams

### Configuration Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Configuration Sources                     │
└──────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐       ┌──────────────┐
│ Application  │        │   Project    │       │  Environment │
│   Settings   │        │   .env       │       │  Variables   │
│              │        │              │       │              │
│ ~/.config/   │        │ [project]/   │       │ Shell env    │
│ auto-claude- │        │ .auto-claude/│       │              │
│ ui/          │        │ .env         │       │              │
└──────┬───────┘        └──────┬───────┘       └──────┬───────┘
       │                       │                      │
       │  Priority:            │  Priority:           │  Priority:
       │  1. GUI settings      │  2. Project .env     │  3. System env
       │                       │                      │
       └───────────────────────┼──────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │  Runtime Config    │
                    │                    │
                    │  Merged settings   │
                    │  used by agents    │
                    └────────────────────┘
```

**Configuration Hierarchy:**

1. **Application Settings** (Highest priority)
   - Location: `~/.config/auto-claude-ui/`
   - Stored by GUI
   - User preferences, API keys

2. **Project .env** (Medium priority)
   - Location: `[project]/.auto-claude/.env`
   - Project-specific overrides
   - Model settings, GitHub repo

3. **Environment Variables** (Lowest priority)
   - System-level configuration
   - CI/CD integration
   - Fallback values

---

### Task Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Task Lifecycle                          │
└─────────────────────────────────────────────────────────────┘

1. Task Creation
   ────────────
   User creates task in Auto-Claude
   OR
   GitHub Issue synced to Auto-Claude
                  │
                  ▼
   ┌──────────────────────────┐
   │   Task Queue             │
   │   - Task ID              │
   │   - Description          │
   │   - Priority             │
   │   - GitHub Issue link    │
   └────────────┬─────────────┘
                │
                ▼

2. Planning Phase
   ──────────────
   ┌──────────────────────────┐
   │   Planner Agent          │
   │                          │
   │   - Analyze requirement  │
   │   - Create spec          │
   │   - Design approach      │
   │   - Generate plan        │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │   Implementation Plan    │
   │   - Spec file            │
   │   - Subtasks             │
   │   - File targets         │
   └────────────┬─────────────┘
                │
                ▼

3. Worktree Setup
   ───────────────
   ┌──────────────────────────┐
   │   Git Worktree Manager   │
   │                          │
   │   git worktree add       │
   │   [task-id]-worktree     │
   │   --branch task-[id]     │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │   Isolated Environment   │
   │   - Separate branch      │
   │   - Clean workspace      │
   │   - Main branch safe     │
   └────────────┬─────────────┘
                │
                ▼

4. Implementation
   ───────────────
   ┌──────────────────────────┐
   │   Coder Agent            │
   │                          │
   │   - Read codebase        │
   │   - Write code           │
   │   - Fix errors           │
   │   - Iterate              │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │   Code Changes           │
   │   - Modified files       │
   │   - Git commits          │
   │   - Build output         │
   └────────────┬─────────────┘
                │
                ▼

5. Quality Assurance
   ───────────────────
   ┌──────────────────────────┐
   │   QA Reviewer Agent      │
   │                          │
   │   - Run tests            │
   │   - Check build          │
   │   - Validate spec        │
   │   - Report issues        │
   └────────────┬─────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
   Pass            Fail
        │               │
        │               ▼
        │      ┌────────────────┐
        │      │ QA Fixer Agent │
        │      │ - Fix issues   │
        │      │ - Retest       │
        │      └────────┬───────┘
        │               │
        └───────┬───────┘
                ▼

6. Review & Merge
   ────────────────
   ┌──────────────────────────┐
   │   Create Pull Request    │
   │   (Optional)             │
   │                          │
   │   OR                     │
   │                          │
   │   Direct Merge           │
   │   to main branch         │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │   Update GitHub Issue    │
   │   - Mark complete        │
   │   - Add comments         │
   │   - Link commits         │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │   Cleanup Worktree       │
   │   git worktree remove    │
   └──────────────────────────┘
```

---

### GitHub Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│             GitHub ↔ Auto-Claude Sync Flow                  │
└─────────────────────────────────────────────────────────────┘

Direction: GitHub → Auto-Claude (Pull)
──────────────────────────────────────

   GitHub Repository
   agroia-lab/Personal_AI_Infrastructure_lleon
                  │
                  │ API Call (every N seconds or on load)
                  │ GET /repos/{owner}/{repo}/issues
                  │
                  ▼
   ┌──────────────────────────┐
   │   Auto-Claude GitHub     │
   │   Client                 │
   │                          │
   │   - Fetch issues         │
   │   - Parse metadata       │
   │   - Filter by labels     │
   │   - Map to tasks         │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │   Local Task Database    │
   │   .auto-claude/          │
   │                          │
   │   - Issues synced        │
   │   - Status tracked       │
   │   - Bidirectional link   │
   └──────────────────────────┘


Direction: Auto-Claude → GitHub (Push)
───────────────────────────────────────

   User creates task in Auto-Claude
   OR
   Agent completes work
                  │
                  ▼
   ┌──────────────────────────┐
   │   Auto-Claude Action     │
   │                          │
   │   - Create issue         │
   │   - Update issue         │
   │   - Add comment          │
   │   - Close issue          │
   └────────────┬─────────────┘
                │
                │ API Call
                │ POST /repos/{owner}/{repo}/issues
                │ PATCH /repos/{owner}/{repo}/issues/{id}
                │
                ▼
   ┌──────────────────────────┐
   │   GitHub API             │
   │                          │
   │   - Validate token       │
   │   - Check permissions    │
   │   - Update repository    │
   └────────────┬─────────────┘
                │
                ▼
   GitHub Repository Updated
   Issue created/modified
```

**Authentication Requirements:**

```
GitHub Fine-grained Token
├── Resource owner: agroia-lab (organization)
├── Repository: Personal_AI_Infrastructure_lleon
├── Permissions:
│   ├── Issues: Read and Write  ← For sync
│   ├── Contents: Read-only     ← For code access
│   └── Metadata: Read-only     ← Auto-included
└── Expiration: 30-90 days (renewable)
```

---

## File System Structure

### Auto-Claude Application Structure

```
/opt/Auto-Claude/  (Linux)
or
/Applications/Auto Claude.app/Contents/  (macOS)
│
├── auto-claude-ui               # Main executable
├── resources/
│   ├── app.asar                # Electron app bundle
│   ├── app.asar.unpacked/      # Native modules
│   └── auto-claude/            # Python backend
│       ├── __init__.py
│       ├── agents/
│       │   ├── planner.py
│       │   ├── coder.py
│       │   ├── qa_reviewer.py
│       │   └── qa_fixer.py
│       ├── core/
│       │   ├── workflow.py
│       │   ├── git_manager.py
│       │   └── api_clients.py
│       ├── integrations/
│       │   ├── github/
│       │   ├── linear/
│       │   └── graphiti/
│       └── requirements.txt
│
└── locales/                    # i18n resources
```

### User Configuration Structure

```
~/.config/auto-claude-ui/
│
├── python-venv/                # Python virtual environment
│   ├── bin/
│   │   ├── python
│   │   └── pip
│   └── lib/python3.12/site-packages/
│
├── logs/                       # Application logs
│   ├── debug.log
│   ├── error.log
│   └── agent-[id].log
│
├── config.json                 # GUI state, preferences
├── settings.json               # User settings
│
└── [project-name]/             # Per-project data
    └── .auto-claude/
        ├── .env                # Project API keys
        ├── ideation/           # Brainstorming outputs
        ├── insights/           # Analysis results
        ├── roadmap/            # Project plans
        └── specs/              # Specifications
```

### Project Workspace Structure

```
[project-root]/                 # e.g., Personal_AI_Infrastructure
│
├── .auto-claude/               # Auto-Claude project config
│   ├── .env                    # API keys, settings
│   ├── ideation/
│   ├── insights/
│   ├── roadmap/
│   └── specs/
│
├── .git/                       # Main git repository
│   ├── worktrees/              # Worktree metadata
│   │   ├── task-123/
│   │   └── task-456/
│   └── ...
│
├── [source code files]         # Your actual project
│
└── ../task-123-worktree/       # Isolated worktree
    ├── .git                    # Points to main .git
    ├── [modified files]        # Agent's changes
    └── ...                     # Clean separation from main
```

---

## Network Architecture

### API Communication

```
┌─────────────────────────────────────────────────────────────┐
│                    Auto-Claude Client                       │
└─────────────────────────────────────────────────────────────┘
                                │
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        │ HTTPS/REST            │ HTTPS/REST            │ HTTPS/REST
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌──────────────┐
│ api.anthropic │       │ api.github    │       │ api.openai   │
│ .com          │       │ .com          │       │ .com         │
│               │       │               │       │              │
│ - /messages   │       │ - /repos      │       │ - /embeddings│
│ - /v1/chat    │       │ - /issues     │       │ - /chat      │
│ - streaming   │       │ - /graphql    │       │              │
└───────────────┘       └───────────────┘       └──────────────┘

Headers:
├── Anthropic:  x-api-key: Bearer sk-ant-...
├── GitHub:     Authorization: token github_pat_...
└── OpenAI:     Authorization: Bearer sk-...
```

### Local Services

```
┌─────────────────────────────────────────────────────────────┐
│                    Local Network                            │
└─────────────────────────────────────────────────────────────┘

Auto-Claude Electron App
├── Main process: http://localhost:3456 (default)
│   └── IPC server
│
├── WebSocket server: ws://localhost:3457
│   └── Observability dashboard streaming
│
└── Python backend: Unix socket or named pipe
    └── IPC with Electron main process

Optional Local Services:
├── Ollama: http://localhost:11434
│   └── Local LLM inference (if using local models)
│
└── LadybugDB: Embedded (no network)
    └── File-based graph database
```

---

## Security Architecture

### Credential Storage

```
┌─────────────────────────────────────────────────────────────┐
│                  Credential Management                      │
└─────────────────────────────────────────────────────────────┘

User enters credentials
         │
         ▼
┌────────────────────┐
│  Auto-Claude GUI   │
│  Settings →        │
│  Integrations      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐       ┌─────────────────────────┐
│  Storage Decision  │──────►│ ~/.config/auto-claude-  │
│  Where to store?   │       │ ui/[project]/.auto-     │
│                    │       │ claude/.env             │
└────────┬───────────┘       │                         │
         │                   │ CLAUDE_CODE_OAUTH_TOKEN │
         │                   │ GITHUB_TOKEN            │
         │                   │ OPENAI_API_KEY          │
         │                   └─────────────────────────┘
         │
         ▼
┌────────────────────┐
│  File Permissions  │
│  chmod 600 .env    │       Only user can read/write
│  (Linux/macOS)     │
└────────────────────┘
```

**Security Best Practices:**

1. **Never commit .env files**
   - Add to `.gitignore`
   - Use `.env.template` for sharing structure

2. **Restrict file permissions**
   ```bash
   chmod 600 ~/.config/auto-claude-ui/[project]/.auto-claude/.env
   ```

3. **Rotate tokens regularly**
   - GitHub tokens: 30-90 day expiration
   - Anthropic keys: Monitor usage, rotate if suspicious

4. **Use fine-grained permissions**
   - GitHub: Only Issues (RW), Contents (R)
   - Don't grant unnecessary access

5. **Separate keys per environment**
   - Dev: Different API keys
   - Prod: Different API keys
   - Never share keys across environments

---

## Performance Characteristics

### Resource Usage

| Component | CPU | Memory | Disk | Network |
|-----------|-----|--------|------|---------|
| **Electron Frontend** | Low (idle) | ~200-300 MB | Minimal | Low |
| **Python Backend** | Medium | ~500 MB - 2 GB | Logs grow | API calls |
| **Agent Execution** | High (burst) | Depends on task | Worktrees | Heavy API |
| **Graphiti Memory** | Low-Medium | +500 MB | Growing DB | Embedding API |

### Scaling Considerations

**Single Project:**
- Handles 1-10 concurrent tasks well
- CPU bound during agent execution
- Memory grows with conversation history

**Multiple Projects:**
- Each project: Separate config, worktrees
- Recommended: <5 active projects simultaneously
- Consider separate Auto-Claude instances for isolation

**Large Codebases:**
- Initial indexing: Can be slow (>10k files)
- Use `.gitignore` to exclude unnecessary files
- Worktrees add disk usage (one copy per task)

---

## Monitoring and Observability

### Built-in Dashboard

```
Auto-Claude UI → Observability Skill
                       │
                       ▼
         ┌────────────────────────┐
         │  WebSocket Stream      │
         │  ws://localhost:3457   │
         │                        │
         │  Events:               │
         │  - agent_start         │
         │  - agent_complete      │
         │  - tool_use            │
         │  - error               │
         └────────┬───────────────┘
                  │
                  ▼
         ┌────────────────────────┐
         │  Live Dashboard        │
         │                        │
         │  - Agent pulse charts  │
         │  - Event timeline      │
         │  - Task swim lanes     │
         │  - Error tracking      │
         └────────────────────────┘
```

### Log Files

```
~/.config/auto-claude-ui/logs/
├── debug.log           # Detailed debug info
├── error.log           # Errors only
├── agent-planner.log   # Planner agent activity
├── agent-coder.log     # Coder agent activity
├── agent-qa.log        # QA agent activity
└── github-sync.log     # GitHub API calls
```

**Log Levels:**
- DEBUG: Verbose, everything
- INFO: Normal operations
- WARN: Issues but not critical
- ERROR: Failures, exceptions

---

## Extensibility Points

### 1. Custom Agents

```python
# Example: Create custom agent
from auto_claude.agent import BaseAgent

class CustomAgent(BaseAgent):
    def __init__(self, config):
        super().__init__(config)
        self.name = "CustomAgent"

    def execute(self, task):
        # Your custom logic
        return result
```

### 2. Integration Plugins

```python
# Example: Add new service integration
from auto_claude.integrations import BaseIntegration

class JiraIntegration(BaseIntegration):
    def sync_issues(self):
        # Fetch Jira issues
        # Convert to Auto-Claude tasks
        pass
```

### 3. Custom Skills

See PAI framework for skill creation:
- `.claude/Skills/[SkillName]/`
- `SKILL.md` - Documentation
- `workflows/` - Execution scripts
- `tools/` - Utilities

### 4. Hooks

PAI framework hooks:
- `user-prompt-submit` - Before sending to Claude
- `tool-call-complete` - After tool execution
- `session-end` - On session close

---

## Deployment Scenarios

### Scenario 1: Single Developer

```
Developer Workstation
├── Auto-Claude installed locally
├── Personal GitHub account
├── Individual API keys
└── Local projects
```

**Characteristics:**
- Simple setup
- Full control
- Personal rate limits

---

### Scenario 2: Team (agroia-lab)

```
Organization: agroia-lab
│
├── Shared GitHub Repository
│   └── Personal_AI_Infrastructure_lleon
│
├── Developer A
│   ├── Auto-Claude instance
│   ├── Organization GitHub token
│   └── Shared Anthropic key (or individual)
│
├── Developer B
│   ├── Auto-Claude instance
│   ├── Organization GitHub token
│   └── Shared Anthropic key (or individual)
│
└── CI/CD Pipeline (future)
    ├── Auto-Claude in container
    ├── GitHub Actions token
    └── API keys from secrets
```

**Characteristics:**
- Organization-level tokens
- Shared repositories
- Issue tracking sync across team
- Potential for centralized memory (Graphiti)

---

### Scenario 3: Enterprise (Future)

```
Enterprise Infrastructure
├── Auto-Claude Server (multi-tenant)
├── SSO Integration
├── Centralized API key management
├── Usage monitoring & quotas
├── Compliance & audit logs
└── Shared knowledge base
```

**Characteristics:**
- Managed deployment
- Enterprise security
- Centralized administration
- Advanced observability

---

## Version Compatibility Matrix

| Auto-Claude | Python | Node.js | Anthropic SDK | GitHub API |
|-------------|--------|---------|---------------|------------|
| 2.7.1 | 3.12+ | 24+ | Compatible | v3 (2022-11-28) |
| 2.7.0 | 3.12+ | 24+ | Compatible | v3 |
| 2.6.x | 3.11+ | 22+ | Compatible | v3 |

**Claude Models Supported:**
- claude-opus-4-5-20251101 (recommended)
- claude-sonnet-4-5-20250929
- claude-sonnet-3-5-20241022
- claude-sonnet-3-5-20240620

---

## Future Architecture Considerations

### Planned Enhancements

1. **Multi-project Workspaces**
   - Switch between projects seamlessly
   - Shared memory across projects

2. **Collaborative Features**
   - Real-time co-editing
   - Team chat integration
   - Shared agent sessions

3. **Advanced Memory**
   - Long-term project memory
   - Cross-session context
   - Knowledge graph visualization

4. **Cloud Sync** (Optional)
   - Backup configurations
   - Sync across devices
   - Team settings distribution

---

## References

- **Auto-Claude GitHub**: https://github.com/AndyMik90/Auto-Claude
- **Claude API Docs**: https://docs.anthropic.com/
- **GitHub API Docs**: https://docs.github.com/en/rest
- **Electron Docs**: https://www.electronjs.org/docs/latest
- **PAI Framework**: Personal AI Infrastructure documentation

---

**Last Updated:** 2025-12-26
**Next Review:** 2026-01-26
**Maintainer:** agroia-lab DevOps Team

