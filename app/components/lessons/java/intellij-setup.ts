import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "IntelliJ IDEA Project Setup",
  description:
    "Complete guide to setting up Java projects in IntelliJ IDEA, including SDK configuration, Maven/Gradle setup, debugging, and productivity features.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>IntelliJ IDEA is the most popular IDE for Java development, offering powerful features for Spring Boot, Maven, Gradle, debugging, and more. This guide covers everything from installation to advanced productivity tips.</p>

    <h2>Installing IntelliJ IDEA</h2>
    
    <p>Download IntelliJ IDEA from <strong>jetbrains.com/idea</strong>. Two editions are available:</p>

    <div class="feature-list">
      <ul>
        <li><strong>Community Edition (Free):</strong> Perfect for Java, Kotlin, Groovy, and Android development</li>
        <li><strong>Ultimate Edition (Paid):</strong> Adds Spring Boot, JavaScript, database tools, and more</li>
      </ul>
    </div>

    <pre class="code-block">
      <code>
# Linux installation (using JetBrains Toolbox - recommended)
# Download Toolbox from: https://www.jetbrains.com/toolbox-app/

# Or direct installation (Ubuntu/Debian)
sudo snap install intellij-idea-community --classic

# Or for Ultimate edition
sudo snap install intellij-idea-ultimate --classic

# macOS installation
brew install --cask intellij-idea-ce
# Or for Ultimate
brew install --cask intellij-idea

# Verify Java is installed
java -version
      </code>
    </pre>

    <h2>First Time Setup</h2>
    
    <p>When launching IntelliJ for the first time:</p>

    <div class="explanation-list">
      <ol>
        <li><strong>Import Settings:</strong> Skip this if it's your first time</li>
        <li><strong>UI Theme:</strong> Choose between Light (IntelliJ) or Dark (Darcula)</li>
        <li><strong>Keymap:</strong> Select your preferred shortcuts (IntelliJ default recommended)</li>
        <li><strong>Plugins:</strong> Install essential plugins (covered later)</li>
        <li><strong>SDK Setup:</strong> Configure your Java Development Kit (JDK)</li>
      </ol>
    </div>

    <h2>Setting Up Java SDK</h2>
    
    <p>IntelliJ needs to know where your JDK is installed:</p>

    <pre class="code-block">
      <code>
1. Open IntelliJ IDEA
2. Click "Projects" → "SDK" → "Download JDK"
   OR
   Go to: File → Project Structure → Platform Settings → SDKs

3. Click "+" → "Download JDK"
   - Vendor: Choose from Oracle OpenJDK, Amazon Corretto, Eclipse Temurin
   - Version: Select 17 or 21 (LTS versions recommended)
   - Location: Choose installation directory

4. Apply and OK

# Popular JDK Distributions:
# - Oracle OpenJDK: Official reference implementation
# - Amazon Corretto: Free, production-ready distribution
# - Eclipse Temurin (AdoptOpenJDK): Community-driven, reliable
# - GraalVM: High-performance with native image support
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 Understanding JDK Versions</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Java 8 (LTS):</strong> Widely used in legacy projects, end of free support</li>
        <li><strong>Java 11 (LTS):</strong> First major LTS after 8, great for production</li>
        <li><strong>Java 17 (LTS):</strong> Modern features, recommended for new projects</li>
        <li><strong>Java 21 (LTS):</strong> Latest LTS with virtual threads and pattern matching</li>
        <li><strong>LTS = Long-Term Support:</strong> Gets updates for several years</li>
      </ul>
    </div>

    <h2>Creating a New Project</h2>
    
    <h3>Option 1: New Maven Project</h3>
    
    <pre class="code-block">
      <code>
1. File → New → Project
2. Select "Maven Archetype" (or "Maven" for simple project)
3. Configure:
   Name: demo-project
   Location: Choose project directory
   JDK: Select your installed JDK
   
4. Maven Settings:
   GroupId: com.example
   ArtifactId: demo
   
5. Advanced Settings (expand):
   Archetype: org.apache.maven.archetypes:maven-archetype-quickstart
   Version: 1.4

6. Click "Create"

# IntelliJ will:
# - Generate project structure
# - Create pom.xml
# - Download dependencies
# - Index files
      </code>
    </pre>

    <h3>Option 2: New Gradle Project</h3>
    
    <pre class="code-block">
      <code>
1. File → New → Project
2. Select "Gradle" or "Gradle (Java)"
3. Configure:
   Name: demo-gradle
   Location: Choose directory
   JDK: Select JDK
   
4. Gradle Settings:
   Gradle DSL: Groovy or Kotlin
   GroupId: com.example
   ArtifactId: demo-gradle
   Version: 1.0-SNAPSHOT

5. Click "Create"

# Gradle advantages:
# - Faster builds than Maven
# - More flexible dependency management
# - Better for multi-module projects
# - Groovy or Kotlin DSL
      </code>
    </pre>

    <h3>Option 3: Spring Boot Project (Spring Initializr)</h3>
    
    <pre class="code-block">
      <code>
1. File → New → Project
2. Select "Spring Initializr"
3. Configure:
   Name: spring-demo
   Type: Maven or Gradle
   Language: Java
   Packaging: Jar
   Java Version: 17 or 21
   
4. Project Metadata:
   Group: com.example
   Artifact: demo
   Package name: com.example.demo
   
5. Dependencies (click "Add"):
   - Spring Web (for REST APIs)
   - Spring Data JPA (for database)
   - PostgreSQL Driver (or MySQL, H2)
   - Spring Boot DevTools (for hot reload)
   - Lombok (for reducing boilerplate)
   - Validation (for Bean Validation)

6. Click "Create"

# IntelliJ will:
# - Generate Spring Boot project structure
# - Create main application class
# - Configure dependencies in pom.xml/build.gradle
# - Set up application.properties
      </code>
    </pre>

    <h2>Project Structure Explained</h2>
    
    <pre class="code-block">
      <code>
demo-project/
├── .idea/                          # IntelliJ project settings
│   ├── workspace.xml              # Your personal workspace settings
│   ├── modules.xml                # Project modules configuration
│   └── misc.xml                   # Miscellaneous settings
├── src/
│   ├── main/
│   │   ├── java/                  # Java source files
│   │   │   └── com/example/
│   │   │       └── Main.java     # Main application class
│   │   └── resources/             # Configuration files, properties
│   │       ├── application.properties
│   │       ├── static/            # Static web resources (CSS, JS)
│   │       └── templates/         # Templates (Thymeleaf, etc.)
│   └── test/
│       ├── java/                  # Test source files
│       └── resources/             # Test resources
├── target/                         # Compiled classes (Maven)
├── out/                           # Compiled classes (IntelliJ)
├── pom.xml                        # Maven dependencies and build config
└── README.md

# IntelliJ-specific folders:
# .idea/ - Contains all IDE settings (add to .gitignore some files)
# *.iml - IntelliJ module file (usually auto-generated)
# out/ - Default output directory (override to use target/)
      </code>
    </pre>

    <h2>Configuring Maven in pom.xml</h2>
    
    <pre class="code-block">
      <code>
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    
    <!-- POM model version (always 4.0.0) -->
    <modelVersion>4.0.0</modelVersion>

    <!-- Project coordinates (uniquely identify this project) -->
    <!-- groupId: Reverse domain name, identifies organization -->
    <groupId>com.example</groupId>
    
    <!-- artifactId: Project name, lowercase with hyphens -->
    <artifactId>demo</artifactId>
    
    <!-- version: Project version, SNAPSHOT = in development -->
    <version>1.0-SNAPSHOT</version>
    
    <!-- packaging: Output type (jar, war, pom) -->
    <packaging>jar</packaging>

    <!-- Project metadata -->
    <name>Demo Project</name>
    <description>A demo Java project</description>

    <!-- Properties: Define reusable values -->
    <properties>
        <!-- Java version for compilation -->
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        
        <!-- Source encoding (prevent platform-specific issues) -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        
        <!-- Dependency versions (centralized management) -->
        <junit.version>5.10.1</junit.version>
    </properties>

    <!-- Dependencies: External libraries your project needs -->
    <dependencies>
        <!-- JUnit 5 for testing -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>\${junit.version}</version>
            <!-- scope: test = only available in test phase -->
            <scope>test</scope>
        </dependency>

        <!-- Example: JSON processing with Jackson -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.16.0</version>
        </dependency>
    </dependencies>

    <!-- Build configuration -->
    <build>
        <plugins>
            <!-- Maven Compiler Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
      </code>
    </pre>

    <h2>Essential IntelliJ Keyboard Shortcuts</h2>
    
    <pre class="code-block">
      <code>
# Navigation
Ctrl + N (Cmd + O on Mac)         - Search for class
Ctrl + Shift + N                  - Search for file
Ctrl + Alt + Shift + N            - Search for symbol (method, field)
Ctrl + E                          - Recent files
Ctrl + B (Cmd + B)                - Go to declaration
Ctrl + Alt + B                    - Go to implementation
Alt + F7                          - Find usages

# Editing
Ctrl + Space                      - Basic code completion
Ctrl + Shift + Space              - Smart code completion
Ctrl + Shift + Enter              - Complete statement
Ctrl + /                          - Comment/uncomment line
Ctrl + Shift + /                  - Block comment
Ctrl + D                          - Duplicate line
Ctrl + Y                          - Delete line
Ctrl + Alt + L                    - Reformat code
Ctrl + Alt + O                    - Optimize imports

# Refactoring
Shift + F6                        - Rename
Ctrl + Alt + M                    - Extract method
Ctrl + Alt + V                    - Extract variable
Ctrl + Alt + C                    - Extract constant
Ctrl + Alt + P                    - Extract parameter

# Running & Debugging
Shift + F10                       - Run
Shift + F9                        - Debug
Ctrl + F2                         - Stop
F8                                - Step over
F7                                - Step into
Shift + F8                        - Step out
F9                                - Resume program
Ctrl + F8                         - Toggle breakpoint

# Build & Maven
Ctrl + F9                         - Build project
Ctrl + Shift + F9                 - Recompile current file
Ctrl + Shift + A                  - Find action (Maven commands, etc.)

# Window Management
Alt + 1                           - Project tool window
Alt + 4                           - Run tool window
Alt + 5                           - Debug tool window
Alt + 9                           - Git tool window
Shift + Escape                    - Hide active tool window
Ctrl + Shift + F12                - Maximize editor
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">💡 Productivity Tips</h4>
      <ul class="space-y-2">
        <li>✅ <strong>Ctrl + Shift + A:</strong> Action search - find any command without remembering shortcuts</li>
        <li>✅ <strong>Live Templates:</strong> Type "sout" + Tab for System.out.println(), "psvm" for main method</li>
        <li>✅ <strong>Postfix Completion:</strong> Type ".var" after expression to extract variable</li>
        <li>✅ <strong>Multi-cursor:</strong> Alt + J to select next occurrence, edit multiple locations</li>
        <li>✅ <strong>Column Selection:</strong> Alt + Shift + Insert for column mode editing</li>
      </ul>
    </div>

    <h2>Running and Debugging</h2>
    
    <h3>Running Your Application</h3>
    
    <pre class="code-block">
      <code>
# Method 1: Run from main method
1. Open file with main() method
2. Click green arrow next to main() method
3. Select "Run 'Main.main()'"

# Method 2: Run Configuration
1. Top right: Add Configuration → + → Application
2. Configure:
   Name: My App
   Main class: com.example.Main (click ... to search)
   Program arguments: --spring.profiles.active=dev
   VM options: -Xmx512m -Xms256m
   Working directory: $PROJECT_DIR$
   Environment variables: KEY=value
3. Click OK
4. Click green Run button in toolbar

# Method 3: Maven/Gradle
1. Open Maven/Gradle tool window (right sidebar)
2. Expand Lifecycle → run
3. Double-click to execute

# Spring Boot DevTools Hot Reload:
# - Make code changes
# - Ctrl + F9 (Build Project)
# - Application auto-restarts
      </code>
    </pre>

    <h3>Debugging</h3>
    
    <pre class="code-block">
      <code>
# Setting Breakpoints
1. Click left gutter next to line number (red dot appears)
2. Right-click breakpoint for conditions:
   - Condition: i > 10 (only break when condition is true)
   - Hit count: Break after N hits
   - Log message: Print message without stopping

# Debug Actions
F8     - Step Over: Execute current line, don't enter methods
F7     - Step Into: Enter method calls
Shift+F8 - Step Out: Return from current method
F9     - Resume: Continue to next breakpoint
Alt+F9 - Run to Cursor: Continue to current cursor position

# Evaluate Expressions (during debug)
1. Alt + F8 - Open expression evaluator
2. Type expression: user.getName()
3. Press Enter to evaluate
4. Can modify variables and call methods

# Debug Tool Window
- Variables: See all variables in current scope
- Watches: Add expressions to monitor continuously
- Frames: View call stack
- Console: See program output
- Threads: View and switch between threads

# Advanced Debugging
- Field Watchpoint: Right-click field → Breakpoint → Field Watchpoint
  Breaks when field is read or modified
- Method Breakpoint: Click on method line number in gutter
  Breaks on method entry/exit
      </code>
    </pre>

    <h2>Essential Plugins for Java Development</h2>
    
    <pre class="code-block">
      <code>
# Installing Plugins
File → Settings → Plugins → Marketplace

# Recommended Plugins:

1. **Lombok** (if using Lombok library)
   - Eliminates boilerplate code (@Getter, @Setter, etc.)
   - Auto-generates getters, setters, constructors

2. **SonarLint**
   - Real-time code quality analysis
   - Detects bugs, security vulnerabilities, code smells

3. **Database Tools and SQL** (Ultimate only, or use free alternatives)
   - Connect to databases
   - Run SQL queries
   - View data in tables

4. **GitToolBox**
   - Enhanced Git integration
   - Inline blame annotations
   - Auto-fetch from remote

5. **Rainbow Brackets**
   - Color-codes matching brackets
   - Easier to read nested code

6. **Key Promoter X**
   - Shows shortcuts when you use mouse
   - Helps learn keyboard shortcuts

7. **String Manipulation**
   - Convert case, escape/unescape strings
   - Encode/decode base64, URL

8. **.ignore**
   - Support for .gitignore files
   - Syntax highlighting and templates

# Ultimate Edition Exclusive:
- Spring Boot support
- JavaScript/TypeScript
- Database tools
- HTTP Client
- Kubernetes
      </code>
    </pre>

    <h2>Maven Commands in IntelliJ</h2>
    
    <pre class="code-block">
      <code>
# Maven Tool Window (right sidebar)

# Lifecycle commands:
clean       - Delete target/ directory
validate    - Validate project structure
compile     - Compile source code
test        - Run unit tests
package     - Create JAR/WAR file
verify      - Run integration tests
install     - Install to local repository
deploy      - Deploy to remote repository

# Common workflows:
clean compile      - Clean build
clean package      - Build JAR file
clean install      - Build and install locally

# Execute custom Maven goals:
1. View → Tool Windows → Maven
2. Right-click project → Execute Maven Goal
3. Type: spring-boot:run
4. Click Execute

# Configure Maven settings:
File → Settings → Build, Execution, Deployment → Build Tools → Maven
- Maven home directory
- User settings file
- Local repository
- Runner options (JVM options, skip tests)
      </code>
    </pre>

    <h2>Git Integration</h2>
    
    <pre class="code-block">
      <code>
# Initialize Git Repository
VCS → Enable Version Control Integration → Select Git

# Commit Changes
1. Ctrl + K - Open Commit window
2. Select files to commit
3. Write commit message
4. Click "Commit" or "Commit and Push"

# Common Git Operations
Ctrl + K           - Commit
Ctrl + Shift + K   - Push
Ctrl + T           - Update Project (Pull)
Alt + 9            - Git tool window
Alt + \`           - VCS quick popup

# Branches
1. Bottom right: Click current branch name
2. Select "New Branch" or switch to existing branch
3. IntelliJ handles checkout automatically

# Merge Conflicts
1. IntelliJ detects conflicts automatically
2. Right-click file → Git → Resolve Conflicts
3. 3-way merge tool shows:
   - Your changes (left)
   - Remote changes (right)
   - Result (center)
4. Click ">>" or "<<" to accept changes
5. Edit center panel if needed
6. Click "Apply"

# Useful Git Features
- Local History: Right-click file → Local History → Show History
  (IntelliJ saves history even without Git)
- Annotate: Right-click gutter → Annotate with Git Blame
- Compare with Branch: Right-click file → Git → Compare with Branch
      </code>
    </pre>

    <h2>Code Quality and Analysis</h2>
    
    <pre class="code-block">
      <code>
# Code Inspections
Ctrl + Alt + Shift + I  - Run inspection by name
Alt + Enter             - Show intention actions / quick fixes

# Enable/Disable Inspections
File → Settings → Editor → Inspections
- Browse categories: Java, Performance, Security
- Adjust severity: Error, Warning, Weak Warning
- Disable noisy inspections

# Code Style
File → Settings → Editor → Code Style → Java
- Tabs and Indents
- Spaces: around operators, before parentheses
- Wrapping: line length, chop down if long
- Import: optimize imports, order

Auto-format:
Ctrl + Alt + L  - Format code
Ctrl + Alt + O  - Optimize imports

# Live Templates
File → Settings → Editor → Live Templates

Common templates:
psvm + Tab    - public static void main
sout + Tab    - System.out.println()
fori + Tab    - for loop with index
iter + Tab    - for-each loop
ifn + Tab     - if null check
inn + Tab     - if not null check

# Create Custom Template:
1. Settings → Live Templates
2. Click "+"
3. Abbreviation: mytemplate
4. Template text: // TODO: $CURSOR$
5. Click "Define" → Select context (Java)
      </code>
    </pre>

    <h2>Troubleshooting Common Issues</h2>
    
    <pre class="code-block">
      <code>
# Issue: Dependencies not downloading
Solution:
1. File → Invalidate Caches → Invalidate and Restart
2. Maven tool window → Reload All Maven Projects (🔄 icon)
3. Check internet connection and proxy settings
4. Delete ~/.m2/repository (local Maven cache) and reload

# Issue: "Cannot resolve symbol" errors
Solution:
1. File → Invalidate Caches → Invalidate and Restart
2. Right-click project → Maven → Reload Project
3. Check Project Structure: File → Project Structure
   - Modules: Ensure src/main/java is marked as Sources
   - Libraries: Verify dependencies are loaded
4. Reimport Maven/Gradle project

# Issue: Wrong JDK version
Solution:
1. File → Project Structure
2. Project → Project SDK → Change to correct version
3. Modules → Each module → Language level → Match SDK
4. Settings → Build → Compiler → Java Compiler → Target bytecode version

# Issue: Out of memory during build
Solution:
1. Help → Edit Custom VM Options
2. Add/modify:
   -Xms512m
   -Xmx2048m
   -XX:MaxMetaspaceSize=512m
3. Restart IntelliJ

# Issue: Slow IDE performance
Solution:
1. Help → Edit Custom VM Options (increase heap)
2. File → Settings → Appearance → Antialiasing (disable)
3. Disable unused plugins: Settings → Plugins
4. Exclude target/out directories: File → Project Structure → Modules → Excluded
5. Power Save Mode: File → Power Save Mode (disables inspections)
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🎯 IntelliJ vs Other IDEs</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>IntelliJ IDEA:</strong> Best for Java/Spring Boot, excellent refactoring, smart code completion</li>
        <li><strong>Eclipse:</strong> Free, large plugin ecosystem, but slower and less modern UI</li>
        <li><strong>VS Code:</strong> Lightweight, great for web dev, but Java support is less mature</li>
        <li><strong>NetBeans:</strong> Good Maven/Gradle support, but smaller community</li>
        <li><strong>Recommendation:</strong> IntelliJ Community Edition for most Java developers</li>
      </ul>
    </div>

    <h2>Next Steps</h2>
    
    <div class="explanation-list">
      <ul>
        <li>Practice keyboard shortcuts daily - become a keyboard ninja</li>
        <li>Explore Live Templates and Postfix Completion for faster coding</li>
        <li>Learn advanced debugging: conditional breakpoints, evaluate expressions</li>
        <li>Master refactoring tools: extract method, rename, change signature</li>
        <li>Set up code style and share with team (.editorconfig file)</li>
        <li>Use TODO tool window to track tasks: Alt + 6</li>
        <li>Explore database tools (Ultimate) or install DBeaver separately</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Install and configure IntelliJ IDEA for Java development",
    "Set up Java SDK and understand JDK versions",
    "Create Maven, Gradle, and Spring Boot projects",
    "Master essential keyboard shortcuts for productivity",
    "Use debugging tools effectively with breakpoints and watches",
    "Install and configure essential plugins",
    "Understand project structure and build tools integration",
    "Troubleshoot common IntelliJ issues",
  ],
  practiceInstructions: [
    "Download and install IntelliJ IDEA Community Edition",
    "Configure a Java 17 or 21 SDK using the built-in downloader",
    "Create a new Maven project with JUnit dependencies",
    "Write a simple Java class and run it using the green arrow",
    "Set breakpoints and debug your application",
    "Install at least 3 recommended plugins (Lombok, SonarLint, Rainbow Brackets)",
    "Practice 10 essential keyboard shortcuts until they become muscle memory",
    "Create a Spring Boot project using Spring Initializr integration",
  ],
  hints: [
    "Use Ctrl + Shift + A (Find Action) when you forget a shortcut",
    "IntelliJ Community Edition is free and sufficient for most Java development",
    "Spring Initializr integration requires Internet connection",
    "Maven projects need pom.xml to be recognized properly",
    "Right-click on src folders to mark them as Sources/Test Sources/Resources",
    "Use Ctrl + B to navigate to any class/method declaration quickly",
    "File → Invalidate Caches fixes most mysterious IntelliJ issues",
  ],
  solution: `// Complete IntelliJ IDEA setup checklist:

// 1. Installation
// - Download from jetbrains.com/idea
// - Choose Community (free) or Ultimate (paid with trial)
// - Run installer and follow setup wizard

// 2. Initial Configuration
// - Select UI theme (Darcula for dark mode)
// - Keep default keymap (IntelliJ IDEA)
// - Download JDK 17 or 21 via File → Project Structure → SDKs

// 3. Create Spring Boot Project
// - File → New → Project
// - Select Spring Initializr
// - Add dependencies: Spring Web, Spring Data JPA, PostgreSQL
// - Click Create

// 4. Configure Application
// Edit src/main/resources/application.properties:
// spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
// spring.datasource.username=postgres
// spring.datasource.password=password

// 5. Run Application
// - Open main application class
// - Click green arrow next to main() method
// - Or Shift + F10

// 6. Essential Shortcuts to Practice
// Ctrl + N        - Find class
// Ctrl + Space    - Code completion
// Alt + Enter     - Quick fix
// Ctrl + Alt + L  - Format code
// Shift + F10     - Run
// Shift + F9      - Debug

// 7. Recommended Plugins
// - Lombok (boilerplate reduction)
// - SonarLint (code quality)
// - Rainbow Brackets (readability)
// - GitToolBox (Git enhancements)

// You're now ready to develop Java applications in IntelliJ IDEA!`,
};
