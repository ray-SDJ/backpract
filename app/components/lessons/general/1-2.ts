import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Setting Up Your Development Environment",
  difficulty: "Beginner",
  description:
    "Learn how to set up a complete backend development environment with essential tools and configurations.",
  objectives: [
    "Choose and install a programming language runtime",
    "Set up code editors with essential extensions",
    "Configure version control with Git and GitHub",
    "Understand project structure and best practices",
    "Set up debugging and testing tools",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Setting Up Your Development Environment</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🛠️ Essential Development Tools
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            A well-configured development environment is crucial for productive backend development. We'll set up the complete toolkit that professional developers use daily.
          </p>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-blue-50 border-blue-200 text-blue-900">
            <h4 class="font-semibold mb-3 flex items-center gap-2 text-blue-600">
              📋 What We'll Install Today
            </h4>
            <div class="explanation-content">
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Programming Language Runtime:</strong> Choose your backend language</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Code Editor:</strong> Professional development environment</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Git:</strong> Version control system for code management</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Terminal/Command Line:</strong> Interface for running commands</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>API Testing Tool:</strong> Test your backend endpoints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            � Step 1: Choose Your Backend Language
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            Different programming languages offer unique advantages for backend development. Choose based on your project needs, team expertise, and ecosystem requirements.
          </p>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
              <h4 class="font-semibold mb-3 text-yellow-800">🟨 JavaScript/Node.js</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Install:</strong> nodejs.org</li>
                <li><strong>Package Manager:</strong> npm/yarn</li>
                <li><strong>Strengths:</strong> Fast development, JSON native</li>
                <li><strong>Use Cases:</strong> APIs, real-time apps</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800">🐍 Python</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Install:</strong> python.org</li>
                <li><strong>Package Manager:</strong> pip</li>
                <li><strong>Strengths:</strong> Readable, extensive libraries</li>
                <li><strong>Use Cases:</strong> AI/ML, web APIs, automation</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-3 text-red-800">☕ Java</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Install:</strong> oracle.com/java</li>
                <li><strong>Package Manager:</strong> Maven/Gradle</li>
                <li><strong>Strengths:</strong> Enterprise-grade, performance</li>
                <li><strong>Use Cases:</strong> Large systems, microservices</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-purple-50 border-purple-200 text-purple-900">
              <h4 class="font-semibold mb-3 text-purple-800">⚡ C#/.NET</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Install:</strong> dotnet.microsoft.com</li>
                <li><strong>Package Manager:</strong> NuGet</li>
                <li><strong>Strengths:</strong> Type safety, tooling</li>
                <li><strong>Use Cases:</strong> Enterprise apps, Windows</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-cyan-50 border-cyan-200 text-cyan-900">
              <h4 class="font-semibold mb-3 text-cyan-800">🐹 Go</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Install:</strong> golang.org</li>
                <li><strong>Package Manager:</strong> go mod</li>
                <li><strong>Strengths:</strong> Concurrency, simplicity</li>
                <li><strong>Use Cases:</strong> Microservices, CLI tools</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-orange-50 border-orange-200 text-orange-900">
              <h4 class="font-semibold mb-3 text-orange-800">🦀 Rust</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Install:</strong> rustup.rs</li>
                <li><strong>Package Manager:</strong> Cargo</li>
                <li><strong>Strengths:</strong> Memory safety, performance</li>
                <li><strong>Use Cases:</strong> System programming, APIs</li>
              </ul>
            </div>
          </div>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-gray-50 border-gray-200 text-gray-900">
            <h4 class="font-semibold mb-3 text-gray-800">
              💡 Installation Tips
            </h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Use official installers</strong> for your operating system</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Choose LTS/stable versions</strong> for production projects</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Install package managers</strong> (npm, pip, etc.) with the runtime</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Verify installation</strong> using version commands</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            💻 Step 2: Setting Up Your Code Editor
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            A good code editor enhances productivity with syntax highlighting, debugging, and language-specific features. Here are the most popular options for backend development.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800">🆚 Visual Studio Code (Recommended)</h4>
              <ul class="space-y-2 text-sm">
                <li><strong>Free:</strong> Open source and completely free</li>
                <li><strong>Extensions:</strong> Massive extension marketplace</li>
                <li><strong>Multi-language:</strong> Supports all backend languages</li>
                <li><strong>Integrated Terminal:</strong> Built-in command line</li>
                <li><strong>Git Integration:</strong> Version control built-in</li>
              </ul>
              <p class="text-xs mt-2 text-blue-600">Download: code.visualstudio.com</p>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-purple-50 border-purple-200 text-purple-900">
              <h4 class="font-semibold mb-3 text-purple-800">⚡ Other Popular Editors</h4>
              <ul class="space-y-2 text-sm">
                <li><strong>IntelliJ IDEA:</strong> Powerful Java/Kotlin IDE</li>
                <li><strong>PyCharm:</strong> Python-focused development</li>
                <li><strong>Vim/Neovim:</strong> Terminal-based, highly customizable</li>
                <li><strong>Sublime Text:</strong> Fast and lightweight</li>
                <li><strong>WebStorm:</strong> JavaScript/Node.js focused</li>
              </ul>
            </div>
          </div>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-green-50 border-green-200 text-green-900">
            <h4 class="font-semibold mb-3 text-green-600">
              🔧 Essential Extensions by Language
            </h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 class="font-medium mb-2">Universal Extensions</h5>
                <ul class="space-y-1">
                  <li>• <strong>GitLens</strong> - Enhanced Git integration</li>
                  <li>• <strong>REST Client</strong> - Test APIs directly</li>
                  <li>• <strong>Prettier</strong> - Code formatting</li>
                  <li>• <strong>Error Lens</strong> - Inline error display</li>
                </ul>
              </div>
              <div>
                <h5 class="font-medium mb-2">Language-Specific</h5>
                <ul class="space-y-1">
                  <li>• <strong>Python:</strong> Python, Pylance</li>
                  <li>• <strong>Java:</strong> Extension Pack for Java</li>
                  <li>• <strong>C#:</strong> C# Dev Kit</li>
                  <li>• <strong>Go:</strong> Go extension</li>
                  <li>• <strong>Rust:</strong> rust-analyzer</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">Universal VS Code Settings</span>
              <span class="text-xs text-gray-400 ml-auto">JSON</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code>{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "files.autoSave": "onFocusChange",
  "terminal.integrated.fontSize": 13,
  "workbench.colorTheme": "Dark+ (default dark)",
  "editor.minimap.enabled": false,
  "editor.wordWrap": "on",
  "files.trimTrailingWhitespace": true
}</code>
            </pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🌿 Step 3: Git Version Control
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            Git is essential for tracking changes in your code and collaborating with other developers. GitHub provides cloud hosting for your repositories.
          </p>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-gray-50 border-gray-200 text-gray-900">
            <h4 class="font-semibold mb-3 text-gray-800">
              📥 Installing Git
            </h4>
            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <h5 class="font-medium mb-2 text-blue-600">Windows</h5>
                <p class="text-sm">Download from git-scm.com or use:</p>
                <code class="bg-gray-100 px-2 py-1 rounded text-xs">winget install Git.Git</code>
              </div>
              <div>
                <h5 class="font-medium mb-2 text-green-600">macOS</h5>
                <p class="text-sm">Use Homebrew:</p>
                <code class="bg-gray-100 px-2 py-1 rounded text-xs">brew install git</code>
              </div>
              <div>
                <h5 class="font-medium mb-2 text-orange-600">Linux</h5>
                <p class="text-sm">Ubuntu/Debian:</p>
                <code class="bg-gray-100 px-2 py-1 rounded text-xs">sudo apt install git</code>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Initial Git Configuration</h4>
            <div class="code-block-wrapper mb-4">
              <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <span class="text-sm font-medium">First-time Git Setup</span>
                <span class="text-xs text-gray-400 ml-auto">bash</span>
              </div>
              <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
                <code># Set your identity (replace with your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"

# Verify configuration
git config --list</code>
              </pre>
            </div>
          </div>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-green-50 border-green-200 text-green-900">
            <h4 class="font-semibold mb-3 text-green-600">
              🔐 Setting Up GitHub
            </h4>
            <ol class="space-y-2 text-sm">
              <li class="flex items-start gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">1</span>
                <span>Create account at github.com</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">2</span>
                <span>Generate SSH key: <code class="bg-green-100 px-1 rounded">ssh-keygen -t ed25519 -C "your_email@example.com"</code></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">3</span>
                <span>Add SSH key to GitHub account in Settings → SSH Keys</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">4</span>
                <span>Test connection: <code class="bg-green-100 px-1 rounded">ssh -T git@github.com</code></span>
              </li>
            </ol>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📁 Step 4: Project Structure
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            Organizing your project properly from the start saves time and makes your code more maintainable.
          </p>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">General Backend Project Structure</span>
              <span class="text-xs text-gray-400 ml-auto">Directory Tree</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code>my-backend-project/
├── src/                    # Source code
│   ├── controllers/        # Request handlers/endpoints  
│   ├── models/            # Data models/entities
│   ├── services/          # Business logic layer
│   ├── middleware/        # Request/response middleware
│   ├── routes/            # API route definitions
│   ├── utils/             # Helper functions
│   ├── config/            # Configuration files
│   └── main.*             # Main application file
├── tests/                 # Test files
├── docs/                  # Documentation
├── .env                   # Environment variables
├── .env.example          # Environment template  
├── .gitignore            # Git ignore rules
├── [deps-file]           # Dependencies (package.json, requirements.txt, etc.)
├── README.md             # Project documentation
└── [entry-point]         # Application entry point</code>
            </pre>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="explanation-box border rounded-lg p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
              <h4 class="font-semibold mb-3 text-yellow-800">📋 Essential Files by Language</h4>
              <ul class="space-y-2 text-sm">
                <li><strong>JavaScript:</strong> package.json, server.js</li>
                <li><strong>Python:</strong> requirements.txt, main.py</li>
                <li><strong>Java:</strong> pom.xml, Application.java</li>
                <li><strong>C#:</strong> .csproj, Program.cs</li>
                <li><strong>Go:</strong> go.mod, main.go</li>
                <li><strong>Rust:</strong> Cargo.toml, main.rs</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-3 text-red-800">⚠️ Universal .gitignore</h4>
              <div class="code-block bg-gray-100 p-2 rounded text-xs">
                <pre># Dependencies
node_modules/
__pycache__/
target/
bin/
obj/

# Environment & Config
.env
.env.local
*.config.local

# Build artifacts
dist/
build/
*.exe
*.jar

# Logs
logs/
*.log

# OS files
.DS_Store
Thumbs.db</pre>
              </div>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🧪 Step 5: Development Tools
          </h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800">📮 Postman for API Testing</h4>
              <ol class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <span class="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">1</span>
                  <span>Download from postman.com</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">2</span>
                  <span>Create free account</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">3</span>
                  <span>Install and sync collections</span>
                </li>
              </ol>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-green-50 border-green-200 text-green-900">
              <h4 class="font-semibold mb-3 text-green-800">🐳 Optional: Docker</h4>
              <p class="text-sm mb-2">For containerized development:</p>
              <ul class="space-y-1 text-sm">
                <li>• Download Docker Desktop</li>
                <li>• Useful for databases</li>
                <li>• Consistent environments</li>
                <li>• We'll cover this later</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✅ Verification Checklist
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" class="mt-1" />
              <div>
                <h4 class="font-semibold text-gray-900">Language Runtime Installation</h4>
                <p class="text-gray-700 text-sm">Verify your chosen language installation with version commands</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" class="mt-1" />
              <div>
                <h4 class="font-semibold text-gray-900">Code Editor Setup</h4>
                <p class="text-gray-700 text-sm">Editor installed with language-specific extensions</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" class="mt-1" />
              <div>
                <h4 class="font-semibold text-gray-900">Git Configuration</h4>
                <p class="text-gray-700 text-sm">Git installed and configured with GitHub account</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" class="mt-1" />
              <div>
                <h4 class="font-semibold text-gray-900">Project Structure</h4>
                <p class="text-gray-700 text-sm">Understand how to organize backend projects</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" class="mt-1" />
              <div>
                <h4 class="font-semibold text-gray-900">Development Tools</h4>
                <p class="text-gray-700 text-sm">Postman installed for API testing</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 class="font-semibold text-green-900 mb-2 flex items-center gap-2">
            🎯 Next Steps
          </h4>
          <p class="text-sm text-green-800">
            With your development environment ready, you're prepared to start building backend applications! In the next lesson, we'll explore HTTP and web communication fundamentals.
          </p>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Choose and install a backend programming language from the options provided",
    "Set up a code editor with language-specific extensions and configurations",
    "Configure Git with your personal information and create a GitHub account",
    "Create a new project directory with the standard backend structure for your language",
    "Install and test an API testing tool like Postman or Thunder Client",
  ],
  hints: [
    "Always use stable/LTS versions of programming languages for production projects",
    "Keep your editor extensions updated for the best development experience",
    "Use SSH keys with GitHub for secure authentication without passwords",
    "Start with a simple project structure and expand as your project grows",
    "API testing tool collections help organize and share tests with your team",
  ],
  solution: `# Development environment verification commands

# Check language installations (choose your language):

# JavaScript/Node.js
node --version && npm --version

# Python  
python --version && pip --version

# Java
java -version && javac -version

# C#/.NET
dotnet --version

# Go
go version

# Rust
rustc --version && cargo --version

# Create basic project structure (bash/terminal):
mkdir -p my-backend-project/{src/{controllers,models,services,middleware,routes,utils,config},tests,docs}

# Initialize version control
cd my-backend-project
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"

echo "Development environment setup complete!"`,
};

export default lessonData;
