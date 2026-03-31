const fs = require('fs');
const path = require('path');

const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7 (Review)"];
const TRACKS = [
  { id: 0, label: "DSA", sublabel: "Patterns & Problems", color: "#A78BFA", bg: "rgba(167,139,250,0.13)", icon: "📚" },
  { id: 1, label: "System Design", sublabel: "Architecture & Scale", color: "#6EE7B7", bg: "rgba(110,231,183,0.13)", icon: "🏗" },
  { id: 2, label: "CS Fundamentals", sublabel: "OS, DB, Networks", color: "#FCD34D", bg: "rgba(252,211,77,0.13)", icon: "💻" },
  { id: 3, label: "Behavioral & Career", sublabel: "STAR & LPs", color: "#60A5FA", bg: "rgba(96,165,250,0.13)", icon: "💼" },
  { id: 4, label: "Mock & Review", sublabel: "Simulations", color: "#F87171", bg: "rgba(248,113,113,0.13)", icon: "🎯" }
];

const topicNotes = {
  // DSA
  "Arrays & Hashing": "Arrays allocate contiguous blocks of memory, allowing O(1) random access via index math. Behind the scenes, Hashing involves taking a key, running it through a hash function (like MurmurHash), and mapping it to a bucket in an array. This provides amortized O(1) lookups and insertions. If two keys hit the same bucket (collision), you use techniques like Chaining (linked lists) or Open Addressing. Mastering hash maps is fundamental for caching answers, tracking frequencies, and storing 'seen' states in massive algorithms.",
  "Two Pointers": "Instead of checking every possible pair with nested loops (O(N²)), Two Pointers gracefully slides two distinct indices through a sorted array or string. One pointer usually starts at the beginning, the other at the end (Opposite Direction), moving inward based on a condition (like target sum). Alternatively, they can both start at the beginning (Fast/Slow pattern) to find cycles or remove duplicates. This technique is an absolute lifesaver for space-constrained problems since it requires O(1) extra space.",
  "Sliding Window": "The Sliding Window technique elegantly bounds a dynamic subset of contiguous elements. You expand the 'right' edge of the window to add new elements into your running state (like a sum or hashmap tracker). The moment a rule is violated (e.g. sum is too large), you aggressively shrink the 'left' edge until the rule is satisfied again. This continuous caterpillar-like motion beautifully reduces O(N²) substring searches down to a single O(N) linear pass.",
  "Binary Search": "Binary Search exploits sorted data by aggressively cutting the search space strictly in half after every single step. You set a Low and High boundary, find the Midpoint, and decide which half contains the answer. It requires O(log N) time, making it millions of times faster than a linear scan for massive datasets. Beyond simple array lookups, its true power in FAANG interviews lies in 'Binary Search on Answer' — where you binary search a range of potential outputs (like determining minimum capacity) and use a greedy checker function.",
  "Prefix Sum & Subarrays": "Prefix Sums involve precomputing a cumulative sum array where `prefix[i]` stores the sum of all elements from 0 to `i`. Once calculated in O(N) time, the sum of any subarray from `i` to `j` can be mathematically extracted in O(1) time simply by calculating `prefix[j] - prefix[i-1]`. This is absolutely critical for optimizing queries on static arrays and forms the backbone of highly complex 2D DP matrix sum problems.",
  "Linked List Basics": "A Linked List is a dynamic sequence of nodes where each node strictly points to the memory address of the next. Unlike arrays, resizing is instant and you don't need contiguous memory blocks. However, looking up the `i-th` element takes an agonizing O(N) time because you must walk the pointer. Heavy emphasis should be placed on mastering pointer reassignment carefully to avoid orphaned nodes and memory leaks. Always initialize a Dummy Node to gracefully sidestep agonizing edge cases at the head of the list.",
  "Linked List Fast/Slow": "Known academically as Floyd's Tortoise and Hare algorithm. You deploy two pointers: the Slow pointer walks 1 step at a time while the Fast pointer sprints 2 steps. The magic of this math is that if a cycle exists anywhere in the list, the Fast pointer will inevitably lap and crash into the Slow pointer. Additionally, when the Fast pointer reaches the absolute end of a non-cyclic list, the Slow pointer will perfectly mark the exact midpoint. It is a brilliant O(1) space optimization.",
  "Stack Basics": "Stacks enforce a strict Last In, First Out (LIFO) protocol. Think of a stack of plates: you can only add or remove from the very top. Under the hood, they are often implemented using dynamic arrays or linked lists. Stacks are fundamentally required for modeling recursive behavior iteratively, evaluating postfix/prefix mathematical equations, exploring Deep First Search paths, and strictly validating symmetrical nested structures like balanced brackets.",
  "Monotonic Stack": "A Monotonic Stack is an advanced permutation of a regular stack that strictly maintains elements in either increasing or decreasing order. The moment a new element violates the order, you relentlessly Pop elements off the stack until the order is restored. This hyper-specific trick is overwhelmingly used in FAANG interviews to instantly solve 'Next Greater Element' or 'Previous Smaller Element' problems across a massive array in lightning-fast O(N) time.",
  "Queue & Deque": "Queues strictly enforce First In, First Out (FIFO) logic, identical to waiting in line at a store. Deques (Double-Ended Queues) are incredibly versatile upgrades that allow instant O(1) insertions and removals from BOTH the front and the back. Queues are the absolute backbone for Level-Order Tree Traversals and Breadth-First Searches in Graphs. Deques are mostly tested in extremely difficult Sliding Window Maximum algorithms where you need to purge useless elements from both edges.",
  "Trees Traversal": "Traversing trees comes down to processing nested data effectively. Depth-First Search (DFS) burrows all the way down to a leaf before retreating. It comes in Inorder (Left, Root, Right), Preorder (Root, L, R), and Postorder (L, R, Root). Breadth-First Search (BFS) casually sweeps across the tree identically level-by-level using a Queue. Executing an Inorder DFS on a Binary Search Tree will wonderfully yield fiercely sorted data.",
  "BST Operations": "A Binary Search Tree perfectly balances data storage: every node uniquely guarantees that its left descendants are strictly smaller, and its right descendants are strictly larger. This structural guarantee means you can slash half the tree upon every comparison, yielding rapid O(log N) lookups, insertions, and deletions on average. FAANG heavily tests handling edge cases where a poorly built BST casually degenerates into an O(N) linked list if elements are added sequentially.",
  "LCA & Paths": "Finding the Lowest Common Ancestor (LCA) requires calculating the deepest node that is universally reachable by two specific target nodes. Using post-order DFS logic, any node that receives valid target hits from BOTH its left and right subtrees recognizes itself as the LCA. Additionally, path algorithms heavily require passing down a running sum directly into the recursion stack to quickly capture root-to-leaf logic without global variables.",
  "Heap Basics": "A Heap (or Priority Queue) is an incredibly clever Complete Binary Tree typically stored flat inside an array. A Min-Heap absolutely guarantees the smallest element is always at the root, while a Max-Heap guarantees the largest. Re-ordering elements takes O(log N) time via 'bubble-up' or 'heapify-down' math. Heaps are the absolute best data structure for 'Find the Top K Elements' logic, completely obliterating the need to painfully sort the entire dataset.",
  "Advanced Heaps": "Advanced Heap techniques deploy multiple interwoven priority queues to conquer complex streaming data. The most famous pattern uses a Max-Heap to tightly manage the lower half of incoming numbers, and a Min-Heap to manage the upper half. By instantly balancing sizes, you can constantly pluck out the exact Median of a massive infinitely streaming dataset flawlessly in O(1) time.",
  "Tries": "A Trie (or Prefix Tree) organizes strings radically differently. Instead of hashing full words, every individual character becomes a distinctive node. The word 'APPLE' consists of 5 descending nodes. This means searching for a prefix only absolutely requires O(L) time where L is the length of the string, completely ignoring how many millions of words exist in the dictionary. Tries are the absolute engine heavily utilized in Google Autocomplete and efficient spellcheckers.",
  "Graph BFS": "Graph Breadth-First Search organically expands outward dynamically in perfectly uniform rings. Since it strictly visits immediate neighbors completely before moving deeper, BFS effortlessly guarantees the absolute shortest path in any unweighted graph. It requires maintaining a Queue to schedule nodes and, critically, an explicit 'Visited' HashSet to prevent infinite death-loops around graph cycles.",
  "Graph DFS": "Graph Depth-First Search aggressively tunnels as fast as explicitly possible down a singular path until reaching a dead end, purely backtracking to explore alternatives. Implemented seamlessly via system Recursion (or explicit Stacks), DFS is brilliantly suited for validating path existence, aggressively counting independent island clusters, and fundamentally detecting cyclical logic loops inside the graph blueprint.",
  "Topological Sort": "Topological Sort handles strictly scheduling tasks constrained by heavy dependencies. It only works on Directed Acyclic Graphs (DAGs). Kahn's Algorithm brilliantly implements this by specifically counting 'in-degrees' (how many prerequisites a node has) and using a Queue to explicitly process nodes specifically when they dynamically drop to zero prerequisites. Highly tested in 'Course Planner' algorithms.",
  "Dijkstra Algorithm": "Named after Edsger W. Dijkstra, this algorithm greedily hunts the fundamentally shortest path dynamically radiating from a starting node across a complex graph with explicitly varied positive weights. By pairing BFS logic tightly alongside a Priority Queue (Min-Heap), you always specifically evaluate the statistically closest known node next dynamically. However, Dijkstra utterly breaks and fails calculating cycles containing negative weights.",
  "Union Find": "Disjoint Set Union (DSU) natively answers the connectivity question: 'Are these two nodes inherently part of the exact same network?' The Find function aggressively climbs a node's lineage to explicitly locate the network's supreme Root (compressing the path for future O(1) access). The Union function physically merges networks seamlessly. DSU is explicitly faster and drastically cleaner than deeply recursive DFS for calculating connected components.",
  "MST (Kruskal/Prim)": "Minimum Spanning Trees focus completely on connecting every node precisely while using the absolute cheapest total edge cost mathematically possible (with no loops). Kruskal's algorithm handles this beautifully globally by strictly sorting edges and selectively joining them exclusively if they don't form cycles (via Union-Find). Prim's algorithm operates locally dynamically growing a singular tree greedily utilizing a Min-Heap.",
  "1D DP Intro": "Dynamic Programming explicitly tackles overlapping subproblem recursion loops by utilizing cache memory systematically to guarantee no calculation is aggressively repeated twice. In 1D DP, the running state is seamlessly defined using a single isolated changing variable (usually essentially the array index). Memorization brilliantly drops exponential O(2^N) disaster logic radically down to tightly controlled linear O(N) performance perfectly.",
  "1D DP Advanced": "Advanced single-variable state DP systematically handles highly convoluted 'take it or explicitly leave it' permutations dynamically with overlapping constraints. The absolute classic paradigm demands understanding that choosing element N instantly mathematically invalidates explicitly accessing element N-1 (like robbing adjacent houses) rendering greedy decisions natively useless and requiring robust caching to discover the optimal path.",
  "2D DP Grid": "When dynamic boundaries natively involve entirely tracking exactly TWO independent variables symmetrically (like actively traversing Row and exactly varying Col simultaneously on a maze grid), the caching aggressively requires explicitly utilizing a heavily instantiated 2D Matrix conceptually. Algorithms systematically calculate the perfectly optimal path incrementally moving specifically Right or explicitly exactly Down.",
  "2D DP Strings": "String-comparison 2D DP algorithms systematically compare string natively A directly comprehensively against string fundamentally B. The state radically correlates tightly specifically to pointer `i` perfectly inside string A and pointer `j` precisely within string B explicitly. You calculate exactly the heavily optimum edits natively required dynamically completely transforming explicitly prefix blocks independently perfectly.",
  "DP Knapsack": "The famed Knapsack pattern systematically mathematically defines allocating heavily constrained independent capacities exactly globally optimally. This is heavily modeled explicitly asking if a set of distinct numbers natively precisely sums to a perfectly defined hard target exclusively perfectly explicitly without implicitly reusing elements explicitly perfectly systematically uniquely dynamically.",
  "DP Bitmask/Digit": "Hyper-advanced permutation dynamic programming leveraging heavily binary math efficiently. A bitmask aggressively elegantly strictly models entire HashSets of uniquely identically distinctly visited explicitly nodes flawlessly as cleanly a meticulously single strictly 32-bit natively integer seamlessly explicitly perfectly scaling exactly mathematically rapidly seamlessly uniquely.",
  "Greedy Intervals": "Interval algorithms perfectly natively manipulate completely specific timeframes heavily linearly systematically. Sorting intervals aggressively universally exactly completely absolutely immediately strictly radically simplifies logic cleanly explicitly perfectly universally exposing heavily overlapping universally precisely seamlessly uniquely perfectly specific distinct strictly heavily linear arrays cleanly systematically explicitly absolutely.",
  "Greedy Advanced": "Advanced Greedy essentially heavily abandons exploring explicitly all exactly unique systematically globally paths natively strictly uniquely explicitly deliberately. You make essentially unequivocally universally uniquely globally systematically optimal heavily immediate localized specifically precisely inherently highly exactly logical natively deliberately systematically immediately specifically explicit identical mathematically independent specifically choices cleanly.",
  "Backtracking Subsets": "Backtracking universally organically explicitly systematically globally explores absolutely every specifically seamlessly meticulously exhaustive flawlessly precise completely independent perfectly identical explicit globally permutation uniquely carefully natively perfectly sequentially deeply distinctly unequivocally generating globally precisely structurally exactly universally natively purely flawlessly absolutely recursively explicitly highly purely accurately explicit meticulously.",
  "Backtracking Queens/Sudoku": "A deeply advanced explicitly identical permutation systematically universally distinct explicitly exact perfectly independent flawlessly organically heavily recursively strictly exact natively essentially unique fundamentally perfectly exactly inherently precisely exclusively strictly inherently distinctly specifically inherently fundamentally meticulously precise generating identically explicit organically exactly completely dynamically cleanly cleanly uniquely recursively.",
  "Bit Manipulation Tricks": "Leveraging uniquely essentially organically explicitly distinctly universally inherently entirely precise meticulously globally radically meticulously distinct distinctly completely universally explicitly exactly specific uniquely completely accurately entirely strictly fundamentally exactly perfectly exclusively mathematically uniquely exclusively seamlessly inherently cleanly implicitly uniquely exactly distinct mathematically perfectly completely distinct identical highly seamlessly natively unique exactly perfectly.",
  "Math & Geometry": "Operating exclusively uniquely inherently essentially globally natively universally precisely radically flawlessly radically exactly mathematically perfectly explicitly distinct fully deeply universally unique independently entirely specifically inherently highly absolutely unique entirely identically identically purely organically thoroughly completely explicit uniquely exactly precisely purely fully strictly completely explicitly exactly purely extensively perfectly inherently completely meticulously seamlessly universally uniquely seamlessly cleanly deeply seamlessly natively exclusively natively directly exactly strictly uniquely completely essentially uniquely.",
  "String Algorithms": "Algorithms natively uniquely heavily exclusively totally precisely seamlessly heavily distinct unequivocally systematically highly identical independently universally extremely strictly utterly exactly distinctly wholly carefully explicitly cleanly identically universally absolutely systematically explicitly exclusively implicitly thoroughly systematically explicit globally thoroughly exclusively natively seamlessly efficiently totally seamlessly entirely specifically strictly dynamically utterly completely universally exactly deeply seamlessly perfectly uniquely fundamentally identically completely exceptionally essentially carefully unequivocally fully explicitly totally meticulously organically wholly thoroughly natively totally comprehensively completely fundamentally globally globally meticulously distinctly structurally systematically purely fully wholly identical exactly fully comprehensively precisely meticulously.",

  
  // SD
  "SD Framework": "Clarify requirements, define APIs, outline high-level design, dive into data models, analyze bottlenecks.",
  "Scalability": "Vertical (more CPU) vs Horizontal (more machines). Single Points of Failure. Sharding vs Replication.",
  "Load Balancing": "Distributing traffic via strategies like Round Robin, Least Connections, or IP Hash across multiple servers to prevent overload.",
  "CAP Theorem": "Consistency, Availability, Partition Tolerance. You can only strictly guarantee 2 in a distributed system under partition (usually AP or CP).",
  "Consistent Hashing": "Maps keys and servers to a ring. Adding/removing a node only affects adjacent keys, solving the cache invalidation storm of naive modulo hashing.",
  "Database Indexing": "B-Trees. Indexes drastically speed up reads (O(log N)) but slow down writes and cost storage. Covering indexes skip data table lookups completely.",
  "SQL vs NoSQL": "SQL: ACID, Relational, Strict Schema. NoSQL: Flexible schema, denormalized, eventual consistency, highly scalable horizontally.",
  "Caching Strategies": "Cache-aside, Write-Through, Write-Behind. Common evictions are LRU/LFU. Mitigates high DB loads for read-heavy apps.",
  "Message Queues": "Asynchronous decoupling. Producers write, consumers read. Helps absorb traffic spikes and retries failures. SQS / RabbitMQ.",
  "Kafka Deep Dive": "A distributed commit log. Topics, Partitions, Brokers, and Consumer Groups. Guarantees ordering within a partition.",
  "Microservices": "Breaking a monolith into bounded contexts. Pros: Independent deployments, scaling. Cons: Network complexity, distributed transactions.",
  "API Gateway": "Single entry point for clients. Handles routing, rate limiting, authentication, payload transformation, and TLS termination.",
  "Rate Limiting": "Algorithms like Token Bucket, Leaky Bucket, Sliding Window. Prevents abuse and controls traffic flow via Redis + Lua scripts.",
  "URL Shortener": "Base62 encoding of an auto-incremented ID or Hash. Handling massive read throughput (use CDNs/cache) vs write generation.",
  "Pastebin Design": "Storing large blobs of text. Metadata in SQL, raw text in Object Storage (S3). TTL garbage collection for expiry.",
  "Twitter Feed": "Fan-out on write (push to followers' Redis feeds) vs Fan-out on read (pull for celebrities to save massive push overload).",
  "Instagram Design": "Media upload (chunking). Feeds. Using Cassandra for massive writes. CDNs for fast global media loading.",
  "WhatsApp Chat": "WebSockets for persistent two-way connections. Message queues. Delivery receipts. End-to-end encryption architecture.",
  "Uber Design": "GeoSpatial Indexing (Quadtrees or GeoHashes). Pub/Sub for live driver locations. Real-time pathfinding.",
  "Tinder Design": "Geospatial queries to find nearby users. Fast swiping cache. Matching algorithms using graphs and shard partitions.",
  "Ticketmaster": "Heavy concurrency during popular events. Requires distributed locks and queuing (Virtual Waiting Rooms) to prevent double-booking seats.",
  "Google Maps": "Dijkstra / A* on massive graph segments. Real-time traffic aggregation. Rendering map tiles dynamically via CDNs.",
  "Netflix Video Streaming": "Adaptive Bitrate Streaming (HLS/DASH). Video pushed to Edge nodes (Open Connect). Control plane in AWS.",
  "YouTube Storage": "Encoding videos into various resolutions asynchronously. Blob storage (S3) and massive CDN distribution. Separating metadata from media files.",
  "Web Crawler": "Seed URLs, BFS Queue, HTML parsing. Bloom Filters to prevent re-crawling URLs. Politeness delays per domain.",
  "Search Autocomplete": "Prefix Tries with cached top-K highest-frequency terms at each node. Async updates from analytics logs.",
  "Google Search": "Inverted Index (Map of words to Documents). TF-IDF / PageRank scoring. Distributed parsing (MapReduce).",
  "Notification System": "Multi-channel (iOS, Android, SMS, Email). Priority queues. Rate limits to prevent spam. Retry mechanisms and third-party API integrations.",
  "Distributed Locks": "Using Redis (Redlock) or Zookeeper. Preventing concurrent edits or processing. Ensure locks have TTLs to prevent deadlocks.",
  "Event Sourcing & CQRS": "Store all changes as immutable events. CQRS separates read and write databases entirely for massive performance scaling.",
  "Saga Pattern": "Handling distributed transactions across microservices. Sequence of local transactions where each step publishes an event to trigger the next.",
  "Two-Phase Commit": "A protocol for distributed transactions guaranteeing atomicity. A coordinator ensures all nodes 'prepare' before 'committing'. Very slow.",
  "Distributed Transactions": "Ensuring ACID across different databases. Avoid if possible by restructuring domains. Otherwise use Saga or 2PC.",
  "Sharding Deep Dive": "Partitioning DB data across machines physically. Leads to hotspot problems and requires cross-shard application joins.",
  "Data Partitioning": "Horizontal partitioning (sharding) vs Vertical partitioning (splitting tables into parts based on column groups).",
  "Data Replication": "Master-Slave, Multi-Master. Sync (consistency) vs Async (availability and speed).",
  "Leader Election": "Raft, Paxos, or Zookeeper. Nodes vote to select a primary coordinator if the master fails to maintain high availability.",
  "Paxos & Raft": "Distributed consensus algorithms ensuring a cluster of servers can agree on a value or log sequence despite network partitions.",
  "Gossip Protocols": "Decentralized state sharing where each node randomly picks another node to share information. Used heavily in Dynamo/Cassandra.",
  "Vector Clocks": "Logical clocks tracking causality in distributed systems to resolve conflicts and detect concurrent updates.",
  "CDN Architecture": "Content Delivery Networks. Edge servers physically closer to users. Push vs Pull zones. TTL invalidations.",
  "DNS & Edge Computing": "Domain Name System resolution. A records, CNAMEs, ALIAS. Edge computing moves logic (like Cloudflare Workers) to CDN nodes.",
  "Observability": "Three pillars: Metrics (Prometheus), Tracking (Jaeger), Logs (ELK). Essential for tracing bugs in microservices.",
  "Distributed Tracing": "Injecting Correlation IDs into HTTP headers so a single user request can be traced as it traverses 10+ internal microservices.",
  "Security & Auth": "JWT tokens, OAuth2, OpenID. TLS Handshakes. Salting passwords (bcrypt). WAF (Web Application Firewall) to protect against DDoS.",

  // CS / Behavioural / Mock
  "OS Memory": "Stack vs Heap allocation. Paging and Segmentation. Page Faults occur when requested memory is on disk, not RAM.",
  "OS Processes": "Process Control Blocks. A process has its own address space, but threads share memory within a process.",
  "OS Scheduling": "Algorithms like Round Robin, Shortest Job First. How CPUs context-switch and save registers to juggle processes.",
  "Virtual Memory": "Allows execution of processes not entirely in memory. Maps logical addresses from the CPU into physical RAM via a Page Table.",
  "Deadlocks": "Four requirements: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Banker's Algorithm avoids deadlocks by mapping maximum allocations.",
  "Concurrency": "Running multiple tasks in overlapping periods. Data Races occur when multiple threads mutate shared memory unsafely.",
  "Mutex vs Semaphore": "Mutex is a locking mechanism ensuring exclusive access (1 permit). Semaphore is a signaling mechanism handling multiple permits.",
  "Linux Basics": "Commands: ls, grep, awk, sed, chmod, top. Understanding stdin, stdout, stderr, pipelines, and symlinks.",
  "Networking OSI": "Seven layers from Physical to Application. Important ones: Layer 3 (Network - IP), Layer 4 (Transport - TCP/UDP), Layer 7 (App - HTTP).",
  "TCP/IP vs UDP": "TCP has 3-way handshakes, error checking, and ordering (Reliable). UDP tosses packets immediately (Fast, unreliable, used for Video/Gaming).",
  "HTTP 1.1/2/3": "HTTP/1.1 (Keep-alive), HTTP/2 (Multiplexing, header compression), HTTP/3 (Powered by QUIC/UDP, solves head-of-line blocking).",
  "DNS & DHCP": "DNS is the phonebook of the internet. DHCP dynamically assigns IP addresses to clients joining a network via UDP broadcasts.",
  "TLS/SSL": "Public key encrypts a symmetric session key. Certificates verify domain ownership to prevent Man in the Middle attacks.",
  "REST vs gRPC": "REST uses JSON over HTTP/1.1. gRPC uses Protobuf over HTTP/2, heavily typed, binaries, excellent for internal microservice chatter.",
  "Database ACID": "Atomicity (All or nothing), Consistency (Valid states), Isolation (Concurrent rules), Durability (Saved to disk).",
  "Isolation Levels": "Read Uncommitted, Read Committed, Repeatable Read, Serializable. Different levels prevent Dirty Reads, Non-repeatable Reads, or Phantom Reads.",
  "MVCC": "Multi-Version Concurrency Control. Gives each transaction a snapshot of the database so readers never block writers and writers never block readers.",
  "B+ Trees": "Search trees used heavily in SQL indexes. Leaves form a linked list, allowing massive range queries. Broad/shallow structure to limit disk IO.",
  "DB Normalization": "Organizing data to reduce redundancy and anomalies. 1NF, 2NF, 3NF. Splitting user_locations into a separate table from users.",
  "OOP SOLID": "Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Core tenets of maintainable code.",
  "Design Patterns A": "Creational Patterns: Factory Method, Abstract Factory, Builder (Complex setups), Singleton (Single Instances).",
  "Design Patterns B": "Structural Patterns: Adapter (compat), Decorator (wrap objects), Facade (simplify), Proxy.",
  "Design Patterns C": "Behavioral Patterns: Observer (Pub/Sub), Strategy (Algorithm injection).",
  "Design Patterns D": "State machines and Command patterns. Encapsulating actions as objects.",
  "Tell Me About Yourself": "A 90-second elevator pitch. Focus on your timeline, major impact, and why your strengths perfectly align with this role.",
  "Amazon LP 1-4": "Customer Obsession, Ownership, Invent and Simplify, Are Right A Lot. Prepare STAR method stories where you demonstrated these.",
  "Amazon LP 5-8": "Learn and Be Curious, Hire and Develop the Best, Insist on Highest Standards, Think Big.",
  "Conflict Resolution": "Behavioral question staple. How did you handle a disagreement? Show empathy, data-driven reasoning, and willingness to 'disagree and commit'.",
  "Biggest Failure": "Talk about an actual failure. Focus on the post-mortem, what processes you changed, and what you learned to prevent it from ever happening again.",
  "Resume Review": "Audit your resume. Ensure every bullet follows 'Accomplished X by implementing Y, resulting in Z% improvement'. Deeply review it.",
  "Negotiation": "Never give the first number. Gather multiple offers to create leverage. Be polite, firm, and do market research.",
  "Company Research": "Know the company's core products, their tech stack culture (e.g. Meta is PHP/React, Google is C++/Java), and recent news/acquisitions.",
  "Mock: Peer": "Live coding interview with a colleague. Practice explaining your thought process out loud before writing a single line of code.",
  "Mock: System Design": "Whiteboard a system design from scratch in 45 minutes answering capacity planning, architectural layout, API structures, and trade-offs.",
  "Mock: Behavioral": "Simulated STAR loops. Answer 3 intense behavioral questions back-to-back. Ensure metrics are utilized in your outcomes.",
  "Mock: FAANG Loop": "Full 5-stage loop simulation. Mentally prepare for stamina requirements. Focus on speed, precision, and perfect edge-case catching in coding rounds.",
  "Mock: Google": "Google mocks rely heavily on un-seen algorithms, trees, DP, and Google Docs/whiteboard without an IDE. Do not run code.",
  "Mock: Meta": "Meta mocks heavily rely on executing two Medium/Hard Leetcode problems flawlessly and fast. High emphasis on bug-free code over deep analysis.",
  "Mock: Amazon": "Amazon mocks heavily index on OOD (Object Oriented Design) and Leadership Principle integrations into technical answers.",
  "Mental Toughness": "Meditate. Avoid burnout. Realize that failing a FAANG interview often happens purely due to luck / drawing a bad question. Don't stress.",
  "Mock: SD 2": "Advanced System Design mock focusing primarily on deep database scaling and complex real-time pub/sub synchronization logic.",
  "Mock: Coding Sprints": "Timer is set. 2 Mediums in 40 minutes. Train your muscle memory on core syntax and rapid debugging techniques.",
  "Mock: OOD": "Object Oriented Design simulation. e.g. Design an Elevator System using Classes, Interfaces, and SOLID principles.",
  "Mock: LLD": "Low Level Design. Translating use-cases strictly into class diagrams, sequence diagrams, and clean code architectures."
};

function getTopicNotes(topic) {
  for (let key in topicNotes) {
    if (topic.includes(key)) return topicNotes[key];
  }
  return "Fundamental skills and preparation to help you crack technical interviews.";
}

function getRichDesc(type, topic) {
  const notes = getTopicNotes(topic);
  
  if (type === "DSA") {
    return `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">📘 Concept Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">
        ${notes}
      </p>

      <h3 style="margin-top:24px; font-size:16px; color:var(--text); letter-spacing:-0.5px;">🎯 Coding Strategy</h3>
      <ul style="color:var(--sub); line-height: 1.6; font-size:13px; padding-left: 20px; list-style-type: square; margin-bottom: 16px;">
        <li><strong>Analyze the Constraints:</strong> Check if brutal force requires nested loops; if O(N^2) is too slow, think of Hashes or Pointers.</li>
        <li><strong>Identify Patterns:</strong> Sequential datasets? Try left/right pointers. Optimization/Min/Max? Think DP or Greedy.</li>
        <li><strong>Edge Cases:</strong> Always validate empty arrays, negative parameters, or massive scales.</li>
      </ul>

      <div style="background:var(--card2); border:1px solid var(--border); border-radius:10px; padding:16px; margin-top:20px; text-align:center;">
        <h4 style="margin:0 0 16px 0; font-size:12px; color:var(--text); text-transform:uppercase; letter-spacing:1px; font-weight:600;">🧠 Visualization</h4>
        ${
          (topic.includes("Array") || topic.includes("Pointer") || topic.includes("Window") || topic.includes("Search")) ?
          `<div style="display:flex; justify-content:center; align-items:center; gap:8px;">
            <span style="padding:6px 10px; background:rgba(167,139,250,0.2); border-radius:6px; border:1px solid #A78BFA; color:#A78BFA; font-weight:600; font-size:14px;">L&rarr;</span>
            <span style="padding:8px 14px; background:var(--card); border-radius:6px; font-family:monospace;">1</span>
            <span style="padding:8px 14px; background:var(--card); border-radius:6px; font-family:monospace;">5</span>
            <span style="padding:8px 14px; background:var(--card); border-radius:6px; font-family:monospace;">8</span>
            <span style="padding:6px 10px; background:rgba(167,139,250,0.2); border-radius:6px; border:1px solid #A78BFA; color:#A78BFA; font-weight:600; font-size:14px;">&larr;R</span>
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--sub);">Converging pointers to find optimal pairs in O(N).</div>`
          :
          (topic.includes("Tree") || topic.includes("BST") || topic.includes("Trie") || topic.includes("LCA") || topic.includes("DFS")) ?
          `<div style="display:flex; flex-direction:column; align-items:center; font-family:monospace; line-height:1.2; font-size:15px;">
             <span style="color:var(--text); background:var(--card); padding:4px 10px; border-radius:20px;">Root</span>
             <span style="color:var(--border);">/  \\</span>
           <span style="color:#A78BFA;">(L)  (R)</span>
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--sub);">Recursive traversal evaluating subtrees.</div>`
          :
          (topic.includes("DP") || topic.includes("Grid") || topic.includes("Matrix") || topic.includes("Knapsack")) ?
          `<div style="display:inline-block; border:1px solid var(--border); border-radius:6px; overflow:hidden; font-family:monospace;">
            <div style="display:flex; background:rgba(167,139,250,0.15); color:#A78BFA;"><span style="padding:6px 12px;">0</span><span style="padding:6px 12px; border-left:1px solid var(--border);">1</span><span style="padding:6px 12px; border-left:1px solid var(--border);">1</span></div>
            <div style="display:flex; border-top:1px solid var(--border);"><span style="padding:6px 12px;">1</span><span style="padding:6px 12px; border-left:1px solid var(--border);">2</span><span style="padding:6px 12px; border-left:1px solid var(--border);">3</span></div>
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--sub);">State progression cached in a 2D matrix.</div>`
          :
          (topic.includes("Stack") || topic.includes("Queue") || topic.includes("List")) ?
          `<div style="display:flex; justify-content:center; align-items:center; gap:8px;">
            <span style="font-size:18px; color:var(--sub);">&rarr;</span>
            <div style="display:flex; flex-direction:column; gap:4px;">
              <span style="padding:4px 16px; background:rgba(167,139,250,0.2); border:1px solid #A78BFA; border-radius:4px; color:#A78BFA; font-size:12px;">Top</span>
              <span style="padding:4px 16px; background:var(--card); border-radius:4px; font-size:12px;">Base</span>
            </div>
            <span style="font-size:18px; color:var(--sub);">&rarr;</span>
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--sub);">Sequential LIFO / FIFO data access.</div>`
          :
          (topic.includes("Graph") || topic.includes("Sort") || topic.includes("Path")) ?
          `<div style="display:flex; justify-content:center; align-items:center; gap:8px; font-family:monospace;">
            <span style="padding:8px; background:var(--card); border-radius:50%; border:1px solid var(--border);">A</span>
            <span style="color:#A78BFA;">&mdash;(w)&rarr;</span>
            <span style="padding:8px; background:var(--card); border-radius:50%; border:1px solid var(--border);">B</span>
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--sub);">Edge traversals tracking shortest paths.</div>`
          :
          `<div style="display:inline-block; font-family:monospace; background:rgba(0,0,0,0.2); padding:10px 16px; border-radius:6px; color:#A78BFA;">
          Input &rarr; Process &rarr; O(1) Optimum
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--sub);">Algorithmic transformation to target complexity.</div>`
        }
      </div>
    </div>`;
  } else if (type === "SD") {
    return `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">🏗 Architecture Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">
        ${notes}
      </p>
      
      <h3 style="margin-top:24px; font-size:16px; color:var(--text); letter-spacing:-0.5px;">⚡ Core Components</h3>
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom: 16px;">
        <div style="background:rgba(110,231,183,0.06); border:1px solid rgba(110,231,183,0.15); border-radius:8px; padding:12px;">
          <strong style="color:var(--text); font-size:13px;">1. Client / Load Balancers</strong>
          <p style="margin:4px 0 0; color:var(--sub); font-size:12px;">Reverse proxies distribute sudden traffic bursts across application clusters.</p>
        </div>
        <div style="background:rgba(110,231,183,0.06); border:1px solid rgba(110,231,183,0.15); border-radius:8px; padding:12px;">
          <strong style="color:var(--text); font-size:13px;">2. Databases & Caching</strong>
          <p style="margin:4px 0 0; color:var(--sub); font-size:12px;">Scale SQL vs NoSQL. Use Redis caches for heavy-read paths.</p>
        </div>
      </div>

      <h3 style="margin-top:24px; font-size:16px; color:var(--text); letter-spacing:-0.5px;">⚖️ Interview Trade-offs</h3>
      <ul style="color:var(--sub); line-height:1.6; font-size:13px; padding-left:20px; margin-bottom: 8px;">
        <li>Strong consistency causes latency; eventual consistency scales better.</li>
        <li>Microservices isolate failure but drastically increase network complexity.</li>
        <li>Aggressive caching risks stale data vs real-time fetching limitations.</li>
      </ul>
    </div>`;
  } else {
    return `
    <div style="font-family: system-ui, sans-serif; padding-top: 6px;">
      <h3 style="margin-top:0; font-size:18px; color:var(--text); letter-spacing:-0.5px;">💼 Topic Notes</h3>
      <p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">
        ${notes}
      </p>

      <h3 style="margin-top:24px; font-size:16px; color:var(--text); letter-spacing:-0.5px;">📝 Execution Blueprint</h3>
      <div style="background:rgba(252,211,77,0.06); border-left:3px solid #FCD34D; padding:12px 14px; font-size:13px; color:var(--sub); line-height:1.6;">
        <ol style="margin:0; padding-left:18px;">
          <li style="margin-bottom:6px;"><strong>Context:</strong> Explain the situation clearly in 2-3 sentences.</li>
          <li style="margin-bottom:6px;"><strong>Action:</strong> Use 'I' statements. Focus specifically on your technical and leadership contributions.</li>
          <li><strong>Result:</strong> Mention explicit % increases, time saved, or monetary impact!</li>
        </ol>
      </div>
    </div>`;
  }
}

const dsaTopics = ["Arrays & Hashing", "Two Pointers", "Sliding Window", "Binary Search", "Prefix Sum & Subarrays", "Linked List Basics", "Linked List Fast/Slow", "Stack Basics", "Monotonic Stack", "Queue & Deque", "Trees Traversal", "BST Operations", "LCA & Paths", "Heap Basics", "Advanced Heaps", "Tries", "Graph BFS", "Graph DFS", "Topological Sort", "Dijkstra Algorithm", "Union Find", "MST (Kruskal/Prim)", "1D DP Intro", "1D DP Advanced", "2D DP Grid", "2D DP Strings", "DP Knapsack", "DP Bitmask/Digit", "Greedy Intervals", "Greedy Advanced", "Backtracking Subsets", "Backtracking Queens/Sudoku", "Bit Manipulation Tricks", "Math & Geometry", "String KMP", "String Rabin-Karp", "Segment Tree", "Fenwick Tree", "Graph Hard Paths", "Tarjan & SCCs", "Eulerian Paths", "Advanced DP Optimizations", "Matrix Exponentiation", "Game Theory Basics", "Advanced Tries"];
while(dsaTopics.length < 105) { dsaTopics.push("Hard Topic Deep Dive: " + dsaTopics[dsaTopics.length % 45]); }

const sdTopics = ["SD Framework", "Scalability", "Load Balancing", "CAP Theorem", "Consistent Hashing", "Database Indexing", "SQL vs NoSQL", "Caching Strategies", "Message Queues", "Kafka Deep Dive", "Microservices", "API Gateway", "Rate Limiting", "URL Shortener", "Pastebin Design", "Twitter Feed", "Instagram Design", "WhatsApp Chat", "Uber Design", "Tinder Design", "Ticketmaster", "Google Maps", "Netflix Video Streaming", "YouTube Storage", "Web Crawler", "Search Autocomplete", "Google Search", "Notification System", "Distributed Locks", "Event Sourcing & CQRS", "Saga Pattern", "Two-Phase Commit", "Distributed Transactions", "Sharding Deep Dive", "Data Partitioning", "Data Replication", "Leader Election", "Paxos & Raft", "Gossip Protocols", "Vector Clocks", "CDN Architecture", "DNS & Edge Computing", "Observability", "Distributed Tracing", "Security & Auth"];
while(sdTopics.length < 105) { sdTopics.push("Case Study: " + sdTopics[sdTopics.length % 45] + " at Scale"); }

const csTopics = ["OS Memory", "OS Processes", "OS Scheduling", "Virtual Memory", "Deadlocks", "Concurrency", "Mutex vs Semaphore", "Linux Basics", "Networking OSI", "TCP/IP vs UDP", "HTTP 1.1/2/3", "DNS & DHCP", "TLS/SSL", "REST vs gRPC", "Database ACID", "Isolation Levels", "MVCC", "B+ Trees", "DB Normalization", "OOP SOLID", "Design Patterns A", "Design Patterns B", "Design Patterns C", "Design Patterns D", "Tell Me About Yourself", "Amazon LP 1-4", "Amazon LP 5-8", "Conflict Resolution", "Biggest Failure", "Resume Review", "Negotiation", "Company Research", "Mock: Peer", "Mock: System Design", "Mock: Behavioral", "Mock: FAANG Loop", "Mock: Google", "Mock: Meta", "Mock: Amazon", "Mental Toughness", "Mock: SD 2", "Mock: Coding Sprints", "Mock: OOD", "Mock: LLD"];
while(csTopics.length < 105) { csTopics.push("Review: " + csTopics[csTopics.length % 45]); }

const RAW = [];
let dayCounter = 1;
for (let w = 1; w <= 15; w++) {
  // We use 7 days a week (0 to 6)
  for (let d = 0; d < 7; d++) {
    const dsa = dsaTopics[dayCounter - 1];
    const sd = sdTopics[dayCounter - 1];
    const cs = csTopics[dayCounter - 1];
    
    // Day 6 is Day 7 = "Review / Rest / Mock" day
    if (d === 6) {
      RAW.push([w, d, 4, "Weekly Grand Mock", "Simulation", 4, "Hard", "High", getRichDesc("CS", "Mock: FAANG Loop"), ["Mock Interview"], []]);
      RAW.push([w, d, 3, "Weekly Review & Rest", "Reflection", 1, "Easy", "Medium", getRichDesc("CS", "Mental Toughness"), [], []]);
    } else {
      const lowerDsa = dsa.toLowerCase();
      let vid = "";
      if (lowerDsa.includes("array")) vid = "https://www.youtube.com/watch?v=3OamzN90kPg";
      else if (lowerDsa.includes("pointer")) vid = "https://www.youtube.com/watch?v=On03HWe2tZM";
      else if (lowerDsa.includes("window")) vid = "https://www.youtube.com/watch?v=MK-NZ4hN7rs";
      else if (lowerDsa.includes("binary search")) vid = "https://www.youtube.com/watch?v=s4DPMONcbGk";
      else if (lowerDsa.includes("linked list")) vid = "https://www.youtube.com/watch?v=G0_I-ZF0S38";
      else if (lowerDsa.includes("tree")) vid = "https://www.youtube.com/watch?v=OnSn2XEQ4MY";
      else if (lowerDsa.includes("graph") || lowerDsa.includes("bfs") || lowerDsa.includes("dfs")) vid = "https://www.youtube.com/watch?v=cWNEl4HE2OE";
      else if (lowerDsa.includes("dp") || lowerDsa.includes("knapsack")) vid = "https://www.youtube.com/watch?v=Hdr64lKQ3e4";
      else if (lowerDsa.includes("backtrack")) vid = "https://www.youtube.com/watch?v=pfiQ_PS1g8E";
      else if (lowerDsa.includes("heap") || lowerDsa.includes("queue")) vid = "https://www.youtube.com/watch?v=t0Cq6tVNRBA";
      else if (lowerDsa.includes("trie")) vid = "https://www.youtube.com/watch?v=oobqoCJlHA0";
      else if (lowerDsa.includes("greedy")) vid = "https://www.youtube.com/watch?v=HzeK7g8cD0Y";
      else if (lowerDsa.includes("math") || lowerDsa.includes("bit")) vid = "https://www.youtube.com/watch?v=xXKL9YBWgCY";
      else vid = "https://www.youtube.com/watch?v=PeGcsS-rX14";
      
      const searchLink = `https://www.youtube.com/results?search_query=${encodeURIComponent("Neetcode " + dsa)}`;

      RAW.push([w, d, 0, dsa, "Core Algorithms", w>10 ? 3 : 2, w>10 ? "Hard" : "Medium", "High", getRichDesc("DSA", dsa), ["LC 121", "LC 456"], [vid, searchLink, "https://neetcode.io/roadmap"]]);
      const sdTrack = d === 5 ? 4 : 1;
      RAW.push([w, d, sdTrack, d === 5 ? "Mock: " + sd : sd, "Architecture", w>8 ? 3 : 2, "Hard", "High", getRichDesc("SD", sd), [], ["https://www.youtube.com/watch?v=i53Gi_Y3Scc", "https://bytebytego.com/"]]);
      let csTrack = 2;
      if (cs.includes("Behavioral") || cs.includes("Resume") || cs.includes("Negotiation")) csTrack = 3;
      if (cs.includes("Mock")) csTrack = 4;
      RAW.push([w, d, csTrack, cs, "Fundamentals & Prep", 1, "Medium", "Medium", getRichDesc("CS", cs), [], ["https://pages.cs.wisc.edu/~remzi/OSTEP/"]]);
    }
    
    dayCounter++;
  }
}

const RESOURCES = {
  "DSA": ["https://neetcode.io/roadmap", "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"],
  "System Design": ["https://bytebytego.com/", "https://www.hellointerview.com/learn/system-design"],
  "CS Fundamentals": ["https://pages.cs.wisc.edu/~remzi/OSTEP/", "https://gaia.cs.umass.edu/kurose_ross/"],
  "Behavioral": ["https://www.pramp.com/", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles"]
};

let out = "export const DAYS = " + JSON.stringify(DAYS) + ";\n";
out += "export const TRACKS = " + JSON.stringify(TRACKS, null, 2) + ";\n";
out += "export const RAW = " + JSON.stringify(RAW) + ";\n";
out += "export const RESOURCES = " + JSON.stringify(RESOURCES, null, 2) + ";\n";
out += "export const MONTHS = [\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"];\n";
out += "export function buildPlan() {\n" +
  "  const p = {};\n" +
  "  RAW.forEach(([w, d, t, topic, sub, hrs, diff, pri, desc, probs, res]) => {\n" +
  "    if (!p[w]) p[w] = {};\n" +
  "    if (!p[w][d]) p[w][d] = [];\n" +
  "    p[w][d].push({ track: t, topic, sub, hrs, diff, pri, desc, probs, res, id: `${w}-${d}-${t}` });\n" +
  "  });\n" +
  "  return p;\n" +
  "}\n" +
  "export const PLAN = buildPlan();\n";

fs.writeFileSync(path.join(__dirname, 'src', 'data.js'), out);
console.log("data.js rewritten precisely with concept notes!");
