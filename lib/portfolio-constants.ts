import type { FileType, TechStackItem } from "./portfolio-types"

export const files: FileType[] = [
  "AboutMe.js",
  "Skills.py",
  "Projects.json",
  "Experience.cpp",
  "settings.json",
  "DANGER_DO_NOT_OPEN.sh",
]

export const fileContent: Record<FileType, string> = {
  "AboutMe.js": `// AboutMe.js — Professional Profile

const profile = {
  name: "Hadar Knafo",

  headline:
    "Fourth-Year Software & Information Systems Engineering Student | Backend & Full-Stack Focus",

  education: {
    degree: "B.Sc. in Software and Information Systems Engineering",
    institution: "Ben-Gurion University of the Negev",
    status: "Fourth-year student",
    gpa: 85,
    honors: [
      "Moshal Program Member – leadership and excellence track for high-potential students"
    ],
    academicStrengths: {
      "Operating Systems": 93,
      "Algorithms": 93,
      "Advanced Topics in Software Development": 93
    }
  },

  about: \`
I am a fourth-year Software and Information Systems Engineering student at Ben-Gurion University of the Negev, with a strong academic foundation and a clear focus on software development.

My primary interests lie in backend and full-stack development, where I enjoy designing system logic, working with data and APIs, and building end-to-end features that translate real requirements into reliable, maintainable software.

Through academic projects and hands-on experience, I have worked on modular backend systems, full-stack web applications, database integration, and external API consumption. Alongside my technical background, I bring experience from leadership roles in high-responsibility, security-critical environments, which strengthened my ability to take ownership, think systematically, and work effectively within teams.

I am currently seeking a Software Engineering Internship or Student Developer position where I can contribute to real-world systems, grow as a developer, and continue building strong engineering foundations.
  \`,

  keyHighlights: [
    "Strong academic performance in core computer science courses",
    "Hands-on experience in backend and full-stack development",
    "Moshal Program member – leadership and excellence",
    "STEM Aspire Mentorship participant at Dell Technologies",
    "Outstanding Soldier award recipient (Hatzerim Air Force Base)",
    "Technical leadership and automation experience from military service"
  ],

  contact: {
    email: "Hadarknafo@gmail.com",
    linkedIn: "linkedin.com/in/hadar-knafo",
    phone: "054-3552316",
    location: "Israel (GMT+2)"
  },

  availability: {
    role: "Software Engineering Intern / Student Developer",
    start: "Immediate",
    workMode: ["On-site", "Hybrid", "Remote"]
  },

  getProfileSummary() {
    return {
      name: this.name,
      headline: this.headline,
      education: \`\${this.education.degree}, \${this.education.institution}\`,
      gpa: this.education.gpa,
      focus: "Backend & Full-Stack Development",
      availability: this.availability.role,
      contact: this.contact
    };
  }
};

export default profile;

console.log(profile.getProfileSummary());`,

      "Skills.py": `# Skills.py — Software Development Skills & Engineering Focus

class SkillsManager:
    def __init__(self):
        # Role focus
        self.role_focus = "Backend & Full-Stack Software Development"

        # Programming Languages
        self.languages = [
            "Java",
            "JavaScript",
            "Python",
            "C",
            "C#",
            "C++"
        ]

        # Backend & Full-Stack Capabilities
        self.backend_and_fullstack = [
            "RESTful API design and implementation",
            "Server-side logic and business rules",
            "Database integration and query design",
            "Modular and object-oriented system design"
        ]

        # Frameworks & Runtime
        self.frameworks = [
            "Node.js",
            "Vue.js"
        ]

        # Databases
        self.databases = [
            "SQL (relational database design)",
            "PostgreSQL",
            "MongoDB"
        ]

        # Core Engineering Skills
        self.engineering_skills = [
            "Data structures and algorithmic thinking",
            "Object-Oriented Programming (OOP)",
            "System-level problem solving",
            "Code readability and maintainability",
            "Debugging and troubleshooting"
        ]

        # Tools & Workflow
        self.tools = [
            "Git (version control & collaboration)",
            "Docker (containerized environments)",
            "Bash (command-line workflows)",
            "IDE-based development and debugging"
        ]

        # Collaboration & Work Practices
        self.collaboration = [
            "Team-based software development",
            "Code reviews and peer feedback",
            "Writing clear and structured documentation",
            "Breaking requirements into implementable tasks"
        ]

    def summary(self):
        return (
            "Software-focused skill set with emphasis on backend and full-stack development. "
            "Experienced in building modular systems, implementing server-side logic, "
            "working with databases and APIs, and collaborating in structured development workflows."
        )`,

  "Projects.json": `{
  "academic_projects": [
    {
      "title": "Recipe Management Web Application",
      "course": "Web Development Environments",
      "description": "Designed and developed a full-stack web application for searching, saving, and managing recipes, with emphasis on backend logic, data persistence, and external API integration.",
      "stack": ["JavaScript", "Node.js", "REST APIs", "SQL"],
      "features": [
        "Server-side implementation of business logic",
        "Relational database schema design and integration",
        "Integration with external Spoonacular API",
        "End-to-end feature development from requirements to implementation"
      ]
    },
    {
      "title": "Super-Lee Suppliers Management System",
      "course": "Software Systems Analysis and Design",
      "description": "Implemented a backend supplier management module handling agreements, delivery constraints, and pricing rules as part of a larger enterprise-style system.",
      "stack": ["Java", "Object-Oriented Programming", "Data Structures", "Git"],
      "methodology": "Modular, object-oriented system design developed collaboratively in a team environment"
    }
  ],
  "metadata": {
    "visual_summary": "Run to explore project structure and implementation details"
  }
}`,

      "Experience.cpp": `// Experience.cpp - Leadership & Technical Experience
#include <iostream>
#include <vector>
#include <string>

struct Role {
    std::string title;
    std::string period;
    std::string description;
};

class CareerPath {
public:
    void addRole(const Role& role) {
        experience.push_back(role);
    }

    void display() const {
        std::cout << "Professional Experience Timeline\\n";
        std::cout << "--------------------------------\\n";
        for (const auto& role : experience) {
            std::cout << role.period << " | " << role.title << std::endl;
            std::cout << "  - " << role.description << std::endl;
        }
    }

private:
    std::vector<Role> experience;
};

int main() {
    CareerPath career;

    career.addRole({
        "Air Intelligence Team Leader",
        "2018–2020",
        "Led and mentored a technical team in a security-critical environment. "
        "Managed secure information systems and designed computing and data-analysis processes "
        "to improve operational efficiency."
    });

    career.addRole({
        "Air Intelligence Technician",
        "2016–2018",
        "Provided technical support, troubleshooting, and system maintenance. "
        "Developed automation scripts to streamline daily technical workflows."
    });

    career.addRole({
        "Reserve Service – Air Intelligence",
        "2023–Present",
        "Active reserve service during the Iron Swords War, providing operational technical support."
    });

    // TODO: Implement next role
    // Title: Software Engineering Intern
    // Status: Open to opportunities

    career.display();
    return 0;
}`,

  "settings.json": `{
  "developer": {
    "priority": "Code Quality > Speed",
    "motivation": "Building products that matter",
    "work_mode": "Remote",
    "availability": "Immediate",
    "preferred_stack": ["React", "Next.js", "TypeScript"],
    "timezone": "GMT+2 (Israel)",
    "languages": ["Hebrew", "English"],
    "ideal_team_size": "5-15 people"
  },
  "preferences": {
    "code_reviews": true,
    "pair_programming": true,
    "agile_methodology": true,
    "continuous_learning": true
  },
  "communication": {
    "response_time": "< 2 hours",
    "meeting_preference": "Async-first",
    "documentation_style": "Comprehensive"
  }
}`,
  "DANGER_DO_NOT_OPEN.sh": `#!/bin/bash

# This script is intentionally left blank.
# Opening it triggers a simulated "meltdown" sequence.
# DO NOT OPEN unless you are prepared for the consequences.

echo "You shouldn't have opened this..."
sleep 1
echo "SYSTEM HALTED."
exit 1
`,
  "scratchpad.md": ``,
}

export const techStack: TechStackItem[] = [
  // Frontend Frameworks
  {
    name: "React",
    version: "v18.0.0",
    description: "A JavaScript library for building user interfaces",
    icon: "⚛️",
    verified: true,
  },
  {
    name: "Next.js",
    version: "v16.0.0",
    description: "The React Framework for Production",
    icon: "▲",
    verified: true,
  },
  {
    name: "Vue.js",
    version: "v3.4.0",
    description: "The Progressive JavaScript Framework",
    icon: "🖖",
    verified: true,
  },
  // Styling
  {
    name: "Tailwind CSS",
    version: "v4.0.0",
    description: "A utility-first CSS framework",
    icon: "🎨",
    verified: true,
  },
  // Programming Languages
  {
    name: "JavaScript",
    version: "ES2024",
    description: "High-level, dynamic scripting language",
    icon: "JS",
    verified: true,
  },
  {
    name: "TypeScript",
    version: "v5.3.0",
    description: "TypeScript is JavaScript with syntax for types",
    icon: "TS",
    verified: true,
  },
  {
    name: "Python",
    version: "v3.12.0",
    description: "Versatile language for AI, data science, and backend",
    icon: "🐍",
    verified: true,
  },
  {
    name: "Java",
    version: "v21.0",
    description: "Enterprise-grade object-oriented programming language",
    icon: "☕",
    verified: true,
  },
  {
    name: "C",
    version: "C17",
    description: "Powerful low-level systems programming language",
    icon: "🔧",
    verified: true,
  },
  {
    name: "C++",
    version: "C++20",
    description: "High-performance object-oriented programming",
    icon: "⚡",
    verified: true,
  },
  {
    name: "C#",
    version: "v12.0",
    description: "Modern, object-oriented language for .NET",
    icon: "C#",
    verified: true,
  },
  // Backend & Runtime
  {
    name: "Node.js",
    version: "v20.11.0",
    description: "JavaScript runtime built on Chrome's V8",
    icon: "🟢",
    verified: true,
  },
  // Databases
  {
    name: "SQL",
    version: "SQL:2023",
    description: "Standard language for relational database management",
    icon: "📊",
    verified: true,
  },
  {
    name: "PostgreSQL",
    version: "v16.1",
    description: "Advanced open source relational database",
    icon: "🐘",
    verified: true,
  },
  {
    name: "MongoDB",
    version: "v7.0",
    description: "Document-oriented NoSQL database",
    icon: "🍃",
    verified: true,
  },
  // CS Fundamentals
  {
    name: "Data Structures",
    version: "v2.0",
    description: "Efficient organization and storage of data",
    icon: "🗂️",
    verified: true,
  },
  {
    name: "Algorithms",
    version: "v3.0",
    description: "Problem-solving methods and optimization techniques",
    icon: "🧮",
    verified: true,
  },
  {
    name: "OOP",
    version: "v4.0",
    description: "Object-Oriented Programming principles and patterns",
    icon: "📦",
    verified: true,
  },
  // Tools
  {
    name: "Git",
    version: "v2.43",
    description: "Distributed version control system",
    icon: "🔀",
    verified: true,
  },
  {
    name: "Docker",
    version: "v24.0",
    description: "Containerization platform for modern applications",
    icon: "🐳",
    verified: true,
  },
  {
    name: "Bash",
    version: "v5.2",
    description: "Unix shell and command language",
    icon: "💻",
    verified: true,
  },
  // Special
  {
    name: "Empathy & Teamwork",
    version: "v∞",
    description: "Soft skills that make great teams work",
    icon: "🤝",
    verified: true,
    special: true,
  },
]
