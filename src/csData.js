/* ═══════════════════════════════════════════════════════════════
   CS FUNDAMENTALS 45-DAY ROADMAP
   Alternate-day plan: Study on odd days, rest/revise on even days
   7 weeks (mapped to week 1–7), study days on 0,2,4 within each week
   ═══════════════════════════════════════════════════════════════ */

export const CS_TRACKS = [
  { id: 0, label: "Programming", sublabel: "Coding & Complexity", color: "#818CF8", bg: "rgba(129,140,248,0.13)", icon: "⚡" },
  { id: 1, label: "Data Structures", sublabel: "Arrays, Trees & Graphs", color: "#34D399", bg: "rgba(52,211,153,0.13)", icon: "🔗" },
  { id: 2, label: "Algorithms", sublabel: "Sorting, Searching & DP", color: "#F472B6", bg: "rgba(244,114,182,0.13)", icon: "🧩" },
  { id: 3, label: "Systems", sublabel: "OS, DB & Networks", color: "#FBBF24", bg: "rgba(251,191,36,0.13)", icon: "🖥️" },
  { id: 4, label: "Software Eng", sublabel: "OOP, Testing & Design", color: "#60A5FA", bg: "rgba(96,165,250,0.13)", icon: "🏗️" },
];

const note = (title, body) => `
  <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
    <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">${title}</h3>
    <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">${body}</p>
  </div>`;

// RAW format: [week, day, trackId, topic, sub, hrs, diff, pri, desc, probs, resources]
export const CS_RAW = [
  // ═══ WEEK 1: Programming Fundamentals & Problem Solving ═══
  [1, 0, 0, "Intro to Programming & Complexity", "Programming Basics", 2, "Easy", "High",
    note("⚡ Programming Foundations", "Understand what programming is, how computers execute code, and learn Big O notation (O(1), O(N), O(N²), O(log N)). Analyze time & space complexity of simple loops. This is the foundation everything else builds upon — master it."),
    [], ["https://www.youtube.com/watch?v=Mo4vesaut8g", "https://www.bigocheatsheet.com/"]],

  [1, 1, 0, "Variables, Data Types & Control Flow", "Programming Basics", 2, "Easy", "High",
    note("⚡ Control Flow Mastery", "Deep dive into primitive types (int, float, char, bool, string), type casting, and memory representation. Master if/else, switch, for/while/do-while loops, and break/continue. Write small programs combining conditionals and loops."),
    [], ["https://www.youtube.com/watch?v=zOjov-2OZ0E"]],

  [1, 2, 0, "Functions, Recursion & Scope", "Problem Solving", 2, "Medium", "High",
    note("🔄 Recursion & Functions", "Functions are reusable blocks of logic. Understand parameters, return values, and scope (local vs global). Recursion = a function calling itself with a smaller subproblem. Trace call stacks for factorial, Fibonacci. Base case is critical — without it, infinite recursion & stack overflow."),
    ["Factorial", "Fibonacci"], ["https://www.youtube.com/watch?v=rf60MejMz3E"]],

  [1, 3, 0, "Arrays & Strings Basics", "Data Structures Intro", 2, "Medium", "High",
    note("📦 Arrays & Strings", "Arrays store elements in contiguous memory — O(1) access by index, O(N) insert/delete. Strings are character arrays with immutability in many languages. Practice: reverse array, find max/min, check palindrome, count character frequency using hashmap."),
    ["Reverse Array", "Palindrome Check"], ["https://www.youtube.com/watch?v=3OamzN90kPg"]],

  // ═══ WEEK 2: Data Structures Deep Dive ═══
  [2, 0, 1, "Linked Lists", "Linear Data Structures", 2, "Medium", "High",
    note("🔗 Linked Lists", "Singly linked list: each node holds data + pointer to next. Operations: insert at head/tail O(1)/O(N), delete O(N), search O(N). Doubly linked lists add a previous pointer. Key technique: use a dummy head node to simplify edge cases. Fast/slow pointer for cycle detection."),
    ["Reverse Linked List", "Detect Cycle"], ["https://www.youtube.com/watch?v=G0_I-ZF0S38"]],

  [2, 1, 1, "Stacks & Queues", "Linear Data Structures", 2, "Medium", "High",
    note("📚 Stacks & Queues", "Stack = LIFO (Last In First Out). Push/Pop O(1). Used for: balanced parentheses, undo operations, DFS. Queue = FIFO (First In First Out). Enqueue/Dequeue O(1). Used for: BFS, scheduling, buffering. Implement both using arrays and linked lists."),
    ["Valid Parentheses", "Implement Queue using Stacks"], ["https://www.youtube.com/watch?v=PeGcsS-rX14"]],

  [2, 2, 1, "Hash Tables & Sets", "Associative Data Structures", 2, "Medium", "High",
    note("🗂️ Hash Tables", "Hash function maps keys to bucket indices. Collisions handled via chaining (linked lists) or open addressing (probing). Average case: O(1) insert/lookup/delete. Worst case: O(N) if all keys collide. Sets are hash tables without values — O(1) membership test. Essential for frequency counting, deduplication, two-sum patterns."),
    ["Two Sum", "Contains Duplicate"], ["https://www.youtube.com/watch?v=jalSiaIi8j4"]],

  [2, 3, 1, "Trees & Binary Trees", "Hierarchical Data Structures", 2, "Medium", "High",
    note("🌳 Trees & Binary Trees", "Tree = hierarchical structure with nodes and edges. Binary tree = each node has at most 2 children. Terminology: root, leaf, depth, height. Traversals: Inorder (L-Root-R), Preorder (Root-L-R), Postorder (L-R-Root), Level-order (BFS with queue). BST property: left < root < right."),
    ["Max Depth of Binary Tree", "Inorder Traversal"], ["https://www.youtube.com/watch?v=OnSn2XEQ4MY"]],

  // ═══ WEEK 3: Advanced Data Structures & Algorithms ═══
  [3, 0, 1, "Heaps & Priority Queues", "Advanced Structures", 2, "Medium", "High",
    note("⛰️ Heaps", "Binary heap: complete binary tree stored in array. Min-heap: parent ≤ children. Max-heap: parent ≥ children. Insert O(log N), Extract-min/max O(log N). Heapify O(N). Priority Queue uses heap internally. Applications: Kth largest, merge K sorted lists, median of stream."),
    ["Kth Largest Element"], ["https://www.youtube.com/watch?v=t0Cq6tVNRBA"]],

  [3, 1, 1, "Graphs: Representation & Traversal", "Graph Theory", 2, "Hard", "High",
    note("🕸️ Graphs", "Graph = vertices + edges. Representations: Adjacency Matrix O(V²) space, Adjacency List O(V+E) space. Types: directed/undirected, weighted/unweighted, cyclic/acyclic. BFS uses queue — shortest path in unweighted. DFS uses stack/recursion — cycle detection, connected components. Always track visited set!"),
    ["Number of Islands", "Clone Graph"], ["https://www.youtube.com/watch?v=cWNEl4HE2OE"]],

  [3, 2, 2, "Sorting Algorithms", "Core Algorithms", 2, "Medium", "High",
    note("📊 Sorting", "Bubble/Selection/Insertion: O(N²) — good for small datasets. Merge Sort: O(N log N), stable, divide-and-conquer. Quick Sort: O(N log N) avg, O(N²) worst. Counting/Radix sort: O(N+K) for integers. Know when to use each. Merge sort for linked lists, quicksort for arrays. Stability matters for multi-key sorting."),
    ["Sort an Array"], ["https://www.youtube.com/watch?v=pkkFqlG0Hds"]],

  [3, 3, 2, "Searching & Binary Search", "Core Algorithms", 2, "Medium", "High",
    note("🔍 Binary Search", "Binary search on sorted arrays: O(log N). Template: lo=0, hi=N-1, while lo<=hi, mid=(lo+hi)/2. Variations: find first/last occurrence, search in rotated array, search on answer space. The 'search on answer' pattern is extremely powerful for optimization problems."),
    ["Binary Search", "Search in Rotated Array"], ["https://www.youtube.com/watch?v=s4DPMONcbGk"]],

  // ═══ WEEK 4: Algorithm Paradigms ═══
  [4, 0, 2, "Greedy Algorithms", "Algorithm Design", 2, "Medium", "High",
    note("💰 Greedy Algorithms", "Make the locally optimal choice at each step hoping for global optimum. Works when: greedy choice property + optimal substructure. Classic problems: activity selection (sort by end time), fractional knapsack, Huffman coding, minimum coins. Proof technique: exchange argument — show swapping any non-greedy choice can only make it worse."),
    ["Jump Game", "Meeting Rooms"], ["https://www.youtube.com/watch?v=bC7o8P_Ste4"]],

  [4, 1, 2, "Divide & Conquer", "Algorithm Design", 2, "Medium", "High",
    note("✂️ Divide & Conquer", "Split problem into subproblems, solve recursively, merge results. Master Theorem: T(N) = aT(N/b) + O(N^d). Examples: Merge Sort, Quick Sort, Binary Search, Closest Pair of Points, Strassen's Matrix Multiplication. Key insight: merging step determines the algorithm's elegance."),
    ["Merge Sort Implementation"], ["https://www.youtube.com/watch?v=YzZUIicw7yE"]],

  [4, 2, 2, "Dynamic Programming Basics", "Algorithm Design", 3, "Hard", "High",
    note("🧮 Dynamic Programming", "DP = recursion + memoization. If overlapping subproblems + optimal substructure → use DP. Two approaches: Top-down (memoization with hashmap/array) vs Bottom-up (tabulation, iterative). Classic: Fibonacci, Climbing Stairs, Coin Change. State transition: define dp[i] clearly, then find recurrence relation. Start with brute force recursion, then add memo."),
    ["Climbing Stairs", "Coin Change"], ["https://www.youtube.com/watch?v=Hdr64lKQ3e4"]],

  [4, 3, 2, "Advanced DP Patterns", "Algorithm Design", 3, "Hard", "High",
    note("🎯 Advanced DP", "2D DP: dp[i][j] for string comparison (Edit Distance, LCS). Knapsack: 0/1 (each item once) vs unbounded. Interval DP: dp[i][j] for subarray/substring problems. Bitmask DP for subset enumeration. Space optimization: often only need previous row. Practice identifying the 'state' — what changes between subproblems?"),
    ["Longest Common Subsequence", "0/1 Knapsack"], ["https://www.youtube.com/watch?v=Hdr64lKQ3e4"]],

  // ═══ WEEK 5: Operating Systems & Computer Architecture ═══
  [5, 0, 3, "OS: Processes & Threads", "Operating Systems", 2, "Medium", "High",
    note("⚙️ Processes & Threads", "Process = running program with own address space. Thread = lightweight process sharing memory. Process states: New→Ready→Running→Waiting→Terminated. Context switch saves/restores CPU registers. Threads share heap but have own stack. Multithreading improves concurrency but introduces race conditions."),
    [], ["https://pages.cs.wisc.edu/~remzi/OSTEP/"]],

  [5, 1, 3, "OS: Memory Management", "Operating Systems", 2, "Medium", "High",
    note("💾 Memory Management", "Virtual memory maps logical addresses to physical via page tables. Paging: fixed-size blocks eliminate external fragmentation. Page fault: requested page not in RAM → fetch from disk. TLB (Translation Lookaside Buffer) caches page table entries. Replacement algorithms: LRU, FIFO, Optimal. Thrashing = too many page faults, system spends more time swapping than executing."),
    [], ["https://pages.cs.wisc.edu/~remzi/OSTEP/"]],

  [5, 2, 3, "OS: Synchronization & Deadlocks", "Operating Systems", 2, "Hard", "High",
    note("🔒 Synchronization", "Race condition: multiple threads accessing shared data unsafely. Solutions: Mutex (mutual exclusion lock), Semaphore (counting lock), Monitor. Deadlock requires ALL 4: Mutual Exclusion + Hold & Wait + No Preemption + Circular Wait. Prevention: break any one condition. Detection: resource allocation graph. Banker's algorithm for avoidance."),
    [], ["https://pages.cs.wisc.edu/~remzi/OSTEP/"]],

  [5, 3, 3, "OS: File Systems & I/O", "Operating Systems", 2, "Medium", "Medium",
    note("📁 File Systems", "File system organizes data on disk. Inodes store metadata (permissions, size, block pointers). Directory = file mapping names to inodes. Journaling (ext4, NTFS) prevents corruption on crash. I/O: polling vs interrupts vs DMA. Disk scheduling: SCAN (elevator), SSTF. SSD vs HDD: random access O(1) vs seek time overhead."),
    [], ["https://pages.cs.wisc.edu/~remzi/OSTEP/"]],

  // ═══ WEEK 6: Databases & Networking ═══
  [6, 0, 3, "Database Fundamentals & SQL", "Databases", 2, "Medium", "High",
    note("🗄️ Database Fundamentals", "RDBMS: tables with rows and columns. SQL: SELECT, INSERT, UPDATE, DELETE, JOIN (INNER, LEFT, RIGHT, FULL). Normalization: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). ACID: Atomicity, Consistency, Isolation, Durability. Indexes: B+ trees for fast lookups — O(log N) reads but slower writes."),
    [], ["https://www.youtube.com/watch?v=HXV3zeQKqGY"]],

  [6, 1, 3, "Database Advanced & NoSQL", "Databases", 2, "Medium", "High",
    note("📊 Advanced DB", "Transactions: isolation levels (Read Uncommitted → Serializable). MVCC lets readers not block writers. NoSQL types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j). CAP Theorem: Consistency + Availability + Partition Tolerance — pick 2. Sharding: horizontal partitioning. Replication: master-slave or multi-master."),
    [], ["https://www.youtube.com/watch?v=W2Z7fbCLSTw"]],

  [6, 2, 3, "Computer Networking: OSI & TCP/IP", "Networking", 2, "Medium", "High",
    note("🌐 Networking Fundamentals", "OSI 7 layers: Physical→Data Link→Network→Transport→Session→Presentation→Application. TCP/IP 4 layers: Link→Internet→Transport→Application. TCP: reliable, ordered, connection-oriented (3-way handshake). UDP: fast, unreliable, connectionless (gaming, video). IP addressing: IPv4 (32-bit), subnetting, CIDR notation. DNS: domain name → IP resolution."),
    [], ["https://www.youtube.com/watch?v=3QhU9jd03a0"]],

  [6, 3, 3, "HTTP, REST & Application Layer", "Networking", 2, "Medium", "High",
    note("🔌 Application Protocols", "HTTP: request/response protocol. Methods: GET, POST, PUT, DELETE, PATCH. Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error. REST: stateless, resource-oriented API design. HTTPS = HTTP + TLS encryption. WebSocket: persistent bidirectional connection. HTTP/2: multiplexing, header compression. HTTP/3: QUIC over UDP."),
    [], ["https://www.youtube.com/watch?v=iYM2zFP3Zn0"]],

  // ═══ WEEK 7: Software Engineering Practices & Review ═══
  [7, 0, 4, "OOP Principles & Design Patterns", "Software Design", 2, "Medium", "High",
    note("🏗️ OOP & Design Patterns", "Four pillars: Encapsulation (data hiding), Abstraction (simplify interface), Inheritance (code reuse), Polymorphism (many forms). SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Key patterns: Singleton, Factory, Observer, Strategy, Decorator. These appear in every system design discussion."),
    [], ["https://refactoring.guru/design-patterns"]],

  [7, 1, 4, "Version Control & Testing", "Dev Practices", 2, "Easy", "Medium",
    note("🧪 Git & Testing", "Git: distributed version control. Key commands: clone, branch, commit, merge, rebase, cherry-pick. Branching strategies: GitFlow, trunk-based. Testing pyramid: Unit (fast, isolated) → Integration (component interaction) → E2E (full system). TDD: write test first → make it pass → refactor. Code coverage isn't everything — test edge cases and critical paths."),
    [], ["https://www.youtube.com/watch?v=RGOj5yH7evk"]],

  [7, 2, 4, "System Design Basics & Review", "System Design", 2, "Hard", "High",
    note("🎯 System Design Intro", "Requirements → API Design → High-Level Architecture → Database Schema → Scalability. Key concepts: Load Balancing (Round Robin, Least Connections), Caching (Redis, CDN), Message Queues (Kafka, RabbitMQ), Microservices vs Monolith. Estimate scale: DAU, QPS, storage needs. This ties together everything you learned in OS, DB, and networking."),
    [], ["https://bytebytego.com/"]],

  [7, 3, 4, "Final Review & Practice", "Comprehensive Review", 3, "Medium", "High",
    note("📝 Grand Review", "Consolidate all CS fundamentals. Review: Big O analysis, key data structures (array, linked list, stack, queue, hash table, tree, heap, graph), algorithm paradigms (greedy, D&C, DP), OS concepts (processes, memory, sync), DB (SQL, NoSQL, ACID), networking (TCP/IP, HTTP). Do a timed self-assessment covering all topics. You now have a solid CS foundation!"),
    [], []],
];

export const CS_RESOURCES = {
  "Intro to Programming & Complexity": ["https://www.youtube.com/watch?v=Mo4vesaut8g", "https://www.bigocheatsheet.com/"],
  "Variables, Data Types & Control Flow": ["https://www.youtube.com/watch?v=zOjov-2OZ0E"],
  "Functions, Recursion & Scope": ["https://www.youtube.com/watch?v=rf60MejMz3E"],
  "Arrays & Strings Basics": ["https://www.youtube.com/watch?v=3OamzN90kPg"],
  "Linked Lists": ["https://www.youtube.com/watch?v=G0_I-ZF0S38"],
  "Stacks & Queues": ["https://www.youtube.com/watch?v=PeGcsS-rX14"],
  "Hash Tables & Sets": ["https://www.youtube.com/watch?v=jalSiaIi8j4"],
  "Trees & Binary Trees": ["https://www.youtube.com/watch?v=OnSn2XEQ4MY"],
  "Heaps & Priority Queues": ["https://www.youtube.com/watch?v=t0Cq6tVNRBA"],
  "Graphs: Representation & Traversal": ["https://www.youtube.com/watch?v=cWNEl4HE2OE"],
  "Sorting Algorithms": ["https://www.youtube.com/watch?v=pkkFqlG0Hds"],
  "Searching & Binary Search": ["https://www.youtube.com/watch?v=s4DPMONcbGk"],
  "Greedy Algorithms": ["https://www.youtube.com/watch?v=bC7o8P_Ste4"],
  "Divide & Conquer": ["https://www.youtube.com/watch?v=YzZUIicw7yE"],
  "Dynamic Programming Basics": ["https://www.youtube.com/watch?v=Hdr64lKQ3e4"],
  "Advanced DP Patterns": ["https://www.youtube.com/watch?v=Hdr64lKQ3e4"],
  "OS: Processes & Threads": ["https://pages.cs.wisc.edu/~remzi/OSTEP/"],
  "OS: Memory Management": ["https://pages.cs.wisc.edu/~remzi/OSTEP/"],
  "OS: Synchronization & Deadlocks": ["https://pages.cs.wisc.edu/~remzi/OSTEP/"],
  "OS: File Systems & I/O": ["https://pages.cs.wisc.edu/~remzi/OSTEP/"],
  "Database Fundamentals & SQL": ["https://www.youtube.com/watch?v=HXV3zeQKqGY"],
  "Database Advanced & NoSQL": ["https://www.youtube.com/watch?v=W2Z7fbCLSTw"],
  "Computer Networking: OSI & TCP/IP": ["https://www.youtube.com/watch?v=3QhU9jd03a0"],
  "HTTP, REST & Application Layer": ["https://www.youtube.com/watch?v=iYM2zFP3Zn0"],
  "OOP Principles & Design Patterns": ["https://refactoring.guru/design-patterns"],
  "Version Control & Testing": ["https://www.youtube.com/watch?v=RGOj5yH7evk"],
  "System Design Basics & Review": ["https://bytebytego.com/"],
  "Final Review & Practice": [],
};
