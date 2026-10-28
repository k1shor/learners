export const coursesData = [
    {
      Title: "Introduction to React",
      "Course-Code": "CS101",
      Instructor: "Dr. Jane Smith",
      Duration: "8 Weeks",
      durationWeeks: 8,
      Time: "10:00 AM - 11:30 AM",
      "Start-date": "Oct 1, 2026",
      Description:
        "Master the fundamentals of React, including components, props, state management, and hooks to build modern web applications.",
      Materials: "React Cheatsheet, Starter Files, Slide Decks",
      videos: [
        {
          title: "Day 1: Introduction & Environment Setup",
          duration: "45 mins",
          content:
            "Overview of React ecosystem, Node setup, and building the first component structure.",
        },
        {
          title: "Day 2: Components and Props",
          duration: "60 mins",
          content:
            "Learning how to pass data cleanly between parent and child components using props.",
        },
        {
          title: "Day 3: State and Lifecycle Hooks",
          duration: "55 mins",
          content:
            "Managing internal component state using the useState hook and understanding renders.",
        },
        {
          title: "Day 4: Handling Events and Forms",
          duration: "50 mins",
          content:
            "Managing user inputs, controlled components, and form submissions.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Foundations & JSX Architecture",
          desc: "Understanding the virtual DOM and setting up Vite.",
        },
        {
          title: "Module 2: Props, State & Event Handling",
          desc: "Managing component states and passing data securely.",
        },
        {
          title: "Module 3: Hooks & Side Effects",
          desc: "Mastering useEffect, useRef, and custom hooks.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Component Tree Design",
          dueDate: "Oct 15, 2026",
          details:
            "Create a multi-component layout replicating a dashboard interface.",
          isCompleted: false,
        },
        {
          title: "Assignment 2: Counter & State Tracker",
          dueDate: "Oct 25, 2026",
          details:
            "Build an interactive tracker using useState with persistent local storage.",
          isCompleted: false,
        },
      ],
      participants: [
        {
          name: "Alice Smith",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        },
        {
          name: "Bob Jones",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        },
        {
          name: "Charlie Brown",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        },
      ],
    },
    {
      Title: "Advanced JavaScript",
      "Course-Code": "CS201",
      Instructor: "Prof. John Doe",
      Duration: "6 Weeks",
      durationWeeks: 6,
      Time: "2:00 PM - 3:30 PM",
      "Start-date": "Aug 1, 2026",
      Description:
        "Deep dive into asynchronous JavaScript, closures, prototypes, ES6+ features, and modern performance optimization techniques.",
      Materials: "JS Handbook, Code Snippets Repository",
      videos: [
        {
          title: "Day 1: Asynchronous JS & Callbacks",
          duration: "50 mins",
          content:
            "Understanding the event loop, call stack, and asynchronous callback patterns.",
        },
        {
          title: "Day 2: Promises and Async/Await",
          duration: "65 mins",
          content:
            "Writing clean asynchronous code handling network fetch calls and error handling.",
        },
        {
          title: "Day 3: Closures and Prototypes",
          duration: "40 mins",
          content:
            "Deep inspection of lexical scoping, scope chains, and prototype inheritance.",
        },
        {
          title: "Day 4: Performance Optimization",
          duration: "60 mins",
          content:
            "Memory leaks, debouncing, throttling, and execution profiling.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Advanced Execution Contexts",
          desc: "Lexical scoping, scope chains, and closures.",
        },
        {
          title: "Module 2: Asynchronous Programming Patterns",
          desc: "Handling network requests and error boundaries.",
        },
        {
          title: "Module 3: ES6+ Modern Features",
          desc: "Destructuring, spread operators, and modules.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Custom Promise Implementation",
          dueDate: "Aug 15, 2026",
          details:
            "Recreate a basic version of JavaScript Promises from scratch.",
          isCompleted: true,
        },
        {
          title: "Assignment 2: Event Loop Analyzer",
          dueDate: "Sep 5, 2026",
          details:
            "Analyze complex synchronous/asynchronous output execution flows.",
          isCompleted: true,
        },
      ],
      participants: [
        {
          name: "Diana Prince",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        },
        {
          name: "Evan Wright",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        },
      ],
    },
    {
      Title: "UI/UX Design Fundamentals",
      "Course-Code": "DS105",
      Instructor: "Sarah Jenkins",
      Duration: "4 Weeks",
      durationWeeks: 4,
      Time: "11:00 AM - 12:30 PM",
      "Start-date": "Nov 10, 2026",
      Description:
        "Learn user research, wireframing, prototyping principles, and design systems using industry-standard tools.",
      Materials: "Figma UI Kit, Design Workbook",
      videos: [
        {
          title: "Day 1: User Research & Persona Creation",
          duration: "40 mins",
          content:
            "Conducting qualitative interviews and mapping target user archetypes.",
        },
        {
          title: "Day 2: Wireframing Basics",
          duration: "50 mins",
          content:
            "Drafting rapid low-fidelity layout wireframes to test structural flows.",
        },
        {
          title: "Day 3: Prototyping Principles",
          duration: "45 mins",
          content:
            "Adding interactive transitions and screen flows in design software.",
        },
        {
          title: "Day 4: Design Systems & Handoff",
          duration: "55 mins",
          content:
            "Structuring component token systems for developer design handoff.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: User-Centered Design Principles",
          desc: "Empathy mapping and target audience analysis.",
        },
        {
          title: "Module 2: Wireframing & Low-Fi Prototyping",
          desc: "Translating ideas into layout drafts.",
        },
        {
          title: "Module 3: High-Fi UI Design Systems",
          desc: "Creating reusable components and style guides.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Mobile Wireframe Flow",
          dueDate: "Nov 20, 2026",
          details:
            "Design a 5-screen mobile application wireframe user journey.",
          isCompleted: false,
        },
      ],
      participants: [
        {
          name: "Fiona Gallagher",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        },
        {
          name: "George Clark",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
        },
        {
          name: "Hannah Abbott",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        },
      ],
    },
    {
      Title: "Full-Stack Web Development",
      "Course-Code": "CS301",
      Instructor: "Alex Rivera",
      Duration: "12 Weeks",
      durationWeeks: 12,
      Time: "1:00 PM - 3:00 PM",
      "Start-date": "Nov 15, 2026",
      Description:
        "Build complete end-to-end web applications combining Node.js, Express, databases, and frontend frameworks.",
      Materials: "API Documentation, Postman Collection, Boilerplate Code",
      videos: [
        {
          title: "Day 1: Node.js & Express Setup",
          duration: "60 mins",
          content:
            "Initializing an Express backend server with routing middleware.",
        },
        {
          title: "Day 2: RESTful API Development",
          duration: "75 mins",
          content: "Implementing complete CRUD operations securely.",
        },
        {
          title: "Day 3: Connecting Databases",
          duration: "60 mins",
          content:
            "Integrating persistent database connections with query logic.",
        },
        {
          title: "Day 4: Authentication & Security",
          duration: "90 mins",
          content: "Securing endpoints using JWT tokens and password hashing.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Backend Architecture with Node.js",
          desc: "Building fast servers using Express middleware.",
        },
        {
          title: "Module 2: Database Integration & Queries",
          desc: "Connecting relational databases to server routes.",
        },
        {
          title: "Module 3: Full-Stack Integration & Deployment",
          desc: "Securing routes with JWT and deploying apps.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: REST API Build",
          dueDate: "Dec 10, 2026",
          details: "Develop a fully functional product catalog backend API.",
          isCompleted: false,
        },
      ],
      participants: [
        {
          name: "Ian Malcolm",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
        },
        {
          name: "Julia Roberts",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        },
      ],
    },
    {
      Title: "Database Management Systems",
      "Course-Code": "CS202",
      Instructor: "Dr. Emily Chen",
      Duration: "10 Weeks",
      durationWeeks: 10,
      Time: "9:00 AM - 10:30 AM",
      "Start-date": "Dec 1, 2026",
      Description:
        "Understand relational database design, SQL querying, indexing, normalization, and NoSQL fundamentals.",
      Materials: "SQL Query Reference Guide, Schema Diagrams",
      videos: [
        {
          title: "Day 1: Relational Model & ER Diagrams",
          duration: "45 mins",
          content:
            "Mapping out entity sets, relationships, and structural keys.",
        },
        {
          title: "Day 2: Basic & Advanced SQL Queries",
          duration: "60 mins",
          content:
            "Writing complex multi-table JOIN statements and aggregate groupings.",
        },
        {
          title: "Day 3: Normalization & Indexing",
          duration: "50 mins",
          content:
            "Eliminating redundancy through 1NF, 2NF, and 3NF normalization rules.",
        },
        {
          title: "Day 4: NoSQL Introduction",
          duration: "55 mins",
          content: "Introduction to unstructured document collections.",
        },
      ],
      syllabus: [
        {
          title: "Module 1: Relational Database Design",
          desc: "Entity relationships and primary/foreign keys.",
        },
        {
          title: "Module 2: Advanced SQL & Optimization",
          desc: "Joins, subqueries, aggregations, and performance indexing.",
        },
        {
          title: "Module 3: NoSQL Database Systems",
          desc: "Document-based stores and unstructured data handling.",
        },
      ],
      assignments: [
        {
          title: "Assignment 1: Schema Normalization Task",
          dueDate: "Dec 20, 2026",
          details:
            "Normalize an unformatted transactional table database up to 3NF.",
          isCompleted: false,
        },
      ],
      participants: [
        {
          name: "Kevin Bacon",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
        },
        {
          name: "Laura Croft",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
        },
        {
          name: "Michael Scott",
          role: "Student",
          avatar:
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
        },
      ],
    },
  ];
