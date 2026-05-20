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
  "2D DP Strings": "<ul><li><b>What it is:</b> Build a 2D table where <code>dp[i][j]</code> represents the answer for string A up to index i vs string B up to index j.</li><li><b>Edit Distance:</b> At each cell, choose the minimum of Insert (+1), Delete (+1), or Replace (0 if chars match, +1 if not).</li><li><b>LCS (Longest Common Subsequence):</b> If chars match, <code>dp[i][j] = dp[i-1][j-1] + 1</code>. Otherwise take <code>max(dp[i-1][j], dp[i][j-1])</code>.</li><li><b>Time:</b> O(M×N) where M and N are the string lengths.</li><li><b>Key Insight:</b> Always draw the table on paper first — the recurrence becomes visually obvious.</li></ul>",
  "DP Knapsack": "<ul><li><b>0/1 Knapsack:</b> Given N items with weights and values, maximize value without exceeding capacity W. Each item is used at most once.</li><li><b>State:</b> <code>dp[i][w]</code> = max value using first i items with capacity w. Either skip item i or take it.</li><li><b>Subset Sum:</b> Special case — can a subset of numbers add up exactly to a target? <code>dp[i][s]</code> = true/false.</li><li><b>Space Optimization:</b> Iterate capacity backwards to avoid reusing items in the same row. Reduces to O(W) space.</li><li><b>Unbounded Knapsack:</b> Items can be reused — iterate capacity forwards instead.</li></ul>",
  "DP Bitmask/Digit": "<ul><li><b>Bitmask DP:</b> Represents subsets of N elements as a single integer. Bit i is 1 if element i is included.</li><li><b>Use case:</b> Traveling Salesman (TSP), assignment problems — any problem requiring tracking which elements have been visited.</li><li><b>State:</b> <code>dp[mask][i]</code> = best answer when visited set is <code>mask</code> and currently at node i.</li><li><b>Limit:</b> Only works for N ≤ 20 since 2^N states grow exponentially.</li><li><b>Digit DP:</b> Count numbers up to N satisfying some property. Process digits left to right, tracking if you're still bounded by N.</li></ul>",
  "Greedy Intervals": "<ul><li><b>Core idea:</b> Sort intervals by end time (for max non-overlapping) or start time (for merging). This single sort step unlocks linear solutions.</li><li><b>Merge Intervals:</b> Sort by start. If current interval overlaps previous, merge by extending end. O(N log N).</li><li><b>Activity Selection:</b> Sort by end time. Greedily pick the interval that finishes earliest, skip overlapping ones.</li><li><b>Min Meeting Rooms:</b> Use a min-heap tracking room end times. If earliest room is free, reuse it; otherwise allocate new.</li><li><b>Why Greedy works:</b> Choosing the locally optimal interval (earliest end) provably leads to the global optimum.</li></ul>",
  "Greedy Advanced": "<ul><li><b>When to use Greedy:</b> The problem has optimal substructure AND the greedy choice property — local optimums build global optimum.</li><li><b>Jump Game:</b> Track the farthest reachable index. If you can reach the end, return true. O(N) single pass.</li><li><b>Gas Station:</b> If total gas ≥ total cost, a solution exists. Start from the station where running sum first goes positive.</li><li><b>Task Scheduler:</b> Most frequent task determines minimum slots. Calculate idle gaps. Greedy by frequency.</li><li><b>Proving correctness:</b> Use exchange argument — show swapping any other choice for the greedy choice is never better.</li></ul>",
  "Backtracking Subsets": "<ul><li><b>Core pattern:</b> Recursively build candidates. At each step, choose to include or exclude the current element.</li><li><b>Subsets:</b> For N elements, generate all 2^N subsets. Backtrack by adding element, recursing, then removing (undo).</li><li><b>Permutations:</b> Use a visited array. Try every unvisited element at each position. Backtrack after recursion.</li><li><b>Combinations:</b> Like subsets but with size constraint. Prune early if remaining elements can't fill required size.</li><li><b>Duplicates:</b> Sort input first, skip adjacent duplicates at the same recursion level to avoid duplicate results.</li></ul>",
  "Backtracking Queens/Sudoku": "<ul><li><b>N-Queens:</b> Place N queens on an N×N board so none attack each other. Use column, diagonal, and anti-diagonal sets to validate placements.</li><li><b>Constraint propagation:</b> Before placing, check all constraints. If invalid, prune immediately — don't recurse further.</li><li><b>Sudoku Solver:</b> Find an empty cell, try digits 1-9, validate row/col/box constraints, recurse. Backtrack if stuck.</li><li><b>Time complexity:</b> Worst case exponential, but pruning makes it practical. Good pruning = choosing the most constrained cell first.</li><li><b>Key skill:</b> Encoding constraints efficiently (using sets or bitmasks) dramatically speeds up the solver.</li></ul>",
  "Bit Manipulation Tricks": "<ul><li><b>AND (&):</b> Keeps bits where both are 1. Use <code>n & (n-1)</code> to clear the lowest set bit — counts set bits in O(k).</li><li><b>XOR (^):</b> Returns 1 where bits differ. XOR of all elements finds the single unique number (all duplicates cancel out).</li><li><b>Left/Right Shift:</b> <code>n << 1</code> = multiply by 2. <code>n >> 1</code> = divide by 2. Fast arithmetic without multiplication.</li><li><b>Check if power of 2:</b> <code>n & (n-1) == 0</code> and n > 0. Only one bit is set in powers of 2.</li><li><b>Bitmask as Set:</b> Use integer bits to represent set membership. Union = OR, Intersection = AND, Toggle = XOR.</li></ul>",
  "Math & Geometry": "<ul><li><b>GCD/LCM:</b> Euclidean algorithm — <code>gcd(a,b) = gcd(b, a%b)</code>. LCM = <code>a*b / gcd(a,b)</code>. O(log(min(a,b))).</li><li><b>Modular Arithmetic:</b> <code>(a+b) % m = ((a%m) + (b%m)) % m</code>. Critical for large number problems. Use mod 10^9+7.</li><li><b>Prime Sieve:</b> Sieve of Eratosthenes finds all primes up to N in O(N log log N). Mark multiples as composite.</li><li><b>Matrix Math:</b> Rotate 90° clockwise = transpose then reverse rows. Spiral order = track 4 boundaries shrinking inward.</li><li><b>Geometry:</b> Distance = sqrt((x2-x1)² + (y2-y1)²). Cross product detects clockwise/counterclockwise orientation of 3 points.</li></ul>",
  "String Algorithms": "<ul><li><b>KMP Algorithm:</b> Builds a failure/prefix function to skip already-matched characters. Pattern matching in O(N+M) instead of O(N×M).</li><li><b>Rabin-Karp:</b> Rolling hash — compute hash of window, slide and update in O(1). Compare hashes to find pattern matches.</li><li><b>Palindromes:</b> Expand from center for each character (and between chars). <code>O(N²)</code> for longest palindromic substring.</li><li><b>Anagram Detection:</b> Use frequency arrays (size 26). Two strings are anagrams if they have identical character frequency counts.</li><li><b>String Hashing:</b> Convert string to integer via polynomial hash. Enables O(1) substring comparison after O(N) preprocessing.</li></ul>",

  
  // SD
  "SD Framework": "<ul><li><b>Step 1 — Requirements:</b> Ask clarifying questions. Distinguish functional vs non-functional (latency, scale) requirements.</li><li><b>Step 2 — API Design:</b> Define REST/gRPC endpoints with request/response payloads.</li><li><b>Step 3 — High-Level Design:</b> Draw clients, load balancers, app servers, databases, caches with data flow arrows.</li><li><b>Step 4 — Deep Dive:</b> Zoom into bottlenecks. Discuss DB schema, caching, message queues, scaling.</li><li><b>Step 5 — Wrap Up:</b> Revisit requirements. Discuss monitoring, failure handling, and future extensions.</li></ul>",
  "Scalability": "<ul><li><b>Vertical:</b> Upgrade CPU/RAM on one machine. Simple but has a hardware ceiling and single point of failure.</li><li><b>Horizontal:</b> Add more machines. Requires stateless services and load balancing. Virtually unlimited.</li><li><b>Stateless Design:</b> Store sessions externally (Redis). Any server can handle any request.</li><li><b>DB Scaling:</b> Read replicas for read-heavy loads. Sharding for write-heavy. Each has consistency trade-offs.</li><li><b>Rule of thumb:</b> Design for 10x current load. 1M users today → architect for 10M.</li></ul>",
  "Load Balancing": "<ul><li><b>What it does:</b> Distributes traffic across servers to prevent any single one from being overwhelmed.</li><li><b>Algorithms:</b> Round Robin, Least Connections, IP Hash (sticky sessions), Weighted (by server capacity).</li><li><b>L4 vs L7:</b> Layer 4 routes by IP/port (fast). Layer 7 inspects HTTP headers/URLs (flexible).</li><li><b>Health checks:</b> LB pings servers periodically. Unhealthy servers removed from rotation automatically.</li><li><b>Examples:</b> NGINX, HAProxy, AWS ALB/NLB. Cloud LBs auto-scale and handle SSL termination.</li></ul>",
  "CAP Theorem": "<ul><li><b>Consistency:</b> Every read returns the most recent write. All nodes see the same data.</li><li><b>Availability:</b> Every request gets a response, even if some nodes are down.</li><li><b>Partition Tolerance:</b> System works despite network splits between nodes.</li><li><b>Trade-off:</b> During a partition, choose CP (reject to stay consistent) or AP (serve potentially stale data).</li><li><b>Examples:</b> Banks = CP. Social media = AP. DynamoDB/Cassandra are AP systems.</li></ul>",
  "Consistent Hashing": "<ul><li><b>Problem:</b> Naive mod-hashing reshuffles ALL keys when servers change. Consistent hashing minimizes this.</li><li><b>How:</b> Servers and keys on a virtual ring (0 to 2^32). A key maps to next server clockwise.</li><li><b>Adding server:</b> Only keys between new server and predecessor move. Everything else stays.</li><li><b>Virtual nodes:</b> Each physical server gets multiple ring positions for even load distribution.</li><li><b>Used in:</b> DynamoDB, Cassandra, Memcached, CDN routing.</li></ul>",
  "Database Indexing": "<ul><li><b>What:</b> Sorted data structure (B-Tree) mapping column values to row locations. O(log N) lookups.</li><li><b>Without index:</b> Full table scan — reads every row. Catastrophic on millions of rows.</li><li><b>Trade-off:</b> Indexes speed reads but slow writes (every INSERT/UPDATE must update the index).</li><li><b>Composite index:</b> Index on (A, B) serves queries on A alone but NOT B alone. Order matters.</li><li><b>Covering index:</b> If index contains all queried columns, DB never touches the actual table.</li></ul>",
  "SQL vs NoSQL": "<ul><li><b>SQL:</b> Structured tables, ACID transactions, JOINs. PostgreSQL, MySQL. Best for complex relationships.</li><li><b>NoSQL:</b> Document (MongoDB), Key-Value (Redis), Wide-Column (Cassandra), Graph (Neo4j).</li><li><b>When SQL:</b> Complex relationships, transactions, data integrity critical (banking, orders).</li><li><b>When NoSQL:</b> Massive scale, flexible schema, high write throughput, denormalized data OK.</li><li><b>Interview tip:</b> Explain WHY. \"Payments need ACID → SQL. Activity logs are write-heavy → Cassandra.\"</li></ul>",
  "Caching Strategies": "<ul><li><b>Cache-Aside:</b> App checks cache first. On miss, reads DB, writes to cache. Most common pattern.</li><li><b>Write-Through:</b> Write to cache AND DB simultaneously. Always fresh but adds write latency.</li><li><b>Write-Behind:</b> Write cache only, flush to DB async. Fast but risk of data loss.</li><li><b>Eviction:</b> LRU (Least Recently Used), LFU (Least Frequently Used), TTL expiration.</li><li><b>Cache stampede:</b> Popular key expires, thousands hit DB. Solve with locking or staggered TTLs.</li></ul>",
  "Message Queues": "<ul><li><b>What:</b> Decouples producers from consumers. Producers push messages, consumers pull async.</li><li><b>Benefits:</b> Absorbs traffic spikes, enables retries, independent scaling of producers/consumers.</li><li><b>Delivery:</b> At-most-once (may lose), At-least-once (may duplicate), Exactly-once (hardest).</li><li><b>Dead letter queue:</b> Messages that fail processing repeatedly go here for manual inspection.</li><li><b>Examples:</b> RabbitMQ, AWS SQS, Apache Kafka (distributed log, not just a queue).</li></ul>",
  "Kafka Deep Dive": "<ul><li><b>Architecture:</b> Topics split into Partitions (append-only logs) across Brokers (servers).</li><li><b>Ordering:</b> Messages ordered WITHIN a partition by offset. Not across partitions.</li><li><b>Consumer Groups:</b> Each partition consumed by one consumer in a group. More consumers = parallel.</li><li><b>Retention:</b> Unlike queues, Kafka retains messages for configurable time. Consumers can replay.</li><li><b>Use cases:</b> Event streaming, log aggregation, CDC, real-time analytics pipelines.</li></ul>",
  "Microservices": "<ul><li><b>What:</b> Break monolith into small, independently deployable services, each owning its own data.</li><li><b>Pros:</b> Independent deployment, tech flexibility, isolated failures, team autonomy.</li><li><b>Cons:</b> Network latency, distributed debugging, data consistency, operational complexity.</li><li><b>Communication:</b> Sync (REST/gRPC) for request-response. Async (Kafka/queues) for events.</li><li><b>Key rule:</b> Each microservice should have its OWN database. Sharing DB = tight coupling.</li></ul>",
  "API Gateway": "<ul><li><b>What:</b> Single entry point for all client requests. Routes to appropriate microservices internally.</li><li><b>Features:</b> Auth, rate limiting, request transformation, SSL termination, caching, logging.</li><li><b>Benefits:</b> Clients talk to one URL. Internal topology hidden. Cross-cutting concerns centralized.</li><li><b>BFF Pattern:</b> Different gateways for web vs mobile, optimized for each platform's needs.</li><li><b>Examples:</b> Kong, AWS API Gateway, NGINX, Envoy, Netflix Zuul.</li></ul>",
  "Rate Limiting": "<ul><li><b>Why:</b> Protect APIs from abuse and DDoS. Ensure fair usage across all users.</li><li><b>Token Bucket:</b> Tokens refill at fixed rate. Each request costs a token. Allows short bursts.</li><li><b>Sliding Window:</b> Count requests in rolling time window. More accurate at period boundaries.</li><li><b>Implementation:</b> Redis + Lua script for atomic ops. Key = user ID, Value = count + timestamp.</li><li><b>Response:</b> Return 429 Too Many Requests with Retry-After header when exceeded.</li></ul>",
  "URL Shortener": "<ul><li><b>Flow:</b> Long URL → generate unique short code → store in DB → redirect short→long (301/302).</li><li><b>ID generation:</b> Auto-increment → Base62 encode. Or hash (MD5/SHA) first 7 chars. Handle collisions.</li><li><b>Read-heavy:</b> 100:1 read/write ratio. Cache in Redis. CDN for geographic distribution.</li><li><b>Scale:</b> 100M URLs/month, 7-char Base62 = 3.5 trillion combos. Enough for decades.</li><li><b>Features:</b> Custom aliases, analytics (clicks, geo), expiration TTL, creation rate limiting.</li></ul>",
  "Pastebin Design": "<ul><li><b>Core:</b> User submits text → generate URL → metadata in SQL, raw content in S3.</li><li><b>Storage split:</b> SQL for metadata (URL, user, timestamps). Blob storage for paste content (cheap).</li><li><b>Expiration:</b> Background cron deletes expired pastes. Or use storage-layer TTL.</li><li><b>Read optimization:</b> Cache popular pastes in Redis. CDN for static delivery.</li><li><b>Limits:</b> Max paste size (10MB), rate limiting per user, spam detection.</li></ul>",
  "Twitter Feed": "<ul><li><b>Fan-out on Write (Push):</b> Tweet → push to all followers' pre-computed feeds in Redis. Fast reads.</li><li><b>Fan-out on Read (Pull):</b> Open feed → query all followed users, merge. Expensive reads, cheap writes.</li><li><b>Hybrid:</b> Push for normal users. Pull for celebrities (millions of followers). Twitter uses this.</li><li><b>Timeline:</b> Redis sorted sets per user. Score = timestamp. Trim to latest 800 tweets.</li><li><b>Storage:</b> Tweets in Cassandra. Media in blob storage. Metadata cached heavily.</li></ul>",
  "Instagram Design": "<ul><li><b>Upload:</b> Client → App server (metadata in DB) → Image to S3 → CDN distributes globally.</li><li><b>Feed:</b> Pre-computed feeds per user. Sorted by timestamp + ML-based ranking.</li><li><b>Storage:</b> Cassandra (write-heavy user data), PostgreSQL (relationships), S3 (images).</li><li><b>Processing:</b> Generate multiple resolutions (thumb, medium, full) async via worker queues.</li><li><b>Scale:</b> 2B+ monthly users. Shard by user ID. CDN serves most traffic (cached images).</li></ul>",
  "WhatsApp Chat": "<ul><li><b>Connections:</b> WebSockets for persistent bidirectional communication. Long-lived per device.</li><li><b>Message flow:</b> Sender → Server → if recipient online, deliver. Otherwise queue until they connect.</li><li><b>Groups:</b> Server fans out message to all members. Track online users on connection servers.</li><li><b>E2E Encryption:</b> Signal Protocol. Keys exchanged at registration. Server can't read messages.</li><li><b>Receipts:</b> Single tick (sent), double tick (delivered), blue tick (read). Each is a separate ack.</li></ul>",
  "Uber Design": "<ul><li><b>Location:</b> Drivers send GPS every 3-5 sec. Stored in-memory (Redis) for real-time queries.</li><li><b>Geospatial index:</b> Quadtrees or GeoHash to find nearby drivers within radius.</li><li><b>Matching:</b> Find nearby available drivers → send request → first accept wins → start trip.</li><li><b>ETA:</b> Dijkstra/A* on road graph. Factor in real-time traffic from driver GPS streams.</li><li><b>Surge pricing:</b> Supply/demand algorithm. High demand + low supply = price multiplier.</li></ul>",
  "Tinder Design": "<ul><li><b>Profiles:</b> Photos in S3, metadata in DB. Indexed by location, age, gender for filtering.</li><li><b>Recommendations:</b> Pre-compute potential matches by location + preferences. Cache in Redis.</li><li><b>Swiping:</b> Each swipe = write to DB. Mutual like detected → create match, notify both.</li><li><b>Geo queries:</b> GeoHash or PostGIS for location filtering. Update location periodically.</li><li><b>Scale:</b> Shard by region. Most interactions are local. Cross-region only for travelers.</li></ul>",
  "Ticketmaster": "<ul><li><b>Challenge:</b> Thousands trying to book same seats. Must prevent double-booking.</li><li><b>Virtual waiting room:</b> Queue users before booking page. Controls concurrency.</li><li><b>Seat locking:</b> User selects seats → lock 5 min (TTL). Payment confirms or lock releases.</li><li><b>Distributed locks:</b> Redis SETNX or Redlock for atomic reservation across servers.</li><li><b>Inventory:</b> Available/reserved/sold states. Event-sourced for audit trail.</li></ul>",
  "Google Maps": "<ul><li><b>Graph:</b> Road network as weighted directed graph. Intersections = nodes. Roads = edges.</li><li><b>Routing:</b> A* with heuristics. Pre-computed contraction hierarchies for speed.</li><li><b>Traffic:</b> Aggregate GPS from millions of phones. Update edge weights dynamically.</li><li><b>Map tiles:</b> Pre-rendered at multiple zoom levels. Served from CDN by viewport.</li><li><b>Search:</b> Inverted index + geospatial filtering. Autocomplete via prefix trie + popularity.</li></ul>",
  "Netflix Video Streaming": "<ul><li><b>Encoding:</b> Video transcoded into multiple resolutions (240p-4K) and bitrates. Split into chunks.</li><li><b>Adaptive streaming:</b> HLS/DASH. Client measures bandwidth, switches quality mid-stream.</li><li><b>CDN (Open Connect):</b> Custom CDN boxes inside ISP data centers. Content pre-positioned near users.</li><li><b>Architecture:</b> Control plane (user data, recs) in AWS. Data plane (video) via Open Connect.</li><li><b>Recommendations:</b> ML models pick content. Even thumbnails are A/B tested for click-through.</li></ul>",
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
      ${notes.includes('<ul>') ? `<div style="color:var(--text); line-height:1.7; font-size:13px; margin-bottom:16px;">${notes}</div>` : `<p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">${notes}</p>`}

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
      ${notes.includes('<ul>') ? `<div style="color:var(--text); line-height:1.7; font-size:13px; margin-bottom:16px;">${notes}</div>` : `<p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">${notes}</p>`}
      
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
      ${notes.includes('<ul>') ? `<div style="color:var(--text); line-height:1.7; font-size:13px; margin-bottom:16px;">${notes}</div>` : `<p style="color:var(--text); line-height:1.6; font-size:14px; margin-bottom: 16px;">${notes}</p>`}

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
