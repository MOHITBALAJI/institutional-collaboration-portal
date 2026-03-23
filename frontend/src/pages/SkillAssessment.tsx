import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Brain, Trophy, Award, Clock, CheckCircle2, XCircle, Star,
    Zap, Target, ChevronRight, ChevronDown, Download, Shield, Flame, ArrowRight, RotateCcw
} from "lucide-react";

interface Quiz {
    id: string;
    title: string;
    domain: string;
    questions: number;
    duration: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    icon: string;
    color: string;
    completedBy: number;
    passingScore: number;
}

interface Question {
    id: number;
    text: string;
    options: string[];
    correct: number;
}

interface BadgeItem {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    earned: boolean;
    earnedDate?: string;
    requirement: string;
}

const quizzes: Quiz[] = [
    { id: "1", title: "Data Structures & Algorithms", domain: "Computer Science", questions: 20, duration: "20 min", difficulty: "Intermediate", icon: "🧮", color: "from-blue-500 to-cyan-500", completedBy: 342, passingScore: 80 },
    { id: "2", title: "Web Development Fundamentals", domain: "Full Stack", questions: 20, duration: "20 min", difficulty: "Beginner", icon: "🌐", color: "from-emerald-500 to-green-500", completedBy: 567, passingScore: 80 },
    { id: "3", title: "Machine Learning Essentials", domain: "AI/ML", questions: 20, duration: "20 min", difficulty: "Advanced", icon: "🤖", color: "from-purple-500 to-pink-500", completedBy: 189, passingScore: 80 },
    { id: "4", title: "Database Management Systems", domain: "Backend", questions: 20, duration: "20 min", difficulty: "Intermediate", icon: "🗄️", color: "from-orange-500 to-amber-500", completedBy: 423, passingScore: 80 },
    { id: "5", title: "System Design Principles", domain: "Architecture", questions: 20, duration: "20 min", difficulty: "Advanced", icon: "🏗️", color: "from-red-500 to-rose-500", completedBy: 156, passingScore: 80 },
    { id: "6", title: "Cloud Computing & DevOps", domain: "Infrastructure", questions: 20, duration: "20 min", difficulty: "Intermediate", icon: "☁️", color: "from-sky-500 to-indigo-500", completedBy: 278, passingScore: 80 },
    { id: "7", title: "Cybersecurity Basics", domain: "Security", questions: 20, duration: "20 min", difficulty: "Beginner", icon: "🛡️", color: "from-slate-500 to-gray-500", completedBy: 112, passingScore: 80 },
    { id: "8", title: "Mobile App Development", domain: "Mobile", questions: 20, duration: "20 min", difficulty: "Intermediate", icon: "📱", color: "from-teal-500 to-emerald-500", completedBy: 204, passingScore: 80 },
    { id: "9", title: "UI/UX Design Principles", domain: "Design", questions: 20, duration: "20 min", difficulty: "Beginner", icon: "🎨", color: "from-pink-500 to-rose-400", completedBy: 395, passingScore: 80 },
    { id: "10", title: "Blockchain Fundamentals", domain: "Web3", questions: 20, duration: "20 min", difficulty: "Advanced", icon: "⛓️", color: "from-amber-400 to-orange-500", completedBy: 86, passingScore: 80 },
];

const quizQuestions: Record<string, Question[]> = {
    "1": [
        { id: 1, text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
        { id: 2, text: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Array", "Linked List"], correct: 1 },
        { id: 3, text: "What is the worst-case time complexity of quicksort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correct: 2 },
        { id: 4, text: "Which traversal visits the root node first?", options: ["Inorder", "Preorder", "Postorder", "Level Order"], correct: 1 },
        { id: 5, text: "What is a balanced BST?", options: ["All nodes have two children", "Height difference ≤ 1 for all subtrees", "All leaves at same level", "Root is the median"], correct: 1 },
        { id: 6, text: "Which sorting algorithm is arguably the best for almost sorted arrays?", options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Selection Sort"], correct: 2 },
        { id: 7, text: "What graph traversal algorithm uses a Queue?", options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"], correct: 1 },
        { id: 8, text: "What is the amortized time complexity of inserting into a dynamic array?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correct: 0 },
        { id: 9, text: "Which hashing collision resolution technique uses linked lists?", options: ["Linear Probing", "Quadratic Probing", "Double Hashing", "Separate Chaining"], correct: 3 },
        { id: 10, text: "What data structure is used to implement a priority queue?", options: ["Stack", "Linked List", "Heap", "Binary Search Tree"], correct: 2 },
        { id: 11, text: "Which of the following sorting algorithms has O(n log n) average time complexity?", options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], correct: 2 },
        { id: 12, text: "What is the height of a balanced binary tree with N nodes?", options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"], correct: 1 },
        { id: 13, text: "Which data structure is typically used for Dijkstra's algorithm?", options: ["Stack", "Queue", "Priority Queue", "Hash Map"], correct: 2 },
        { id: 14, text: "What is the primary difference between a set and a list?", options: ["Sets are ordered", "Lists contain unique elements", "Sets contain unique elements", "Lists are faster"], correct: 2 },
        { id: 15, text: "Which algorithm is used to find the shortest path in a weighted graph with no negative edges?", options: ["BFS", "DFS", "Dijkstra's", "Kruskal's"], correct: 2 },
        { id: 16, text: "What is the average time complexity for searching in a Hash Map?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 2 },
        { id: 17, text: "Which data structure is best for implementing a undo feature?", options: ["Queue", "Stack", "Linked List", "Tree"], correct: 1 },
        { id: 18, text: "What is the space complexity of an adjacency matrix for a graph with V vertices?", options: ["O(V)", "O(E)", "O(V²)", "O(V + E)"], correct: 2 },
        { id: 19, text: "Which tree traversal visited all nodes level by level?", options: ["In-order", "Pre-order", "Post-order", "Level-order (BFS)"], correct: 3 },
        { id: 20, text: "A circular linked list has no:", options: ["Nodes", "Edges", "NULL pointer", "Head"], correct: 2 }
    ],
    "2": [
        { id: 1, text: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Text Mark Language", "None of the above"], correct: 0 },
        { id: 2, text: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], correct: 2 },
        { id: 3, text: "What is the correct way to link an external JS file?", options: ["<script href='app.js'>", "<script src='app.js'>", "<link rel='script' href='app.js'>", "<js src='app.js'>"], correct: 1 },
        { id: 4, text: "What does CSS stand for?", options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"], correct: 2 },
        { id: 5, text: "Which HTML tag is used to display an image?", options: ["<pic>", "<image>", "<img>", "<src>"], correct: 2 },
        { id: 6, text: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Application Process Integration", "Automated Program Interface"], correct: 0 },
        { id: 7, text: "In CSS, how do you select an element with id 'header'?", options: [".header", "#header", "header", "*header"], correct: 1 },
        { id: 8, text: "Which HTTP method is used to create a new resource?", options: ["GET", "PUT", "POST", "DELETE"], correct: 2 },
        { id: 9, text: "What is 'React'?", options: ["A database", "A JavaScript library", "A CSS framework", "A backend language"], correct: 1 },
        { id: 10, text: "What does the 'typeof' operator in JavaScript return for an array?", options: ["array", "object", "string", "undefined"], correct: 1 },
        { id: 11, text: "Which HTML5 element is used for drawing graphics via JavaScript?", options: ["<graphics>", "<draw>", "<canvas>", "<paint>"], correct: 2 },
        { id: 12, text: "What is the purpose of the 'viewport' meta tag?", options: ["SEO", "Setting browser version", "Mobile responsiveness", "Loading fonts"], correct: 2 },
        { id: 13, text: "In Flexbox, which property aligns items along the main axis?", options: ["align-items", "justify-content", "align-content", "flex-direction"], correct: 1 },
        { id: 14, text: "Which JavaScript keyword is used to declare a block-scoped variable?", options: ["var", "let", "const", "both let and const"], correct: 3 },
        { id: 15, text: "What is the 'DOM'?", options: ["Data Object Mode", "Document Object Model", "Digital Output Management", "Direct Object Multiplier"], correct: 1 },
        { id: 16, text: "Which CSS unit is relative to the font-size of the root element?", options: ["em", "rem", "px", "vh"], correct: 1 },
        { id: 17, text: "How do you add a comment in CSS?", options: ["// comment", "# comment", "/* comment */", "<!-- comment -->"], correct: 2 },
        { id: 18, text: "Which of these is NOT a valid HTTP status code?", options: ["200", "404", "500", "600"], correct: 3 },
        { id: 19, text: "What does JSON stand for?", options: ["Java Semantic Object Notation", "JavaScript Object Notation", "JQuery Standard Object Name", "Joint System Online Network"], correct: 1 },
        { id: 20, text: "Which method is used to add an element to the end of an array in JS?", options: ["pop()", "shift()", "push()", "unshift()"], correct: 2 }
    ],
    "3": [
        { id: 1, text: "What is supervised learning?", options: ["Learning without labels", "Learning with labeled data", "Learning through rewards", "Learning from video"], correct: 1 },
        { id: 2, text: "Which algorithm is used for classification?", options: ["Linear Regression", "K-Means", "Logistic Regression", "PCA"], correct: 2 },
        { id: 3, text: "What is overfitting?", options: ["Model performs well on test data only", "Model performs well on training data but poorly on test data", "Model performs poorly on both", "Model has too few parameters"], correct: 1 },
        { id: 4, text: "What does CNN stand for in Deep Learning?", options: ["Computer Neural Network", "Convolutional Neural Network", "Complex Neural Network", "Control Neural Network"], correct: 1 },
        { id: 5, text: "Which loss function is commonly used for linear regression?", options: ["Cross-Entropy", "Mean Squared Error", "Hinge Loss", "Log Loss"], correct: 1 },
        { id: 6, text: "What is a common activation function?", options: ["ReLU", "Softmax", "Sigmoid", "All of the above"], correct: 3 },
        { id: 7, text: "What does PCA do?", options: ["Increases dimensions", "Reduces dimensionality", "Classifies images", "Predicts time series"], correct: 1 },
        { id: 8, text: "Which of these is an ensemble method?", options: ["Decision Tree", "Random Forest", "Naive Bayes", "SVM"], correct: 1 },
        { id: 9, text: "What is a 'hyperparameter'?", options: ["A parameter learned during training", "A parameter set before training", "A type of layer", "A performance metric"], correct: 1 },
        { id: 10, text: "What does 'k' in K-Means clustering represent?", options: ["Number of iterations", "Number of clusters", "Number of features", "Number of neurons"], correct: 1 },
        { id: 11, text: "What is a 'Turing Test'?", options: ["A test for speed", "A test for machine intelligence", "A test for hardware durability", "A math exam"], correct: 1 },
        { id: 12, text: "Which library is most popular for ML in Python?", options: ["Pandas", "NumPy", "Scikit-Learn", "Matplotlib"], correct: 2 },
        { id: 13, text: "What is 'Natural Language Processing' (NLP)?", options: ["Encoding audio", "Machines understanding human language", "Learning new languages", "A type of compiler"], correct: 1 },
        { id: 14, text: "In a Neural Network, what do 'Weights' represent?", options: ["Memory size", "The strength of association between neurons", "Number of layers", "The speed of training"], correct: 1 },
        { id: 15, text: "What is 'Reinforcement Learning'?", options: ["Training with hints", "Learning by trial and error based on rewards", "Learning from static images", "Memorizing facts"], correct: 1 },
        { id: 16, text: "What is a 'Gradient Descent'?", options: ["An optimization algorithm for finding the minimum of a function", "A type of neural network layer", "A data cleaning process", "A sorting algorithm"], correct: 0 },
        { id: 17, text: "What does 'Deep' in Deep Learning usually imply?", options: ["Complex math", "Multiple layers in a neural network", "Large datasets", "Expensive hardware"], correct: 1 },
        { id: 18, text: "What is an 'Autoencoder' used for?", options: ["Classification", "Dimensionality reduction or feature learning", "Regression", "Speech recognition"], correct: 1 },
        { id: 19, text: "What is 'Bias' in Machine Learning?", options: ["Preferring one class", "Underfitting", "Errors due to erroneous assumptions in the learning algorithm", "A type of loss function"], correct: 2 },
        { id: 20, text: "Which of these is used for time-series data?", options: ["CNN", "RNN / LSTM", "K-Means", "SVM"], correct: 1 }
    ],
    "4": [
        { id: 1, text: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Language", "System Query Language"], correct: 0 },
        { id: 2, text: "What is a Primary Key?", options: ["A key used by the DBA", "A unique identifier for a row", "A key used to encrypt data", "A foreign key to another table"], correct: 1 },
        { id: 3, text: "Which command is used to remove a table?", options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "TRUNCATE TABLE"], correct: 2 },
        { id: 4, text: "What does ACID stand for?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Consistency, Isolation, Durability", "Atomicity, Concurrency, Isolation, Durability", "Atomicity, Consistency, Integrity, Durability"], correct: 0 },
        { id: 5, text: "Which SQL clause is used to filter results?", options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], correct: 2 },
        { id: 6, text: "What is normalization?", options: ["Speeding up queries", "Organizing data to reduce redundancy", "Encrypting passwords", "Joining tables"], correct: 1 },
        { id: 7, text: "Which type of join returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correct: 3 },
        { id: 8, text: "What is an index used for?", options: ["Improving update speed", "Improving retrieval speed", "Reducing storage space", "Enforcing primary keys"], correct: 1 },
        { id: 9, text: "What does 'NoSQL' stand for?", options: ["No SQL Allowed", "Not Only SQL", "Non-Structured Query Language", "None of the above"], correct: 1 },
        { id: 10, text: "Which command undoes a transaction?", options: ["COMMIT", "REVERT", "ROLLBACK", "UNDO"], correct: 2 },
        { id: 11, text: "What is a Foreign Key?", options: ["A key used by a foreign developer", "A field that uniquely identifies a row in another table", "An encrypted key", "A temporary key"], correct: 1 },
        { id: 12, text: "Which SQL function counts the number of rows?", options: ["SUM()", "COUNT()", "TOTAL()", "MAX()"], correct: 1 },
        { id: 13, text: "What is a 'Database Schema'?", options: ["The data itself", "The formal description of the database structure", "A password", "A backup file"], correct: 1 },
        { id: 14, text: "Which statement is used to update data in a table?", options: ["MODIFY", "CHANGE", "UPDATE", "SAVE"], correct: 2 },
        { id: 15, text: "What is a 'Stored Procedure'?", options: ["A backup", "A set of SQL statements that can be saved and reused", "A type of table", "A hardware protocol"], correct: 1 },
        { id: 16, text: "What is 'Database Sharding'?", options: ["Deleting old data", "Splitting data across multiple databases", "Replicating data for backups", "Compressing the DB"], correct: 1 },
        { id: 17, text: "Which of these is a popular NoSQL database?", options: ["PostgreSQL", "MongoDB", "MySQL", "Oracle"], correct: 1 },
        { id: 18, text: "What does the 'DISTINCT' keyword do?", options: ["Adds new rows", "Returns only unique values", "Sorts the data", "Joins tables"], correct: 1 },
        { id: 19, text: "In SQL, how do you add a new column to a table?", options: ["INSERT COLUMN", "ADD COLUMN", "ALTER TABLE ADD", "UPDATE TABLE"], correct: 2 },
        { id: 20, text: "What's the difference between DELETE and TRUNCATE?", options: ["DELETE is faster", "TRUNCATE can be rolled back", "DELETE allows WHERE clause, TRUNCATE removes all rows", "There is no difference"], correct: 2 }
    ],
    "5": [
        { id: 1, text: "What is horizontal scaling?", options: ["Upgrading a single server", "Adding more servers", "Optimizing the database", "Caching data"], correct: 1 },
        { id: 2, text: "What does a Load Balancer do?", options: ["Stores data", "Distributes incoming network traffic", "Encrypts traffic", "Runs background jobs"], correct: 1 },
        { id: 3, text: "Which of these is a valid caching strategy?", options: ["Write-Through", "Write-Back", "Cache-Aside", "All of the above"], correct: 3 },
        { id: 4, text: "What is CAP theorem?", options: ["Consistency, Availability, Partition Tolerance", "Capacity, Availability, Performance", "Consistency, Accuracy, Partitioning", "Compute, Availability, Processing"], correct: 0 },
        { id: 5, text: "What is microservices architecture?", options: ["A monolithic application", "A collection of loosely coupled services", "A single tiered database", "A frontend framework"], correct: 1 },
        { id: 6, text: "What is the purpose of a CDN?", options: ["To store user passwords", "To execute serverless functions", "To cache and deliver static content globally", "To manage databases"], correct: 2 },
        { id: 7, text: "Which protocol is stateless?", options: ["WebSockets", "HTTP", "TCP", "FTP"], correct: 1 },
        { id: 8, text: "What is database sharding?", options: ["Backing up the DB", "Replicating the DB completely", "Partitioning data across multiple databases", "Encrypting the DB"], correct: 2 },
        { id: 9, text: "What is a message queue used for?", options: ["Synchronous communication", "Asynchronous communication", "Storing permanent data", "Load balancing HTTP traffic"], correct: 1 },
        { id: 10, text: "What does 'SPOF' stand for?", options: ["Single Point of Failure", "System Protocol of Forwarding", "Standard Performance Operating Framework", "Single Process Output File"], correct: 0 },
        { id: 11, text: "What is 'Latency'?", options: ["Storage capacity", "Download speed", "The time it takes for a request to travel from sender to receiver", "Server uptime"], correct: 2 },
        { id: 12, text: "What is a 'Reverse Proxy'?", options: ["A tool for developers", "A server that sits in front of web servers and forwards client requests", "A type of internet connection", "A private VPN"], correct: 1 },
        { id: 13, text: "What is 'Availability' in System Design?", options: ["Disk space", "The percentage of time a system is operational", "Number of users", "Security level"], correct: 1 },
        { id: 14, text: "What's the difference between SQL and NoSQL for scaling?", options: ["SQL scales horizontally easily", "NoSQL scales horizontally more easily", "Both scale identically", "SQL doesn't scale at all"], correct: 1 },
        { id: 15, text: "What does 'Idempotency' mean?", options: ["Encrypting data twice", "An operation that can be performed multiple times without changing the result beyond the initial application", "A fast database query", "A type of error"], correct: 1 },
        { id: 16, text: "What is 'Eventual Consistency'?", options: ["Data is never consistent", "Data will eventually become consistent across all nodes", "Strict consistency at all times", "An error state"], correct: 1 },
        { id: 17, text: "What is 'Sticky Sessions' in Load Balancing?", options: ["Storing data in cookies", "Ensuring a user's requests always go to the same server", "Auto-login feature", "High performance mode"], correct: 1 },
        { id: 18, text: "What is a 'Heartbeat' in distributed systems?", options: ["A CPU monitor", "A periodic message sent to monitor the health of a node", "A database backup", "A user interaction"], correct: 1 },
        { id: 19, text: "What does 'SOA' stand for?", options: ["Service Oriented Architecture", "System Operating Access", "Standard Object Application", "Single Online Account"], correct: 0 },
        { id: 20, text: "What is the purpose of 'Rate Limiting'?", options: ["To speed up the server", "To prevent abuse and ensure fair usage by limiting requests", "To charge users more", "To monitor bandwidth"], correct: 1 }
    ],
    "6": [
        { id: 1, text: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Delivery", "Cloud Integration / Cloud Deployment", "Continuous Iteration / Continuous Design"], correct: 0 },
        { id: 2, text: "Which tool is used for containerization?", options: ["Jenkins", "Docker", "Ansible", "Terraform"], correct: 1 },
        { id: 3, text: "What is Kubernetes primarily used for?", options: ["Writing code", "Container orchestration", "Version control", "Database management"], correct: 1 },
        { id: 4, text: "What is Infrastructure as Code (IaC)?", options: ["Writing Java code for hardware", "Managing infrastructure via config files", "Hosting code on GitHub", "Using scripts to test UI"], correct: 1 },
        { id: 5, text: "What is a Serverless architecture?", options: ["Running without the internet", "Running without operating systems", "Cloud provider dynamically manages server allocation", "Running entirely on the client side"], correct: 2 },
        { id: 6, text: "Which of these is an AWS compute service?", options: ["S3", "RDS", "EC2", "DynamoDB"], correct: 2 },
        { id: 7, text: "What does a reverse proxy do?", options: ["Forwards client requests to backend servers", "Protects clients from malicious websites", "Stores database backups", "Compiles code"], correct: 0 },
        { id: 8, text: "Which of these is a typical CI tool?", options: ["Kubernetes", "GitHub Actions", "Nginx", "PostgreSQL"], correct: 1 },
        { id: 9, text: "What is Blue/Green Deployment?", options: ["Deploying to two environments to reduce downtime", "A UI color scheme", "Deploying only during the day", "Green-energy cloud servers"], correct: 0 },
        { id: 10, text: "What is 'Terraform' commonly used for?", options: ["Container creation", "Infrastructure provisioning", "Log aggregation", "Monitoring"], correct: 1 }
    ],
    "7": [
        { id: 1, text: "What does SSL stand for?", options: ["Secure Socket Layer", "System Security Level", "Standard Security Logic", "Secure System Layer"], correct: 0 },
        { id: 2, text: "What is a Phishing attack?", options: ["Hacking a database", "Tricking users into revealing info", "Overloading a server", "Encrypting user files for ransom"], correct: 1 },
        { id: 3, text: "Which of these is a symmetric encryption algorithm?", options: ["RSA", "AES", "ECC", "Diffie-Hellman"], correct: 1 },
        { id: 4, text: "What does DDoS stand for?", options: ["Direct Data Output Stream", "Distributed Denial of Service", "Digital Data OS", "Dynamic Denial of Service"], correct: 1 },
        { id: 5, text: "What is a VPN used for?", options: ["Making the computer run faster", "Creating a secure, encrypted connection", "Blocking all ads", "Detecting viruses"], correct: 1 },
        { id: 6, text: "What does 'MFA' mean?", options: ["Multi-Factor Authentication", "Main Firewall Access", "Malware Filter Application", "Masked File Access"], correct: 0 },
        { id: 7, text: "What is SQL Injection?", options: ["Inserting data into a DB", "A technique to exploit DB vulnerabilities", "A way to speed up queries", "A backup strategy"], correct: 1 },
        { id: 8, text: "What is the purpose of a Firewall?", options: ["To speed up internet", "To monitor and control network traffic", "To back up files", "To encrypt passwords"], correct: 1 },
        { id: 9, text: "What is 'Ransomware'?", options: ["Software that acts as a firewall", "Malware that encrypts files demanding payment", "A type of antivirus", "A secure operating system"], correct: 1 },
        { id: 10, text: "Which principle means giving users only the access they need?", options: ["Maximum Access", "Principle of Least Privilege", "Zero Trust", "Total Redundancy"], correct: 1 }
    ],
    "8": [
        { id: 1, text: "Which language is primarily used for native iOS app development?", options: ["Java", "Swift", "Kotlin", "C#"], correct: 1 },
        { id: 2, text: "Which framework is used for cross-platform app development by Google?", options: ["React Native", "Flutter", "Ionic", "Xamarin"], correct: 1 },
        { id: 3, text: "What language is primarily used for native Android development?", options: ["Swift", "C++", "Kotlin", "Objective-C"], correct: 2 },
        { id: 4, text: "What does APK stand for?", options: ["Android Package Kit", "Apple Program Key", "Application Process Kit", "Advanced Platform Key"], correct: 0 },
        { id: 5, text: "What is the entry point of a React Native app?", options: ["index.js/App.js", "main.swift", "MainActivity.kt", "app.html"], correct: 0 },
        { id: 6, text: "Which IDE is standard for native Android development?", options: ["Xcode", "Visual Studio Code", "Android Studio", "Eclipse"], correct: 2 },
        { id: 7, text: "What does responsive design in mobile mean?", options: ["App runs fast", "App UI adapts to different screen sizes", "App responds quickly to touches", "App has a backend"], correct: 1 },
        { id: 8, text: "What is 'State' in mobile app programming?", options: ["The location of the user", "Data that determines component rendering", "The battery level", "The network status"], correct: 1 },
        { id: 9, text: "Which component is used for scrolling lists in React Native?", options: ["<View>", "<ScrollView>", "<Text>", "<Container>"], correct: 1 },
        { id: 10, text: "What is the Apple equivalent of the Google Play Store?", options: ["Mac Store", "App Store", "Apple Play", "iStore"], correct: 1 }
    ],
    "9": [
        { id: 1, text: "What does UX stand for?", options: ["User Exchange", "Universal Experience", "User Experience", "User Extension"], correct: 2 },
        { id: 2, text: "What does UI stand for?", options: ["User Interface", "User Integration", "Universal Interface", "Unique Interaction"], correct: 0 },
        { id: 3, text: "Which of the following is an example of a UI tool?", options: ["Figma", "Visual Studio Code", "Postman", "Docker"], correct: 0 },
        { id: 4, text: "What is a 'wireframe'?", options: ["A finished app", "A basic visual guide of a layout", "A color palette", "A piece of code"], correct: 1 },
        { id: 5, text: "What does 'accessibility' in UX refer to?", options: ["How fast an app loads", "Making products usable by people with disabilities", "How cheap an app is", "Where an app is hosted"], correct: 1 },
        { id: 6, text: "What is a 'Persona' in UX design?", options: ["A fictional character representing a user type", "A type of font", "A color scheme", "A coding language"], correct: 0 },
        { id: 7, text: "Which color conveys 'Error' or 'Stop' primarily?", options: ["Green", "Blue", "Red", "Yellow"], correct: 2 },
        { id: 8, text: "What is 'White Space' in design?", options: ["Empty space intentionally left blank", "A broken image", "Text written in white color", "A cloud background"], correct: 0 },
        { id: 9, text: "What is A/B Testing?", options: ["Testing code for bugs", "Comparing two versions of a design to see which performs better", "Testing across Android and iOS", "Automated UI tests"], correct: 1 },
        { id: 10, text: "What is the 'Golden Ratio'?", options: ["1:1", "1:1.618", "1:2", "1:3.14"], correct: 1 }
    ],
    "10": [
        { id: 1, text: "What is a Blockchain?", options: ["A physical chain", "A centralized database", "A distributed, decentralized ledger", "An encryption algorithm"], correct: 2 },
        { id: 2, text: "Who is the pseudonymous creator of Bitcoin?", options: ["Vitalik Buterin", "Satoshi Nakamoto", "Elon Musk", "Charlie Lee"], correct: 1 },
        { id: 3, text: "What is a 'Smart Contract'?", options: ["A legal agreement", "Self-executing code on a blockchain", "An AI program", "A password manager"], correct: 1 },
        { id: 4, text: "Which consensus mechanism does Bitcoin use?", options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of Authority"], correct: 1 },
        { id: 5, text: "What does 'Decentralization' mean in Blockchain?", options: ["No single entity controls the network", "The network is controlled by the government", "Data is stored on one supercomputer", "All users must be anonymous"], correct: 0 },
        { id: 6, text: "Which blockchain platform is famous for introducing smart contracts?", options: ["Bitcoin", "Ethereum", "Ripple", "Dogecoin"], correct: 1 },
        { id: 7, text: "What is a 'Wallet' in cryptography?", options: ["A software that stores public/private keys", "A physical purse", "A bank account", "An exchange platform"], correct: 0 },
        { id: 8, text: "What does 'Gas' mean in Ethereum?", options: ["Fuel for servers", "A fee required to execute operations", "A cryptocurrency token", "A hacking technique"], correct: 1 },
        { id: 9, text: "What is a 'dApp'?", options: ["A deleted app", "A decentralized application", "A database wrapper", "A desktop application"], correct: 1 },
        { id: 10, text: "What is a 'Hash' in blockchain?", options: ["A unique fixed-length string representing data", "A type of coffee", "A mining rig", "A consensus protocol"], correct: 0 }
    ]
};

const badges: BadgeItem[] = [
    { id: "1", title: "First Quiz", description: "Complete your first assessment", icon: Star, color: "text-amber-500", earned: true, earnedDate: "2024-01-15", requirement: "Complete 1 quiz" },
    { id: "2", title: "Quick Learner", description: "Score 90%+ on any quiz", icon: Zap, color: "text-blue-500", earned: true, earnedDate: "2024-02-10", requirement: "Score ≥ 90%" },
    { id: "3", title: "Knowledge Seeker", description: "Complete 5 different assessments", icon: Brain, color: "text-purple-500", earned: false, requirement: "Complete 5 quizzes" },
    { id: "4", title: "Domain Expert", description: "Score 95%+ in any domain", icon: Trophy, color: "text-yellow-500", earned: false, requirement: "Score ≥ 95%" },
    { id: "5", title: "Perfectionist", description: "Get a perfect score on any quiz", icon: Target, color: "text-emerald-500", earned: false, requirement: "Score 100%" },
    { id: "6", title: "Iron Will", description: "Complete 10 assessments", icon: Shield, color: "text-red-500", earned: false, requirement: "Complete 10 quizzes" },
    { id: "7", title: "Streak Master", description: "Complete quizzes 7 days in a row", icon: Flame, color: "text-orange-500", earned: false, requirement: "7-day streak" },
    { id: "8", title: "All-Rounder", description: "Pass quizzes in all domains", icon: Award, color: "text-indigo-500", earned: false, requirement: "Pass all domains" },
];

const difficultyColor = (d: string) => {
    if (d === "Beginner") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (d === "Intermediate") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
};

export default function SkillAssessment() {
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [quizState, setQuizState] = useState<"idle" | "intro" | "active" | "result">("idle");
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(300);
    const [showCertificate, setShowCertificate] = useState(false);
    const [certificateName, setCertificateName] = useState("");
    const [showReview, setShowReview] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (quizState === "active" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && quizState === "active") {
            setQuizState("result");
        }
        return () => clearInterval(timer);
    }, [quizState, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const startQuiz = (quiz: Quiz) => {
        setActiveQuiz(quiz);
        setQuizState("intro");
        setCurrentQ(0);
        setAnswers({});
        setShowReview(false);
        // Parse "30 min" -> 30 * 60 seconds
        const minutes = parseInt(quiz.duration.split(" ")[0]);
        setTimeLeft(minutes * 60 || 300);
    };

    const beginTest = () => {
        setQuizState("active");
    };

    const selectAnswer = (qId: number, optIndex: number) => {
        setAnswers(prev => ({ ...prev, [qId]: optIndex }));
    };

    const finishQuiz = () => {
        setQuizState("result");
    };

    const handleDownloadCertificate = async () => {
        if (!certificateRef.current) return;
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: null,
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `${certificateName.replace(/\s+/g, '_')}_${activeQuiz?.title.replace(/\s+/g, '_')}_Certificate.png`;
            link.click();
            setShowCertificate(false);
        } catch (error) {
            console.error("Failed to generate certificate", error);
        }
    };

    const currentQuizQuestions = activeQuiz ? quizQuestions[activeQuiz.id] : [];

    const score = Object.entries(answers).reduce((acc, [qId, ans]) => {
        const q = currentQuizQuestions.find(q => q.id === Number(qId));
        return acc + (q && q.correct === ans ? 1 : 0);
    }, 0);

    const scorePercent = currentQuizQuestions.length > 0 ? Math.round((score / currentQuizQuestions.length) * 100) : 0;
    const passed = scorePercent >= 80;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold font-display">Skill <span className="gradient-text">Assessment</span></h1>
                        <p className="text-muted-foreground">Test your knowledge, earn certificates & badges</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                            <Trophy className="h-3.5 w-3.5 text-amber-500" /> 2 Certificates
                        </Badge>
                        <Badge variant="secondary" className="gap-1 px-3 py-1.5">
                            <Award className="h-3.5 w-3.5 text-blue-500" /> 2/8 Badges
                        </Badge>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Quizzes Taken", value: "8", icon: Brain, color: "text-primary bg-primary/10" },
                        { label: "Avg. Score", value: "87%", icon: Target, color: "text-emerald-500 bg-emerald-500/10" },
                        { label: "Certificates", value: "2", icon: Award, color: "text-amber-500 bg-amber-500/10" },
                        { label: "Active Streak", value: "3 days", icon: Flame, color: "text-orange-500 bg-orange-500/10" },
                    ].map(s => (
                        <Card key={s.label} variant="glass">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`}>
                                    <s.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{s.value}</p>
                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="quizzes" className="space-y-4">
                    <TabsList className="bg-muted/50">
                        <TabsTrigger value="quizzes">Available Quizzes</TabsTrigger>
                        <TabsTrigger value="badges">Badges & Certificates</TabsTrigger>
                        <TabsTrigger value="history">My History</TabsTrigger>
                    </TabsList>

                    {/* Quizzes Tab */}
                    <TabsContent value="quizzes" className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map(quiz => (
                                <Card key={quiz.id} variant="glass" className="group hover:ring-2 hover:ring-primary/30 transition-all duration-300 overflow-hidden">
                                    <div className={`h-1.5 bg-gradient-to-r ${quiz.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="text-3xl">{quiz.icon}</div>
                                            <Badge variant="outline" className={difficultyColor(quiz.difficulty)}>
                                                {quiz.difficulty}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{quiz.title}</h3>
                                            <p className="text-xs text-muted-foreground">{quiz.domain}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Brain className="h-3 w-3" /> {quiz.questions} questions</span>
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {quiz.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground">{quiz.completedBy} completions</span>
                                            <Button size="sm" variant="gradient" className="gap-1" onClick={() => startQuiz(quiz)}>
                                                Start <ArrowRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Badges Tab */}
                    <TabsContent value="badges" className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {badges.map(badge => (
                                <Card key={badge.id} variant="glass" className={`transition-all duration-300 ${badge.earned ? "ring-1 ring-primary/20" : "opacity-60"}`}>
                                    <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                                        <div className={`h-16 w-16 rounded-full flex items-center justify-center ${badge.earned ? "bg-primary/10" : "bg-muted/50"}`}>
                                            <badge.icon className={`h-8 w-8 ${badge.earned ? badge.color : "text-muted-foreground/50"}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">{badge.title}</h4>
                                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                                        </div>
                                        {badge.earned ? (
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-[10px]">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Earned {badge.earnedDate}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px]">{badge.requirement}</Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-4">
                        <Card variant="glass">
                            <CardHeader><CardTitle className="text-lg">Recent Assessments</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { title: "Web Development Fundamentals", score: 92, date: "Mar 3, 2026", passed: true },
                                    { title: "Data Structures & Algorithms", score: 85, date: "Feb 28, 2026", passed: true },
                                    { title: "Machine Learning Essentials", score: 72, date: "Feb 25, 2026", passed: false },
                                ].map((h, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {h.passed ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                            <div>
                                                <p className="font-medium text-sm">{h.title}</p>
                                                <p className="text-[10px] text-muted-foreground">{h.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-lg font-bold ${h.passed ? "text-emerald-500" : "text-red-500"}`}>{h.score}%</span>
                                            <Button size="sm" variant="outline" className="gap-1">
                                                <RotateCcw className="h-3 w-3" /> Retry
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quiz Dialog */}
                <Dialog open={quizState !== "idle"} onOpenChange={() => { setQuizState("idle"); setActiveQuiz(null); }}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        {quizState === "intro" ? (
                            <div className="space-y-6 py-4">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                                            {activeQuiz?.icon}
                                        </div>
                                        {activeQuiz?.title}
                                    </DialogTitle>
                                    <DialogDescription>Review the details before starting your assessment</DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Questions</p>
                                        <p className="text-xl font-bold">{activeQuiz?.questions} Questions</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Duration</p>
                                        <p className="text-xl font-bold flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-primary" /> {activeQuiz?.duration}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Passing Score</p>
                                        <p className="text-xl font-bold text-emerald-500">{activeQuiz?.passingScore}%</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Difficulty</p>
                                        <Badge variant="outline" className={cn("mt-1", activeQuiz && difficultyColor(activeQuiz.difficulty))}>
                                            {activeQuiz?.difficulty}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                                    <h4 className="font-bold flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-primary" /> Instructions
                                    </h4>
                                    <ul className="text-sm space-y-2 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                                            Once started, the timer cannot be paused.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                                            You must answer all questions to submit.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                                            A score of 80% or higher is required for certification.
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setQuizState("idle")}>Cancel</Button>
                                    <Button variant="gradient" className="flex-1 text-lg py-6" onClick={beginTest}>
                                        Start Test <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ) : quizState === "active" ? (
                            <div className="space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center justify-between">
                                        <span>{activeQuiz?.title}</span>
                                        <Badge variant={timeLeft < 60 ? "destructive" : "outline"} className="gap-1">
                                            <Clock className="h-3 w-3" /> {formatTime(timeLeft)}
                                        </Badge>
                                    </DialogTitle>
                                    <DialogDescription>Question {currentQ + 1} of {currentQuizQuestions.length}</DialogDescription>
                                </DialogHeader>
                                <Progress value={((currentQ + 1) / currentQuizQuestions.length) * 100} className="h-2" />
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">{currentQuizQuestions[currentQ].text}</h3>
                                    <div className="grid gap-2">
                                        {currentQuizQuestions[currentQ].options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => selectAnswer(currentQuizQuestions[currentQ].id, i)}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${answers[currentQuizQuestions[currentQ].id] === i
                                                    ? "border-primary bg-primary/10 shadow-md"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                                    }`}
                                            >
                                                <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <Button variant="outline" disabled={currentQ === 0} onClick={() => setCurrentQ(c => c - 1)}>Previous</Button>
                                    {currentQ < currentQuizQuestions.length - 1 ? (
                                        <Button variant="gradient" onClick={() => setCurrentQ(c => c + 1)} disabled={answers[currentQuizQuestions[currentQ].id] === undefined}>
                                            Next <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    ) : (
                                        <Button variant="gradient" onClick={finishQuiz} disabled={Object.keys(answers).length !== currentQuizQuestions.length}>
                                            End Test
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : quizState === "result" ? (
                            <div className="text-center space-y-6 py-4">
                                <div className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center ${passed ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}`}>
                                    {passed ? <Trophy className="h-12 w-12" /> : <XCircle className="h-12 w-12" />}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">{scorePercent}%</h2>
                                    <p className="text-muted-foreground">{score}/{currentQuizQuestions.length} correct answers</p>
                                </div>
                                <p className={`text-lg font-semibold ${passed ? "text-emerald-500" : "text-red-500"}`}>
                                    {passed ? "🎉 Congratulations! You passed!" : "Keep practicing! You need 80% to pass."}
                                </p>
                                {passed && (
                                    <div className="pt-4 border-t border-border mt-4">
                                        <Label htmlFor="certName" className="text-left block text-sm mb-2 text-muted-foreground">Name on Certificate</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="certName"
                                                autoFocus
                                                placeholder="Enter your full name..."
                                                value={certificateName}
                                                onChange={e => setCertificateName(e.target.value)}
                                            />
                                            <Button variant="gradient" disabled={!certificateName.trim()} onClick={() => setShowCertificate(true)}>
                                                Get Certificate
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" onClick={() => { setQuizState("idle"); setActiveQuiz(null); setShowReview(false); }}>Back to Quizzes</Button>
                                    <Button variant="outline" onClick={() => { setQuizState("active"); setCurrentQ(0); setAnswers({}); setShowReview(false); }}>
                                        <RotateCcw className="h-4 w-4 mr-1" /> Retry
                                    </Button>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="w-full text-primary hover:text-primary/80 hover:bg-primary/5"
                                    onClick={() => setShowReview(!showReview)}
                                >
                                    {showReview ? "Hide Results Review" : "Review All Answers"}
                                    <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", showReview && "rotate-180")} />
                                </Button>

                                {showReview && (
                                    <div className="text-left space-y-6 pt-4 border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <Brain className="h-5 w-5 text-primary" /> Answers Review
                                        </h3>
                                        {currentQuizQuestions.map((q, idx) => {
                                            const userAnswer = answers[q.id];
                                            const isCorrect = userAnswer === q.correct;
                                            return (
                                                <div key={idx} className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                                                    <div className="flex items-start gap-3">
                                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        <p className="font-medium text-sm leading-relaxed">{q.text}</p>
                                                    </div>
                                                    <div className="grid gap-2 pl-9">
                                                        {q.options.map((opt, optIdx) => {
                                                            const isUserChoice = userAnswer === optIdx;
                                                            const isCorrectChoice = q.correct === optIdx;

                                                            let variant = "border-border/50 opacity-60";
                                                            let icon = null;

                                                            if (isCorrectChoice) {
                                                                variant = "border-emerald-500 bg-emerald-500/10 opacity-100";
                                                                icon = <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
                                                            } else if (isUserChoice && !isCorrect) {
                                                                variant = "border-red-500 bg-red-500/10 opacity-100";
                                                                icon = <XCircle className="h-4 w-4 text-red-500" />;
                                                            }

                                                            return (
                                                                <div
                                                                    key={optIdx}
                                                                    className={cn(
                                                                        "flex items-center justify-between p-3 rounded-lg border text-xs transition-colors",
                                                                        variant
                                                                    )}
                                                                >
                                                                    <span className={cn(isUserChoice && "font-bold")}>
                                                                        {String.fromCharCode(65 + optIdx)}. {opt}
                                                                        {isUserChoice && !isCorrectChoice && <span className="ml-2 text-[10px] text-red-500">(Your Answer)</span>}
                                                                        {isCorrectChoice && <span className="ml-2 text-[10px] text-emerald-500">(Correct Answer)</span>}
                                                                    </span>
                                                                    {icon}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </DialogContent>
                </Dialog>

                {/* Certificate Dialog */}
                <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
                    <DialogContent className="max-w-[95vw] sm:max-w-[800px] p-2 sm:p-6 overflow-hidden">
                        <DialogHeader className="px-4">
                            <DialogTitle>Your Certificate</DialogTitle>
                            <DialogDescription>Download your achievement certificate below</DialogDescription>
                        </DialogHeader>

                        <div className="overflow-x-auto pb-4 px-2">
                            <div
                                ref={certificateRef}
                                className="relative border-[8px] sm:border-[16px] border-[#c5a059] bg-[#fdfbf7] p-1 shadow-2xl w-[600px] sm:w-full mx-auto flex flex-col min-h-[450px] sm:min-h-[580px]"
                            >
                                {/* Inner Border Design */}
                                <div className="border-[1px] sm:border-[2px] border-[#c5a059] m-0.5 sm:m-1 flex-grow flex flex-col items-center justify-center p-4 sm:p-8 relative">
                                    {/* Corner Ornaments */}
                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 h-6 w-6 sm:h-12 sm:w-12 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-[#c5a059]" />
                                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 h-6 w-6 sm:h-12 sm:w-12 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-[#c5a059]" />
                                    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 h-6 w-6 sm:h-12 sm:w-12 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-[#c5a059]" />
                                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 h-6 w-6 sm:h-12 sm:w-12 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-[#c5a059]" />

                                    {/* Background Watermark */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center -rotate-12">
                                        <Award className="h-[200px] w-[200px] sm:h-[400px] sm:w-[400px] text-primary" />
                                    </div>

                                    <div className="z-10 text-center space-y-2 sm:space-y-4 w-full max-w-[95%] mx-auto flex flex-col items-center justify-center">
                                        <div className="space-y-1 sm:space-y-2">
                                            <p className="text-[#c5a059] font-display uppercase tracking-[0.2em] sm:tracking-[0.3em] font-semibold text-[10px] sm:text-sm">Academia Connect Pro</p>
                                            <h2 className="text-xl sm:text-4xl font-serif text-[#2c3e50] font-bold tracking-tight">Certificate of Achievement</h2>
                                        </div>

                                        <div className="py-0.5 sm:py-1 w-full">
                                            <p className="font-serif italic text-muted-foreground text-[10px] sm:text-base mb-0.5 sm:mb-1">This is to certify that</p>
                                            <p className="text-xl sm:text-4xl font-serif italic text-[#2c3e50] font-bold py-1 sm:py-2 underline decoration-[#c5a059]/30 underline-offset-4 sm:underline-offset-6 break-words max-w-full leading-tight">
                                                {certificateName}
                                            </p>
                                        </div>

                                        <div className="space-y-1 sm:space-y-2">
                                            <p className="font-serif italic text-muted-foreground text-[10px] sm:text-base">
                                                has demonstrated exceptional proficiency by successfully completing the
                                            </p>
                                            <p className="text-xs sm:text-xl font-display font-bold text-[#c5a059] uppercase tracking-wider">
                                                {activeQuiz?.title}
                                            </p>
                                            <p className="font-serif italic text-muted-foreground text-[10px] sm:text-base">
                                                Skill Assessment on this day, with an impressive score of
                                            </p>
                                            <p className="text-base sm:text-2xl font-serif font-bold text-[#2c3e50]">
                                                {scorePercent}% Correct
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 w-full pt-4 sm:pt-10 items-end px-2 sm:px-4 gap-2 sm:gap-4">
                                            <div className="text-center space-y-0.5 sm:space-y-1 border-t border-border pt-1 sm:pt-2">
                                                <p className="font-serif italic text-[9px] sm:text-sm font-semibold">{new Date().toLocaleDateString()}</p>
                                                <p className="text-[7px] sm:text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Issue Date</p>
                                            </div>

                                            <div className="flex justify-center relative -bottom-2 sm:-bottom-4">
                                                <div className="h-12 w-12 sm:h-24 sm:w-24 rounded-full border-[2px] sm:border-[4px] border-double border-[#c5a059] bg-[#fdfbf7] flex items-center justify-center p-0.5 sm:p-1 shadow-inner shrink-0 leading-none">
                                                    <div className="h-full w-full rounded-full border border-[#c5a059]/30 flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50">
                                                        <Award className="h-4 w-4 sm:h-8 sm:w-8 text-[#c5a059] mb-0" />
                                                        <p className="text-[5px] sm:text-[7px] font-bold text-[#c5a059] uppercase tracking-tighter text-center scale-75 sm:scale-100">Verified Official</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center space-y-0.5 sm:space-y-1 border-t border-border pt-1 sm:pt-2">
                                                <p className="font-serif italic text-[9px] sm:text-sm font-semibold">CERT-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                                                <p className="text-[7px] sm:text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Verification ID</p>
                                            </div>
                                        </div>

                                        <div className="pt-3 sm:pt-6 flex justify-between w-full px-4 sm:px-12 items-end">
                                            <div className="text-center w-24 sm:w-40">
                                                <div className="h-5 sm:h-8 flex items-end justify-center mb-0.5">
                                                    <span className="font-serif italic text-[#2c3e50] font-bold text-[9px] sm:text-base leading-tight">Prof. Sarah Johnson</span>
                                                </div>
                                                <div className="h-[0.5px] sm:h-[1px] w-full bg-[#2c3e50]/20 mb-0.5" />
                                                <p className="text-[6px] sm:text-[9px] uppercase text-muted-foreground font-bold italic">Academic Coordinator</p>
                                            </div>
                                            <div className="text-center w-24 sm:w-40">
                                                <div className="h-5 sm:h-8 flex items-end justify-center mb-0.5">
                                                    <span className="font-serif italic text-[#2c3e50] font-bold text-[9px] sm:text-base leading-tight">Dr. Michael Chen</span>
                                                </div>
                                                <div className={`h-[0.5px] sm:h-[1px] w-full bg-[#2c3e50]/20 mb-0.5`} />
                                                <p className="text-[6px] sm:text-[9px] uppercase text-muted-foreground font-bold italic">Portal Administrator</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-between mt-4 px-4">
                            <Button variant="outline" onClick={() => setShowCertificate(false)}>Close</Button>
                            <Button variant="gradient" className="gap-2" onClick={handleDownloadCertificate}>
                                <Download className="h-4 w-4" /> Download PNG
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
}

