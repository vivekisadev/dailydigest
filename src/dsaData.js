// Auto-generated DSA Roadmap Data

export const DSA_TRACKS = [
  {
    "id": 0,
    "label": "Foundations",
    "color": "#58A6FF",
    "icon": "💻",
    "bg": "#58A6FF22"
  },
  {
    "id": 1,
    "label": "Core Data Structures",
    "color": "#BC8CFF",
    "icon": "💻",
    "bg": "#BC8CFF22"
  },
  {
    "id": 2,
    "label": "Recursion & Backtracking",
    "color": "#F778BA",
    "icon": "💻",
    "bg": "#F778BA22"
  },
  {
    "id": 3,
    "label": "Trees & Heaps",
    "color": "#56D4DD",
    "icon": "💻",
    "bg": "#56D4DD22"
  },
  {
    "id": 4,
    "label": "Graphs",
    "color": "#FFA657",
    "icon": "💻",
    "bg": "#FFA65722"
  },
  {
    "id": 5,
    "label": "Greedy",
    "color": "#7EE787",
    "icon": "💻",
    "bg": "#7EE78722"
  },
  {
    "id": 6,
    "label": "Dynamic Programming",
    "color": "#FFD33D",
    "icon": "💻",
    "bg": "#FFD33D22"
  },
  {
    "id": 7,
    "label": "Advanced Topics",
    "color": "#FF7B72",
    "icon": "💻",
    "bg": "#FF7B7222"
  }
];

export const DSA_RAW = [
  [
    1,
    0,
    0,
    "Math & Number Theory",
    "https://leetcode.com/problemset/all/?search=Math%20%26%20Number%20Theory",
    2,
    "High",
    "Algorithms",
    "<p>Number-theoretic building blocks — primes, exponents, digit logic — that quietly recur across interview problems.</p><br/><h4>Example / Details</h4><p><i>Mathematical foundations are crucial for algorithmic problem solving. They include prime factorization, modulo arithmetic, and the Euclidean algorithm.<br><br><b>Example: Euclidean GCD</b><br><pre><code style=\"color:#58A6FF;\">function gcd(a, b) {<br>  return b === 0 ? a : gcd(b, a % b);<br>}</code></pre></i></p>",
    "dsa-1-0-0"
  ],
  [
    1,
    1,
    0,
    "Bit Manipulation",
    "https://leetcode.com/problemset/all/?search=Bit%20Manipulation",
    2,
    "High",
    "Algorithms",
    "<p>XOR tricks, masks, and binary representation for O(1)-space optimizations and bitmask search.</p><br/><h4>Example / Details</h4><p><i>Bit manipulation involves operating directly on binary digits using bitwise operators (AND, OR, XOR, NOT, Shifts). It's incredibly fast and space-efficient.<br><br><b>Example: Check if a number is a power of 2</b><br><pre><code style=\"color:#58A6FF;\">function isPowerOfTwo(n) {<br>  return n > 0 && (n & (n - 1)) === 0;<br>}</code></pre></i></p>",
    "dsa-1-1-0"
  ],
  [
    1,
    2,
    1,
    "Arrays",
    "https://leetcode.com/problemset/all/?search=Arrays",
    2,
    "High",
    "Algorithms",
    "<p>In-place manipulation, prefix sums, and traversal patterns — the most-tested data structure in any interview.</p><br/><h4>Example / Details</h4><p><i>Arrays are contiguous blocks of memory. Array problems often involve prefix sums, multiple passes, or maintaining state across traversals.<br><br><b>Example: Prefix Sum Array</b><br><pre><code style=\"color:#58A6FF;\">let prefix = [nums[0]];<br>for(let i=1; i&lt;nums.length; i++) {<br>  prefix[i] = prefix[i-1] + nums[i];<br>}</code></pre></i></p>",
    "dsa-1-2-1"
  ],
  [
    1,
    3,
    1,
    "Strings",
    "https://leetcode.com/problemset/all/?search=Strings",
    2,
    "High",
    "Algorithms",
    "<p>Parsing, transformation, and matching over character sequences.</p><br/><h4>Example / Details</h4><p><i>String manipulation relies heavily on character arrays and ASCII operations. Common techniques include anagram checking, palindromes, and sliding windows.<br><br><b>Example: Check Palindrome</b><br><pre><code style=\"color:#58A6FF;\">const isPalindrome = str => str === str.split('').reverse().join('');</code></pre></i></p>",
    "dsa-1-3-1"
  ],
  [
    1,
    4,
    1,
    "Searching & Sorting",
    "https://leetcode.com/problemset/all/?search=Searching%20%26%20Sorting",
    2,
    "High",
    "Algorithms",
    "<p>Binary search variants and sorting-driven techniques for shrinking the search space to O(log n).</p><br/><h4>Example / Details</h4><p><i>Binary search finds elements in O(log n) time. It can be applied not just to sorted arrays, but also to monotonic functions (Binary Search on Answer).<br><br><b>Example: Binary Search</b><br><pre><code style=\"color:#58A6FF;\">let l = 0, r = arr.length - 1;<br>while(l &lt;= r) {<br>  let mid = Math.floor((l+r)/2);<br>  if(arr[mid] === target) return mid;<br>  if(arr[mid] &lt; target) l = mid + 1;<br>  else r = mid - 1;<br>}</code></pre></i></p>",
    "dsa-1-4-1"
  ],
  [
    1,
    5,
    1,
    "Two Pointers & Sliding Window",
    "https://leetcode.com/problemset/all/?search=Two%20Pointers%20%26%20Sliding%20Window",
    2,
    "High",
    "Algorithms",
    "<p>Maintain a moving window or pair of pointers to turn O(n²) brute force into O(n).</p><br/><h4>Example / Details</h4><p><i>Two pointers optimize O(n^2) array problems to O(n) by traversing from both ends or maintaining a sliding window to track constraints.<br><br><b>Example: Two Sum in Sorted Array</b><br><pre><code style=\"color:#58A6FF;\">let l = 0, r = arr.length - 1;<br>while(l &lt; r) {<br>  let sum = arr[l] + arr[r];<br>  if (sum === target) return [l, r];<br>  if (sum &lt; target) l++;<br>  else r--;<br>}</code></pre></i></p>",
    "dsa-1-5-1"
  ],
  [
    1,
    6,
    1,
    "Linked List",
    "https://leetcode.com/problemset/all/?search=Linked%20List",
    2,
    "High",
    "Algorithms",
    "<p>Pointer manipulation — reversal, cycle detection, and merging without extra memory.</p><br/><h4>Example / Details</h4><p><i>Linked lists represent sequences via pointers. Key techniques: Fast/Slow pointers (Floyd's cycle detection), dummy nodes, and in-place reversal.<br><br><b>Example: Reverse Linked List</b><br><pre><code style=\"color:#58A6FF;\">let prev = null, curr = head;<br>while (curr) {<br>  let next = curr.next;<br>  curr.next = prev;<br>  prev = curr;<br>  curr = next;<br>}</code></pre></i></p>",
    "dsa-1-6-1"
  ],
  [
    2,
    0,
    1,
    "Stack & Queue",
    "https://leetcode.com/problemset/all/?search=Stack%20%26%20Queue",
    2,
    "High",
    "Algorithms",
    "<p>LIFO/FIFO structures for parsing, monotonic-stack patterns, and simulation.</p><br/><h4>Example / Details</h4><p><i>Stacks (LIFO) and Queues (FIFO) are fundamental. Monotonic stacks are powerful for finding the \"Next Greater Element\" in O(n) time.<br><br><b>Example: Monotonic Stack</b><br><pre><code style=\"color:#58A6FF;\">let stack = [];<br>for (let num of nums) {<br>  while (stack.length && stack[stack.length-1] &lt; num) {<br>    console.log(\"Next greater is\", num);<br>    stack.pop();<br>  }<br>  stack.push(num);<br>}</code></pre></i></p>",
    "dsa-2-0-1"
  ],
  [
    2,
    1,
    1,
    "Hashing",
    "https://leetcode.com/problemset/all/?search=Hashing",
    2,
    "High",
    "Algorithms",
    "<p>O(1) average lookups for frequency counting, deduplication, and existence checks.</p><br/><h4>Example / Details</h4><p><i>Hash Maps provide O(1) average time complexity for lookups. They are essential for caching, frequency counting, and optimizing array problems.<br><br><b>Example: Frequency Counter</b><br><pre><code style=\"color:#58A6FF;\">let map = new Map();<br>for (let n of nums) {<br>  map.set(n, (map.get(n) || 0) + 1);<br>}</code></pre></i></p>",
    "dsa-2-1-1"
  ],
  [
    2,
    2,
    2,
    "Recursion & Backtracking",
    "https://leetcode.com/problemset/all/?search=Recursion%20%26%20Backtracking",
    2,
    "High",
    "Algorithms",
    "<p>Explore a solution space by trying, undoing, and pruning — the engine behind combinatorial search.</p><br/><h4>Example / Details</h4><p><i>Backtracking systematically searches for a solution by exploring all possibilities and abandoning paths (\"pruning\") when they fail constraints.<br><br><b>Example: Subsets</b><br><pre><code style=\"color:#58A6FF;\">function backtrack(start, path) {<br>  res.push([...path]);<br>  for(let i=start; i&lt;nums.length; i++) {<br>    path.push(nums[i]);<br>    backtrack(i+1, path);<br>    path.pop();<br>  }<br>}</code></pre></i></p>",
    "dsa-2-2-2"
  ],
  [
    2,
    3,
    3,
    "Binary Trees",
    "https://leetcode.com/problemset/all/?search=Binary%20Trees",
    2,
    "High",
    "Algorithms",
    "<p>Recursive and iterative traversal patterns for hierarchical data.</p><br/><h4>Example / Details</h4><p><i>Trees are hierarchical structures. Mastering DFS (Pre/In/Post-order) and BFS (Level-order) traversals is mandatory.<br><br><b>Example: DFS Traversal</b><br><pre><code style=\"color:#58A6FF;\">function dfs(node) {<br>  if (!node) return;<br>  dfs(node.left);<br>  console.log(node.val);<br>  dfs(node.right);<br>}</code></pre></i></p>",
    "dsa-2-3-3"
  ],
  [
    2,
    4,
    3,
    "Binary Search Trees",
    "https://leetcode.com/problemset/all/?search=Binary%20Search%20Trees",
    2,
    "High",
    "Algorithms",
    "<p>Ordered trees enabling O(log n) search, insert, delete, and range queries.</p><br/><h4>Example / Details</h4><p><i>A BST maintains the property: Left Subtree &lt; Node &lt; Right Subtree. In-order traversal of a BST yields sorted elements.<br><br><b>Example: Validate BST</b><br><pre><code style=\"color:#58A6FF;\">function isValid(node, min = -Infinity, max = Infinity) {<br>  if (!node) return true;<br>  if (node.val &lt;= min || node.val &gt;= max) return false;<br>  return isValid(node.left, min, node.val) && isValid(node.right, node.val, max);<br>}</code></pre></i></p>",
    "dsa-2-4-3"
  ],
  [
    2,
    5,
    3,
    "Heaps / Priority Queue",
    "https://leetcode.com/problemset/all/?search=Heaps%20%2F%20Priority%20Queue",
    2,
    "High",
    "Algorithms",
    "<p>Constant-time access to the min/max element — scheduling, top-K, and stream problems.</p><br/><h4>Example / Details</h4><p><i>Heaps provide fast access to the min/max element in O(1) and insertion in O(log n). Useful for top-K problems and merging algorithms.<br><br><b>Concept</b>: Using a Min-Priority Queue to keep track of the K largest elements.</i></p>",
    "dsa-2-5-3"
  ],
  [
    2,
    6,
    3,
    "Trie",
    "https://leetcode.com/problemset/all/?search=Trie",
    2,
    "High",
    "Algorithms",
    "<p>Prefix trees for fast string lookups, autocomplete, and word search.</p><br/><h4>Example / Details</h4><p><i>A Trie (Prefix Tree) stores strings efficiently. It excels at auto-complete, spell-checking, and prefix matching operations in O(L) time.<br><br><b>Example: Insert Node</b><br><pre><code style=\"color:#58A6FF;\">let curr = root;<br>for (let char of word) {<br>  if (!curr.children[char]) curr.children[char] = new TrieNode();<br>  curr = curr.children[char];<br>}<br>curr.isEnd = true;</code></pre></i></p>",
    "dsa-2-6-3"
  ],
  [
    3,
    0,
    4,
    "Graph Fundamentals (BFS / DFS)",
    "https://leetcode.com/problemset/all/?search=Graph%20Fundamentals%20(BFS%20%2F%20DFS)",
    2,
    "High",
    "Algorithms",
    "<p>Traverse components, detect cycles, and explore grids using breadth-first and depth-first search.</p><br/><h4>Example / Details</h4><p><i>Graphs model relationships. BFS finds the shortest path in unweighted graphs, while DFS explores deep into connected components.<br><br><b>Example: BFS</b><br><pre><code style=\"color:#58A6FF;\">let q = [startNode];<br>while(q.length) {<br>  let node = q.shift();<br>  for(let neighbor of graph[node]) {<br>    if(!visited.has(neighbor)) { visited.add(neighbor); q.push(neighbor); }<br>  }<br>}</code></pre></i></p>",
    "dsa-3-0-4"
  ],
  [
    3,
    1,
    4,
    "Advanced Graphs (Shortest Path, MST, Union-Find)",
    "https://leetcode.com/problemset/all/?search=Advanced%20Graphs%20(Shortest%20Path%2C%20MST%2C%20Union-Find)",
    2,
    "High",
    "Algorithms",
    "<p>Weighted graphs — Dijkstra-style shortest paths, minimum spanning trees, and union-find.</p><br/><h4>Example / Details</h4><p><i>Advanced graph techniques: Dijkstra's for weighted shortest paths, Kruskal's for Minimum Spanning Tree, and Union-Find for disjoint sets.<br><br><b>Example: Union Find (Find)</b><br><pre><code style=\"color:#58A6FF;\">function find(i) {<br>  if (parent[i] === i) return i;<br>  return parent[i] = find(parent[i]); // Path compression<br>}</code></pre></i></p>",
    "dsa-3-1-4"
  ],
  [
    3,
    2,
    5,
    "Greedy Algorithms",
    "https://leetcode.com/problemset/all/?search=Greedy%20Algorithms",
    2,
    "High",
    "Algorithms",
    "<p>Locally optimal choices that provably lead to a globally optimal answer.</p><br/><h4>Example / Details</h4><p><i>Greedy makes the locally optimal choice at each step with the hope of finding a global optimum. Proving correctness is the hardest part.<br><br><b>Concept</b>: Always picking the activity that finishes earliest to maximize total activities.</i></p>",
    "dsa-3-2-5"
  ],
  [
    3,
    3,
    6,
    "DP Fundamentals (1D)",
    "https://leetcode.com/problemset/all/?search=DP%20Fundamentals%20(1D)",
    2,
    "High",
    "Algorithms",
    "<p>Overlapping subproblems in a single dimension — the gateway into dynamic programming.</p><br/><h4>Example / Details</h4><p><i>DP breaks problems down into overlapping subproblems. 1D DP typically involves state transitions based on an array or a sequence.<br><br><b>Example: Fibonacci DP</b><br><pre><code style=\"color:#58A6FF;\">let dp = [0, 1];<br>for (let i=2; i&lt;=n; i++) {<br>  dp[i] = dp[i-1] + dp[i-2];<br>}</code></pre></i></p>",
    "dsa-3-3-6"
  ],
  [
    3,
    4,
    6,
    "DP on Grids & Knapsack (2D)",
    "https://leetcode.com/problemset/all/?search=DP%20on%20Grids%20%26%20Knapsack%20(2D)",
    2,
    "High",
    "Algorithms",
    "<p>Two-dimensional DP states — grid paths, subset-sum, and the 0/1 knapsack pattern.</p><br/><h4>Example / Details</h4><p><i>2D DP handles grids or sets where states depend on two variables (e.g. index and remaining capacity in 0/1 Knapsack).<br><br><b>Example: Grid Paths</b><br><pre><code style=\"color:#58A6FF;\">dp[i][j] = dp[i-1][j] + dp[i][j-1];</code></pre></i></p>",
    "dsa-3-4-6"
  ],
  [
    3,
    5,
    6,
    "DP on Strings",
    "https://leetcode.com/problemset/all/?search=DP%20on%20Strings",
    2,
    "High",
    "Algorithms",
    "<p>Subsequence and substring DP — LCS, edit distance, and palindrome partitioning.</p><br/><h4>Example / Details</h4><p><i>DP on strings often involves longest common subsequence, edit distance, or palindrome partitioning.<br><br><b>Example: Longest Common Subsequence</b><br><pre><code style=\"color:#58A6FF;\">if (text1[i] === text2[j]) dp[i][j] = 1 + dp[i-1][j-1];<br>else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);</code></pre></i></p>",
    "dsa-3-5-6"
  ],
  [
    3,
    6,
    6,
    "DP on Trees & Bitmask DP",
    "https://leetcode.com/problemset/all/?search=DP%20on%20Trees%20%26%20Bitmask%20DP",
    2,
    "High",
    "Algorithms",
    "<p>Advanced DP states — recursion on trees, or subsets encoded as bitmasks for exponential state spaces.</p><br/><h4>Example / Details</h4><p><i>Tree DP computes answers from leaves up to the root. Bitmask DP uses integers to represent sets of visited states for TSP-like problems.<br><br><b>Concept</b>: Using (1 &lt;&lt; i) to check or set the i-th bit representing the i-th item.</i></p>",
    "dsa-3-6-6"
  ],
  [
    4,
    0,
    7,
    "Segment Tree & Fenwick Tree (BIT)",
    "https://leetcode.com/problemset/all/?search=Segment%20Tree%20%26%20Fenwick%20Tree%20(BIT)",
    2,
    "High",
    "Algorithms",
    "<p>Range query/update structures that answer prefix-sum, range-min, and range-max queries in O(log n).</p><br/><h4>Example / Details</h4><p><i>Segment Trees perform range queries (Sum, Min, Max) and updates in O(log n) time. Essential for dynamic array statistics.<br><br><b>Concept</b>: Representing an array as a tree where each node holds the sum of a specific segment.</i></p>",
    "dsa-4-0-7"
  ],
  [
    4,
    1,
    7,
    "Advanced Graph Algorithms (SCC, Bridges, Articulation Points)",
    "https://leetcode.com/problemset/all/?search=Advanced%20Graph%20Algorithms%20(SCC%2C%20Bridges%2C%20Articulation%20Points)",
    2,
    "High",
    "Algorithms",
    "<p>Deep graph theory — bridges, articulation points, strongly connected components, and biconnectivity.</p><br/><h4>Example / Details</h4><p><i>Tarjan's or Kosaraju's algorithms find Strongly Connected Components. Identifying bridges is critical for network vulnerability analysis.<br><br><b>Concept</b>: Maintaining discovery times and \"lowest reachable node\" (low-link) values during DFS.</i></p>",
    "dsa-4-1-7"
  ],
  [
    4,
    2,
    7,
    "String Pattern Matching (KMP, Z, Rabin-Karp, Manacher)",
    "https://leetcode.com/problemset/all/?search=String%20Pattern%20Matching%20(KMP%2C%20Z%2C%20Rabin-Karp%2C%20Manacher)",
    2,
    "High",
    "Algorithms",
    "<p>Linear-time substring search and string processing for when brute-force matching is too slow.</p><br/><h4>Example / Details</h4><p><i>Advanced string algorithms find patterns in O(N+M) time. KMP uses an LPS array to skip redundant comparisons.<br><br><b>Concept</b>: Precomputing a hash or prefix array to avoid matching characters we already know match.</i></p>",
    "dsa-4-2-7"
  ],
  [
    4,
    3,
    7,
    "Number Theory, Combinatorics & Digit DP",
    "https://leetcode.com/problemset/all/?search=Number%20Theory%2C%20Combinatorics%20%26%20Digit%20DP",
    2,
    "High",
    "Algorithms",
    "<p>Modular arithmetic, combinatorics, and digit-by-digit DP for counting problems at scale.</p><br/><h4>Example / Details</h4><p><i>Digit DP counts numbers in a range that satisfy specific properties without iterating over them. Combinatorics relies on nCr % p calculations.<br><br><b>Concept</b>: Passing a \"tight\" boolean flag in DP state to restrict digits up to a limit.</i></p>",
    "dsa-4-3-7"
  ]
];

export const DSA_RESOURCES = {
  "Math & Number Theory": [
    {
      "id": "prob-MathNumberTheory-0",
      "title": "Palindrome Number",
      "link": "https://leetcode.com/problems/palindrome-number/",
      "difficulty": "E"
    },
    {
      "id": "prob-MathNumberTheory-1",
      "title": "Fizz Buzz",
      "link": "https://leetcode.com/problems/fizz-buzz/",
      "difficulty": "E"
    },
    {
      "id": "prob-MathNumberTheory-2",
      "title": "Power of Two",
      "link": "https://leetcode.com/problems/power-of-two/",
      "difficulty": "E"
    },
    {
      "id": "prob-MathNumberTheory-3",
      "title": "Sqrt(x)",
      "link": "https://leetcode.com/problems/sqrtx/",
      "difficulty": "E"
    },
    {
      "id": "prob-MathNumberTheory-4",
      "title": "Reverse Integer",
      "link": "https://leetcode.com/problems/reverse-integer/",
      "difficulty": "M"
    },
    {
      "id": "prob-MathNumberTheory-5",
      "title": "Pow(x, n)",
      "link": "https://leetcode.com/problems/powx-n/",
      "difficulty": "M"
    },
    {
      "id": "prob-MathNumberTheory-6",
      "title": "Factorial Trailing Zeroes",
      "link": "https://leetcode.com/problems/factorial-trailing-zeroes/",
      "difficulty": "M"
    },
    {
      "id": "prob-MathNumberTheory-7",
      "title": "Count Primes",
      "link": "https://leetcode.com/problems/count-primes/",
      "difficulty": "M"
    },
    {
      "id": "prob-MathNumberTheory-8",
      "title": "Super Pow",
      "link": "https://leetcode.com/problems/super-pow/",
      "difficulty": "M"
    },
    {
      "id": "prob-MathNumberTheory-9",
      "title": "Basic Calculator",
      "link": "https://leetcode.com/problems/basic-calculator/",
      "difficulty": "H"
    },
    {
      "id": "prob-MathNumberTheory-10",
      "title": "Max Points on a Line",
      "link": "https://leetcode.com/problems/max-points-on-a-line/",
      "difficulty": "H"
    }
  ],
  "Bit Manipulation": [
    {
      "id": "prob-BitManipulation-0",
      "title": "Single Number",
      "link": "https://leetcode.com/problems/single-number/",
      "difficulty": "E"
    },
    {
      "id": "prob-BitManipulation-1",
      "title": "Number of 1 Bits",
      "link": "https://leetcode.com/problems/number-of-1-bits/",
      "difficulty": "E"
    },
    {
      "id": "prob-BitManipulation-2",
      "title": "Missing Number",
      "link": "https://leetcode.com/problems/missing-number/",
      "difficulty": "E"
    },
    {
      "id": "prob-BitManipulation-3",
      "title": "Hamming Distance",
      "link": "https://leetcode.com/problems/hamming-distance/",
      "difficulty": "E"
    },
    {
      "id": "prob-BitManipulation-4",
      "title": "Single Number II",
      "link": "https://leetcode.com/problems/single-number-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-BitManipulation-5",
      "title": "Single Number III",
      "link": "https://leetcode.com/problems/single-number-iii/",
      "difficulty": "M"
    },
    {
      "id": "prob-BitManipulation-6",
      "title": "Sum of Two Integers",
      "link": "https://leetcode.com/problems/sum-of-two-integers/",
      "difficulty": "M"
    },
    {
      "id": "prob-BitManipulation-7",
      "title": "Bitwise AND of Numbers Range",
      "link": "https://leetcode.com/problems/bitwise-and-of-numbers-range/",
      "difficulty": "M"
    },
    {
      "id": "prob-BitManipulation-8",
      "title": "Subsets (bitmask approach)",
      "link": "https://leetcode.com/problems/subsets/",
      "difficulty": "M"
    },
    {
      "id": "prob-BitManipulation-9",
      "title": "Maximum XOR of Two Numbers in an Array",
      "link": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
      "difficulty": "M"
    },
    {
      "id": "prob-BitManipulation-10",
      "title": "Total Hamming Distance",
      "link": "https://leetcode.com/problems/total-hamming-distance/",
      "difficulty": "M"
    }
  ],
  "Arrays": [
    {
      "id": "prob-Arrays-0",
      "title": "Two Sum",
      "link": "https://leetcode.com/problems/two-sum/",
      "difficulty": "E"
    },
    {
      "id": "prob-Arrays-1",
      "title": "Best Time to Buy and Sell Stock",
      "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      "difficulty": "E"
    },
    {
      "id": "prob-Arrays-2",
      "title": "Contains Duplicate",
      "link": "https://leetcode.com/problems/contains-duplicate/",
      "difficulty": "E"
    },
    {
      "id": "prob-Arrays-3",
      "title": "Move Zeroes",
      "link": "https://leetcode.com/problems/move-zeroes/",
      "difficulty": "E"
    },
    {
      "id": "prob-Arrays-4",
      "title": "Product of Array Except Self",
      "link": "https://leetcode.com/problems/product-of-array-except-self/",
      "difficulty": "M"
    },
    {
      "id": "prob-Arrays-5",
      "title": "Maximum Subarray",
      "link": "https://leetcode.com/problems/maximum-subarray/",
      "difficulty": "M"
    },
    {
      "id": "prob-Arrays-6",
      "title": "3Sum",
      "link": "https://leetcode.com/problems/3sum/",
      "difficulty": "M"
    },
    {
      "id": "prob-Arrays-7",
      "title": "Rotate Array",
      "link": "https://leetcode.com/problems/rotate-array/",
      "difficulty": "M"
    },
    {
      "id": "prob-Arrays-8",
      "title": "Next Permutation",
      "link": "https://leetcode.com/problems/next-permutation/",
      "difficulty": "M"
    },
    {
      "id": "prob-Arrays-9",
      "title": "First Missing Positive",
      "link": "https://leetcode.com/problems/first-missing-positive/",
      "difficulty": "H"
    },
    {
      "id": "prob-Arrays-10",
      "title": "Trapping Rain Water",
      "link": "https://leetcode.com/problems/trapping-rain-water/",
      "difficulty": "H"
    },
    {
      "id": "prob-Arrays-11",
      "title": "Median of Two Sorted Arrays",
      "link": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "difficulty": "H"
    }
  ],
  "Strings": [
    {
      "id": "prob-Strings-0",
      "title": "Valid Anagram",
      "link": "https://leetcode.com/problems/valid-anagram/",
      "difficulty": "E"
    },
    {
      "id": "prob-Strings-1",
      "title": "Valid Palindrome",
      "link": "https://leetcode.com/problems/valid-palindrome/",
      "difficulty": "E"
    },
    {
      "id": "prob-Strings-2",
      "title": "Reverse String",
      "link": "https://leetcode.com/problems/reverse-string/",
      "difficulty": "E"
    },
    {
      "id": "prob-Strings-3",
      "title": "Longest Common Prefix",
      "link": "https://leetcode.com/problems/longest-common-prefix/",
      "difficulty": "E"
    },
    {
      "id": "prob-Strings-4",
      "title": "Longest Substring Without Repeating Characters",
      "link": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      "difficulty": "M"
    },
    {
      "id": "prob-Strings-5",
      "title": "Group Anagrams",
      "link": "https://leetcode.com/problems/group-anagrams/",
      "difficulty": "M"
    },
    {
      "id": "prob-Strings-6",
      "title": "Longest Palindromic Substring",
      "link": "https://leetcode.com/problems/longest-palindromic-substring/",
      "difficulty": "M"
    },
    {
      "id": "prob-Strings-7",
      "title": "String to Integer (atoi)",
      "link": "https://leetcode.com/problems/string-to-integer-atoi/",
      "difficulty": "M"
    },
    {
      "id": "prob-Strings-8",
      "title": "Zigzag Conversion",
      "link": "https://leetcode.com/problems/zigzag-conversion/",
      "difficulty": "M"
    },
    {
      "id": "prob-Strings-9",
      "title": "Minimum Window Substring",
      "link": "https://leetcode.com/problems/minimum-window-substring/",
      "difficulty": "H"
    },
    {
      "id": "prob-Strings-10",
      "title": "Regular Expression Matching",
      "link": "https://leetcode.com/problems/regular-expression-matching/",
      "difficulty": "H"
    },
    {
      "id": "prob-Strings-11",
      "title": "Text Justification",
      "link": "https://leetcode.com/problems/text-justification/",
      "difficulty": "H"
    }
  ],
  "Searching & Sorting": [
    {
      "id": "prob-SearchingSorting-0",
      "title": "Binary Search",
      "link": "https://leetcode.com/problems/binary-search/",
      "difficulty": "E"
    },
    {
      "id": "prob-SearchingSorting-1",
      "title": "First Bad Version",
      "link": "https://leetcode.com/problems/first-bad-version/",
      "difficulty": "E"
    },
    {
      "id": "prob-SearchingSorting-2",
      "title": "Merge Sorted Array",
      "link": "https://leetcode.com/problems/merge-sorted-array/",
      "difficulty": "E"
    },
    {
      "id": "prob-SearchingSorting-3",
      "title": "Search in Rotated Sorted Array",
      "link": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      "difficulty": "M"
    },
    {
      "id": "prob-SearchingSorting-4",
      "title": "Find Minimum in Rotated Sorted Array",
      "link": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
      "difficulty": "M"
    },
    {
      "id": "prob-SearchingSorting-5",
      "title": "Find First and Last Position of Element in Sorted Array",
      "link": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
      "difficulty": "M"
    },
    {
      "id": "prob-SearchingSorting-6",
      "title": "Kth Largest Element in an Array",
      "link": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      "difficulty": "M"
    },
    {
      "id": "prob-SearchingSorting-7",
      "title": "Sort Colors",
      "link": "https://leetcode.com/problems/sort-colors/",
      "difficulty": "M"
    },
    {
      "id": "prob-SearchingSorting-8",
      "title": "Koko Eating Bananas",
      "link": "https://leetcode.com/problems/koko-eating-bananas/",
      "difficulty": "M"
    },
    {
      "id": "prob-SearchingSorting-9",
      "title": "Split Array Largest Sum",
      "link": "https://leetcode.com/problems/split-array-largest-sum/",
      "difficulty": "H"
    },
    {
      "id": "prob-SearchingSorting-10",
      "title": "Find K-th Smallest Pair Distance",
      "link": "https://leetcode.com/problems/find-k-th-smallest-pair-distance/",
      "difficulty": "H"
    }
  ],
  "Two Pointers & Sliding Window": [
    {
      "id": "prob-TwoPointersSlidingWindow-0",
      "title": "Two Sum II - Input Array Is Sorted",
      "link": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      "difficulty": "M"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-1",
      "title": "Remove Duplicates from Sorted Array",
      "link": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      "difficulty": "E"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-2",
      "title": "Maximum Average Subarray I",
      "link": "https://leetcode.com/problems/maximum-average-subarray-i/",
      "difficulty": "E"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-3",
      "title": "Container With Most Water",
      "link": "https://leetcode.com/problems/container-with-most-water/",
      "difficulty": "M"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-4",
      "title": "3Sum Closest",
      "link": "https://leetcode.com/problems/3sum-closest/",
      "difficulty": "M"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-5",
      "title": "Longest Repeating Character Replacement",
      "link": "https://leetcode.com/problems/longest-repeating-character-replacement/",
      "difficulty": "M"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-6",
      "title": "Permutation in String",
      "link": "https://leetcode.com/problems/permutation-in-string/",
      "difficulty": "M"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-7",
      "title": "Subarray Product Less Than K",
      "link": "https://leetcode.com/problems/subarray-product-less-than-k/",
      "difficulty": "M"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-8",
      "title": "Fruit Into Baskets",
      "link": "https://leetcode.com/problems/fruit-into-baskets/",
      "difficulty": "M"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-9",
      "title": "Sliding Window Maximum",
      "link": "https://leetcode.com/problems/sliding-window-maximum/",
      "difficulty": "H"
    },
    {
      "id": "prob-TwoPointersSlidingWindow-10",
      "title": "Substring with Concatenation of All Words",
      "link": "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
      "difficulty": "H"
    }
  ],
  "Linked List": [
    {
      "id": "prob-LinkedList-0",
      "title": "Reverse Linked List",
      "link": "https://leetcode.com/problems/reverse-linked-list/",
      "difficulty": "E"
    },
    {
      "id": "prob-LinkedList-1",
      "title": "Merge Two Sorted Lists",
      "link": "https://leetcode.com/problems/merge-two-sorted-lists/",
      "difficulty": "E"
    },
    {
      "id": "prob-LinkedList-2",
      "title": "Linked List Cycle",
      "link": "https://leetcode.com/problems/linked-list-cycle/",
      "difficulty": "E"
    },
    {
      "id": "prob-LinkedList-3",
      "title": "Palindrome Linked List",
      "link": "https://leetcode.com/problems/palindrome-linked-list/",
      "difficulty": "E"
    },
    {
      "id": "prob-LinkedList-4",
      "title": "Add Two Numbers",
      "link": "https://leetcode.com/problems/add-two-numbers/",
      "difficulty": "M"
    },
    {
      "id": "prob-LinkedList-5",
      "title": "Remove Nth Node From End of List",
      "link": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
      "difficulty": "M"
    },
    {
      "id": "prob-LinkedList-6",
      "title": "Reorder List",
      "link": "https://leetcode.com/problems/reorder-list/",
      "difficulty": "M"
    },
    {
      "id": "prob-LinkedList-7",
      "title": "Copy List with Random Pointer",
      "link": "https://leetcode.com/problems/copy-list-with-random-pointer/",
      "difficulty": "M"
    },
    {
      "id": "prob-LinkedList-8",
      "title": "Odd Even Linked List",
      "link": "https://leetcode.com/problems/odd-even-linked-list/",
      "difficulty": "M"
    },
    {
      "id": "prob-LinkedList-9",
      "title": "LRU Cache",
      "link": "https://leetcode.com/problems/lru-cache/",
      "difficulty": "M"
    },
    {
      "id": "prob-LinkedList-10",
      "title": "Merge k Sorted Lists",
      "link": "https://leetcode.com/problems/merge-k-sorted-lists/",
      "difficulty": "H"
    },
    {
      "id": "prob-LinkedList-11",
      "title": "Reverse Nodes in k-Group",
      "link": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
      "difficulty": "H"
    }
  ],
  "Stack & Queue": [
    {
      "id": "prob-StackQueue-0",
      "title": "Valid Parentheses",
      "link": "https://leetcode.com/problems/valid-parentheses/",
      "difficulty": "E"
    },
    {
      "id": "prob-StackQueue-1",
      "title": "Implement Queue using Stacks",
      "link": "https://leetcode.com/problems/implement-queue-using-stacks/",
      "difficulty": "E"
    },
    {
      "id": "prob-StackQueue-2",
      "title": "Min Stack",
      "link": "https://leetcode.com/problems/min-stack/",
      "difficulty": "M"
    },
    {
      "id": "prob-StackQueue-3",
      "title": "Evaluate Reverse Polish Notation",
      "link": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      "difficulty": "M"
    },
    {
      "id": "prob-StackQueue-4",
      "title": "Daily Temperatures",
      "link": "https://leetcode.com/problems/daily-temperatures/",
      "difficulty": "M"
    },
    {
      "id": "prob-StackQueue-5",
      "title": "Next Greater Element II",
      "link": "https://leetcode.com/problems/next-greater-element-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-StackQueue-6",
      "title": "Asteroid Collision",
      "link": "https://leetcode.com/problems/asteroid-collision/",
      "difficulty": "M"
    },
    {
      "id": "prob-StackQueue-7",
      "title": "Decode String",
      "link": "https://leetcode.com/problems/decode-string/",
      "difficulty": "M"
    },
    {
      "id": "prob-StackQueue-8",
      "title": "Basic Calculator II",
      "link": "https://leetcode.com/problems/basic-calculator-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-StackQueue-9",
      "title": "Largest Rectangle in Histogram",
      "link": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      "difficulty": "H"
    },
    {
      "id": "prob-StackQueue-10",
      "title": "Maximal Rectangle",
      "link": "https://leetcode.com/problems/maximal-rectangle/",
      "difficulty": "H"
    }
  ],
  "Hashing": [
    {
      "id": "prob-Hashing-0",
      "title": "Ransom Note",
      "link": "https://leetcode.com/problems/ransom-note/",
      "difficulty": "E"
    },
    {
      "id": "prob-Hashing-1",
      "title": "Contains Duplicate II",
      "link": "https://leetcode.com/problems/contains-duplicate-ii/",
      "difficulty": "E"
    },
    {
      "id": "prob-Hashing-2",
      "title": "Majority Element",
      "link": "https://leetcode.com/problems/majority-element/",
      "difficulty": "E"
    },
    {
      "id": "prob-Hashing-3",
      "title": "Top K Frequent Elements",
      "link": "https://leetcode.com/problems/top-k-frequent-elements/",
      "difficulty": "M"
    },
    {
      "id": "prob-Hashing-4",
      "title": "Longest Consecutive Sequence",
      "link": "https://leetcode.com/problems/longest-consecutive-sequence/",
      "difficulty": "M"
    },
    {
      "id": "prob-Hashing-5",
      "title": "Subarray Sum Equals K",
      "link": "https://leetcode.com/problems/subarray-sum-equals-k/",
      "difficulty": "M"
    },
    {
      "id": "prob-Hashing-6",
      "title": "4Sum",
      "link": "https://leetcode.com/problems/4sum/",
      "difficulty": "M"
    },
    {
      "id": "prob-Hashing-7",
      "title": "Insert Delete GetRandom O(1)",
      "link": "https://leetcode.com/problems/insert-delete-getrandom-o1/",
      "difficulty": "M"
    },
    {
      "id": "prob-Hashing-8",
      "title": "LFU Cache",
      "link": "https://leetcode.com/problems/lfu-cache/",
      "difficulty": "H"
    },
    {
      "id": "prob-Hashing-9",
      "title": "Longest Duplicate Substring",
      "link": "https://leetcode.com/problems/longest-duplicate-substring/",
      "difficulty": "H"
    }
  ],
  "Recursion & Backtracking": [
    {
      "id": "prob-RecursionBacktracking-0",
      "title": "Fibonacci Number",
      "link": "https://leetcode.com/problems/fibonacci-number/",
      "difficulty": "E"
    },
    {
      "id": "prob-RecursionBacktracking-1",
      "title": "Climbing Stairs",
      "link": "https://leetcode.com/problems/climbing-stairs/",
      "difficulty": "E"
    },
    {
      "id": "prob-RecursionBacktracking-2",
      "title": "Permutations",
      "link": "https://leetcode.com/problems/permutations/",
      "difficulty": "M"
    },
    {
      "id": "prob-RecursionBacktracking-3",
      "title": "Combination Sum",
      "link": "https://leetcode.com/problems/combination-sum/",
      "difficulty": "M"
    },
    {
      "id": "prob-RecursionBacktracking-4",
      "title": "Subsets II",
      "link": "https://leetcode.com/problems/subsets-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-RecursionBacktracking-5",
      "title": "Generate Parentheses",
      "link": "https://leetcode.com/problems/generate-parentheses/",
      "difficulty": "M"
    },
    {
      "id": "prob-RecursionBacktracking-6",
      "title": "Letter Combinations of a Phone Number",
      "link": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
      "difficulty": "M"
    },
    {
      "id": "prob-RecursionBacktracking-7",
      "title": "Palindrome Partitioning",
      "link": "https://leetcode.com/problems/palindrome-partitioning/",
      "difficulty": "M"
    },
    {
      "id": "prob-RecursionBacktracking-8",
      "title": "N-Queens",
      "link": "https://leetcode.com/problems/n-queens/",
      "difficulty": "H"
    },
    {
      "id": "prob-RecursionBacktracking-9",
      "title": "Sudoku Solver",
      "link": "https://leetcode.com/problems/sudoku-solver/",
      "difficulty": "H"
    },
    {
      "id": "prob-RecursionBacktracking-10",
      "title": "Word Search II",
      "link": "https://leetcode.com/problems/word-search-ii/",
      "difficulty": "H"
    }
  ],
  "Binary Trees": [
    {
      "id": "prob-BinaryTrees-0",
      "title": "Maximum Depth of Binary Tree",
      "link": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinaryTrees-1",
      "title": "Invert Binary Tree",
      "link": "https://leetcode.com/problems/invert-binary-tree/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinaryTrees-2",
      "title": "Same Tree",
      "link": "https://leetcode.com/problems/same-tree/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinaryTrees-3",
      "title": "Symmetric Tree",
      "link": "https://leetcode.com/problems/symmetric-tree/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinaryTrees-4",
      "title": "Diameter of Binary Tree",
      "link": "https://leetcode.com/problems/diameter-of-binary-tree/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinaryTrees-5",
      "title": "Binary Tree Level Order Traversal",
      "link": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinaryTrees-6",
      "title": "Construct Binary Tree from Preorder and Inorder Traversal",
      "link": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinaryTrees-7",
      "title": "Lowest Common Ancestor of a Binary Tree",
      "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinaryTrees-8",
      "title": "Binary Tree Right Side View",
      "link": "https://leetcode.com/problems/binary-tree-right-side-view/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinaryTrees-9",
      "title": "Binary Tree Maximum Path Sum",
      "link": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      "difficulty": "H"
    },
    {
      "id": "prob-BinaryTrees-10",
      "title": "Serialize and Deserialize Binary Tree",
      "link": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      "difficulty": "H"
    },
    {
      "id": "prob-BinaryTrees-11",
      "title": "Vertical Order Traversal of a Binary Tree",
      "link": "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/",
      "difficulty": "H"
    }
  ],
  "Binary Search Trees": [
    {
      "id": "prob-BinarySearchTrees-0",
      "title": "Search in a Binary Search Tree",
      "link": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinarySearchTrees-1",
      "title": "Minimum Absolute Difference in BST",
      "link": "https://leetcode.com/problems/minimum-absolute-difference-in-bst/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinarySearchTrees-2",
      "title": "Convert Sorted Array to Binary Search Tree",
      "link": "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/",
      "difficulty": "E"
    },
    {
      "id": "prob-BinarySearchTrees-3",
      "title": "Insert into a Binary Search Tree",
      "link": "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinarySearchTrees-4",
      "title": "Validate Binary Search Tree",
      "link": "https://leetcode.com/problems/validate-binary-search-tree/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinarySearchTrees-5",
      "title": "Kth Smallest Element in a BST",
      "link": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinarySearchTrees-6",
      "title": "Lowest Common Ancestor of a BST",
      "link": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinarySearchTrees-7",
      "title": "Delete Node in a BST",
      "link": "https://leetcode.com/problems/delete-node-in-a-bst/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinarySearchTrees-8",
      "title": "Recover Binary Search Tree",
      "link": "https://leetcode.com/problems/recover-binary-search-tree/",
      "difficulty": "M"
    },
    {
      "id": "prob-BinarySearchTrees-9",
      "title": "Balance a Binary Search Tree",
      "link": "https://leetcode.com/problems/balance-a-binary-search-tree/",
      "difficulty": "M"
    }
  ],
  "Heaps / Priority Queue": [
    {
      "id": "prob-HeapsPriorityQueue-0",
      "title": "Kth Largest Element in a Stream",
      "link": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      "difficulty": "E"
    },
    {
      "id": "prob-HeapsPriorityQueue-1",
      "title": "Last Stone Weight",
      "link": "https://leetcode.com/problems/last-stone-weight/",
      "difficulty": "E"
    },
    {
      "id": "prob-HeapsPriorityQueue-2",
      "title": "K Closest Points to Origin",
      "link": "https://leetcode.com/problems/k-closest-points-to-origin/",
      "difficulty": "M"
    },
    {
      "id": "prob-HeapsPriorityQueue-3",
      "title": "Task Scheduler",
      "link": "https://leetcode.com/problems/task-scheduler/",
      "difficulty": "M"
    },
    {
      "id": "prob-HeapsPriorityQueue-4",
      "title": "Top K Frequent Words",
      "link": "https://leetcode.com/problems/top-k-frequent-words/",
      "difficulty": "M"
    },
    {
      "id": "prob-HeapsPriorityQueue-5",
      "title": "Find K Pairs with Smallest Sums",
      "link": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
      "difficulty": "M"
    },
    {
      "id": "prob-HeapsPriorityQueue-6",
      "title": "IPO",
      "link": "https://leetcode.com/problems/ipo/",
      "difficulty": "H"
    },
    {
      "id": "prob-HeapsPriorityQueue-7",
      "title": "Find Median from Data Stream",
      "link": "https://leetcode.com/problems/find-median-from-data-stream/",
      "difficulty": "H"
    },
    {
      "id": "prob-HeapsPriorityQueue-8",
      "title": "Smallest Range Covering Elements from K Lists",
      "link": "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/",
      "difficulty": "H"
    },
    {
      "id": "prob-HeapsPriorityQueue-9",
      "title": "Sliding Window Median",
      "link": "https://leetcode.com/problems/sliding-window-median/",
      "difficulty": "H"
    }
  ],
  "Trie": [
    {
      "id": "prob-Trie-0",
      "title": "Implement Trie (Prefix Tree)",
      "link": "https://leetcode.com/problems/implement-trie-prefix-tree/",
      "difficulty": "M"
    },
    {
      "id": "prob-Trie-1",
      "title": "Design Add and Search Words Data Structure",
      "link": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
      "difficulty": "M"
    },
    {
      "id": "prob-Trie-2",
      "title": "Replace Words",
      "link": "https://leetcode.com/problems/replace-words/",
      "difficulty": "M"
    },
    {
      "id": "prob-Trie-3",
      "title": "Map Sum Pairs",
      "link": "https://leetcode.com/problems/map-sum-pairs/",
      "difficulty": "M"
    },
    {
      "id": "prob-Trie-4",
      "title": "Longest Word in Dictionary",
      "link": "https://leetcode.com/problems/longest-word-in-dictionary/",
      "difficulty": "M"
    },
    {
      "id": "prob-Trie-5",
      "title": "Palindrome Pairs",
      "link": "https://leetcode.com/problems/palindrome-pairs/",
      "difficulty": "H"
    },
    {
      "id": "prob-Trie-6",
      "title": "Stream of Characters",
      "link": "https://leetcode.com/problems/stream-of-characters/",
      "difficulty": "H"
    },
    {
      "id": "prob-Trie-7",
      "title": "Concatenated Words",
      "link": "https://leetcode.com/problems/concatenated-words/",
      "difficulty": "H"
    },
    {
      "id": "prob-Trie-8",
      "title": "Word Break II",
      "link": "https://leetcode.com/problems/word-break-ii/",
      "difficulty": "H"
    }
  ],
  "Graph Fundamentals (BFS / DFS)": [
    {
      "id": "prob-GraphFundamentalsBFSDFS-0",
      "title": "Find if Path Exists in Graph",
      "link": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
      "difficulty": "E"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-1",
      "title": "Flood Fill",
      "link": "https://leetcode.com/problems/flood-fill/",
      "difficulty": "E"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-2",
      "title": "Number of Islands",
      "link": "https://leetcode.com/problems/number-of-islands/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-3",
      "title": "Clone Graph",
      "link": "https://leetcode.com/problems/clone-graph/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-4",
      "title": "Course Schedule",
      "link": "https://leetcode.com/problems/course-schedule/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-5",
      "title": "Course Schedule II",
      "link": "https://leetcode.com/problems/course-schedule-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-6",
      "title": "Rotting Oranges",
      "link": "https://leetcode.com/problems/rotting-oranges/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-7",
      "title": "Pacific Atlantic Water Flow",
      "link": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-8",
      "title": "Number of Connected Components in an Undirected Graph",
      "link": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-9",
      "title": "Is Graph Bipartite?",
      "link": "https://leetcode.com/problems/is-graph-bipartite/",
      "difficulty": "M"
    },
    {
      "id": "prob-GraphFundamentalsBFSDFS-10",
      "title": "Word Ladder",
      "link": "https://leetcode.com/problems/word-ladder/",
      "difficulty": "H"
    }
  ],
  "Advanced Graphs (Shortest Path, MST, Union-Find)": [
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-0",
      "title": "Network Delay Time",
      "link": "https://leetcode.com/problems/network-delay-time/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-1",
      "title": "Cheapest Flights Within K Stops",
      "link": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-2",
      "title": "Number of Provinces",
      "link": "https://leetcode.com/problems/number-of-provinces/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-3",
      "title": "Redundant Connection",
      "link": "https://leetcode.com/problems/redundant-connection/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-4",
      "title": "Min Cost to Connect All Points",
      "link": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-5",
      "title": "Path with Maximum Probability",
      "link": "https://leetcode.com/problems/path-with-maximum-probability/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-6",
      "title": "Swim in Rising Water",
      "link": "https://leetcode.com/problems/swim-in-rising-water/",
      "difficulty": "H"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-7",
      "title": "Reconstruct Itinerary",
      "link": "https://leetcode.com/problems/reconstruct-itinerary/",
      "difficulty": "H"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-8",
      "title": "Bus Routes",
      "link": "https://leetcode.com/problems/bus-routes/",
      "difficulty": "H"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-9",
      "title": "Minimum Cost to Make at Least One Valid Path in a Grid",
      "link": "https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/",
      "difficulty": "H"
    },
    {
      "id": "prob-AdvancedGraphsShortestPathMSTUnionFind-10",
      "title": "Find Critical and Pseudo-Critical Edges in MST",
      "link": "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",
      "difficulty": "H"
    }
  ],
  "Greedy Algorithms": [
    {
      "id": "prob-GreedyAlgorithms-0",
      "title": "Assign Cookies",
      "link": "https://leetcode.com/problems/assign-cookies/",
      "difficulty": "E"
    },
    {
      "id": "prob-GreedyAlgorithms-1",
      "title": "Best Time to Buy and Sell Stock II",
      "link": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-2",
      "title": "Jump Game",
      "link": "https://leetcode.com/problems/jump-game/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-3",
      "title": "Jump Game II",
      "link": "https://leetcode.com/problems/jump-game-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-4",
      "title": "Gas Station",
      "link": "https://leetcode.com/problems/gas-station/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-5",
      "title": "Non-overlapping Intervals",
      "link": "https://leetcode.com/problems/non-overlapping-intervals/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-6",
      "title": "Merge Intervals",
      "link": "https://leetcode.com/problems/merge-intervals/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-7",
      "title": "Partition Labels",
      "link": "https://leetcode.com/problems/partition-labels/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-8",
      "title": "Insert Interval",
      "link": "https://leetcode.com/problems/insert-interval/",
      "difficulty": "M"
    },
    {
      "id": "prob-GreedyAlgorithms-9",
      "title": "Candy",
      "link": "https://leetcode.com/problems/candy/",
      "difficulty": "H"
    },
    {
      "id": "prob-GreedyAlgorithms-10",
      "title": "Minimum Number of Taps to Open to Water a Garden",
      "link": "https://leetcode.com/problems/minimum-number-of-taps-to-open-to-water-a-garden/",
      "difficulty": "H"
    }
  ],
  "DP Fundamentals (1D)": [
    {
      "id": "prob-DPFundamentals1D-0",
      "title": "Min Cost Climbing Stairs",
      "link": "https://leetcode.com/problems/min-cost-climbing-stairs/",
      "difficulty": "E"
    },
    {
      "id": "prob-DPFundamentals1D-1",
      "title": "House Robber",
      "link": "https://leetcode.com/problems/house-robber/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-2",
      "title": "House Robber II",
      "link": "https://leetcode.com/problems/house-robber-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-3",
      "title": "Decode Ways",
      "link": "https://leetcode.com/problems/decode-ways/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-4",
      "title": "Coin Change",
      "link": "https://leetcode.com/problems/coin-change/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-5",
      "title": "Maximum Product Subarray",
      "link": "https://leetcode.com/problems/maximum-product-subarray/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-6",
      "title": "Longest Increasing Subsequence",
      "link": "https://leetcode.com/problems/longest-increasing-subsequence/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-7",
      "title": "Word Break",
      "link": "https://leetcode.com/problems/word-break/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-8",
      "title": "Combination Sum IV",
      "link": "https://leetcode.com/problems/combination-sum-iv/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-9",
      "title": "Coin Change II",
      "link": "https://leetcode.com/problems/coin-change-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPFundamentals1D-10",
      "title": "Russian Doll Envelopes",
      "link": "https://leetcode.com/problems/russian-doll-envelopes/",
      "difficulty": "H"
    }
  ],
  "DP on Grids & Knapsack (2D)": [
    {
      "id": "prob-DPonGridsKnapsack2D-0",
      "title": "Unique Paths",
      "link": "https://leetcode.com/problems/unique-paths/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-1",
      "title": "Unique Paths II",
      "link": "https://leetcode.com/problems/unique-paths-ii/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-2",
      "title": "Minimum Path Sum",
      "link": "https://leetcode.com/problems/minimum-path-sum/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-3",
      "title": "Partition Equal Subset Sum",
      "link": "https://leetcode.com/problems/partition-equal-subset-sum/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-4",
      "title": "Target Sum",
      "link": "https://leetcode.com/problems/target-sum/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-5",
      "title": "Triangle",
      "link": "https://leetcode.com/problems/triangle/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-6",
      "title": "Ones and Zeroes",
      "link": "https://leetcode.com/problems/ones-and-zeroes/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-7",
      "title": "Maximal Square",
      "link": "https://leetcode.com/problems/maximal-square/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-8",
      "title": "Cherry Pickup",
      "link": "https://leetcode.com/problems/cherry-pickup/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonGridsKnapsack2D-9",
      "title": "Dungeon Game",
      "link": "https://leetcode.com/problems/dungeon-game/",
      "difficulty": "H"
    }
  ],
  "DP on Strings": [
    {
      "id": "prob-DPonStrings-0",
      "title": "Longest Common Subsequence",
      "link": "https://leetcode.com/problems/longest-common-subsequence/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonStrings-1",
      "title": "Edit Distance",
      "link": "https://leetcode.com/problems/edit-distance/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonStrings-2",
      "title": "Longest Palindromic Subsequence",
      "link": "https://leetcode.com/problems/longest-palindromic-subsequence/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonStrings-3",
      "title": "Palindromic Substrings",
      "link": "https://leetcode.com/problems/palindromic-substrings/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonStrings-4",
      "title": "Delete Operation for Two Strings",
      "link": "https://leetcode.com/problems/delete-operation-for-two-strings/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonStrings-5",
      "title": "Interleaving String",
      "link": "https://leetcode.com/problems/interleaving-string/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonStrings-6",
      "title": "Distinct Subsequences",
      "link": "https://leetcode.com/problems/distinct-subsequences/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonStrings-7",
      "title": "Wildcard Matching",
      "link": "https://leetcode.com/problems/wildcard-matching/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonStrings-8",
      "title": "Shortest Common Supersequence",
      "link": "https://leetcode.com/problems/shortest-common-supersequence/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonStrings-9",
      "title": "Scramble String",
      "link": "https://leetcode.com/problems/scramble-string/",
      "difficulty": "H"
    }
  ],
  "DP on Trees & Bitmask DP": [
    {
      "id": "prob-DPonTreesBitmaskDP-0",
      "title": "House Robber III",
      "link": "https://leetcode.com/problems/house-robber-iii/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-1",
      "title": "Partition to K Equal Sum Subsets",
      "link": "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
      "difficulty": "M"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-2",
      "title": "Binary Tree Cameras",
      "link": "https://leetcode.com/problems/binary-tree-cameras/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-3",
      "title": "Sum of Distances in Tree",
      "link": "https://leetcode.com/problems/sum-of-distances-in-tree/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-4",
      "title": "Shortest Path Visiting All Nodes",
      "link": "https://leetcode.com/problems/shortest-path-visiting-all-nodes/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-5",
      "title": "Minimum Cost to Connect Two Groups of Points",
      "link": "https://leetcode.com/problems/minimum-cost-to-connect-two-groups-of-points/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-6",
      "title": "Maximum Students Taking Exam",
      "link": "https://leetcode.com/problems/maximum-students-taking-exam/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-7",
      "title": "Stickers to Spell Word",
      "link": "https://leetcode.com/problems/stickers-to-spell-word/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-8",
      "title": "Number of Ways to Wear Different Hats to Each Other",
      "link": "https://leetcode.com/problems/number-of-ways-to-wear-different-hats-to-each-other/",
      "difficulty": "H"
    },
    {
      "id": "prob-DPonTreesBitmaskDP-9",
      "title": "Distribute Repeating Integers",
      "link": "https://leetcode.com/problems/distribute-repeating-integers/",
      "difficulty": "H"
    }
  ],
  "Segment Tree & Fenwick Tree (BIT)": [
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-0",
      "title": "Range Sum Query - Immutable",
      "link": "https://leetcode.com/problems/range-sum-query-immutable/",
      "difficulty": "E"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-1",
      "title": "Range Sum Query - Mutable",
      "link": "https://leetcode.com/problems/range-sum-query-mutable/",
      "difficulty": "M"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-2",
      "title": "Range Sum Query 2D - Mutable",
      "link": "https://leetcode.com/problems/range-sum-query-2d-mutable/",
      "difficulty": "M"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-3",
      "title": "Count of Smaller Numbers After Self",
      "link": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
      "difficulty": "H"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-4",
      "title": "Reverse Pairs",
      "link": "https://leetcode.com/problems/reverse-pairs/",
      "difficulty": "H"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-5",
      "title": "The Skyline Problem",
      "link": "https://leetcode.com/problems/the-skyline-problem/",
      "difficulty": "H"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-6",
      "title": "Count of Range Sum",
      "link": "https://leetcode.com/problems/count-of-range-sum/",
      "difficulty": "H"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-7",
      "title": "My Calendar III",
      "link": "https://leetcode.com/problems/my-calendar-iii/",
      "difficulty": "H"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-8",
      "title": "Falling Squares",
      "link": "https://leetcode.com/problems/falling-squares/",
      "difficulty": "H"
    },
    {
      "id": "prob-SegmentTreeFenwickTreeBIT-9",
      "title": "Segment Tree — build & query (reference)",
      "link": "https://www.geeksforgeeks.org/segment-tree-data-structure/",
      "difficulty": "R"
    }
  ],
  "Advanced Graph Algorithms (SCC, Bridges, Articulation Points)": [
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-0",
      "title": "Find the Town Judge",
      "link": "https://leetcode.com/problems/find-the-town-judge/",
      "difficulty": "E"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-1",
      "title": "Evaluate Division",
      "link": "https://leetcode.com/problems/evaluate-division/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-2",
      "title": "Accounts Merge",
      "link": "https://leetcode.com/problems/accounts-merge/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-3",
      "title": "Satisfiability of Equality Equations",
      "link": "https://leetcode.com/problems/satisfiability-of-equality-equations/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-4",
      "title": "Number of Operations to Make Network Connected",
      "link": "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-5",
      "title": "Minimum Spanning Tree (practice)",
      "link": "https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1",
      "difficulty": "M"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-6",
      "title": "Critical Connections in a Network (bridges)",
      "link": "https://leetcode.com/problems/critical-connections-in-a-network/",
      "difficulty": "H"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-7",
      "title": "Articulation Point (practice)",
      "link": "https://www.geeksforgeeks.org/problems/articulation-point-1/1",
      "difficulty": "H"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-8",
      "title": "Bridge Edge in Graph (practice)",
      "link": "https://www.geeksforgeeks.org/problems/bridge-edge-in-graph/1",
      "difficulty": "H"
    },
    {
      "id": "prob-AdvancedGraphAlgorithmsSCCBridgesArticulationPoints-9",
      "title": "Strongly Connected Components — Kosaraju's Algorithm (practice)",
      "link": "https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1",
      "difficulty": "H"
    }
  ],
  "String Pattern Matching (KMP, Z, Rabin-Karp, Manacher)": [
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-0",
      "title": "Find the Index of the First Occurrence in a String",
      "link": "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
      "difficulty": "E"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-1",
      "title": "Repeated Substring Pattern",
      "link": "https://leetcode.com/problems/repeated-substring-pattern/",
      "difficulty": "E"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-2",
      "title": "Repeated String Match",
      "link": "https://leetcode.com/problems/repeated-string-match/",
      "difficulty": "M"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-3",
      "title": "Find All Anagrams in a String",
      "link": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
      "difficulty": "M"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-4",
      "title": "Z-function (reference)",
      "link": "https://cp-algorithms.com/string/z-function.html",
      "difficulty": "R"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-5",
      "title": "Manacher's Algorithm (reference)",
      "link": "https://www.geeksforgeeks.org/manachers-algorithm-linear-time-longest-palindromic-substring-part-1/",
      "difficulty": "R"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-6",
      "title": "Search Pattern — KMP Algorithm (practice)",
      "link": "https://www.geeksforgeeks.org/problems/search-pattern0205/1",
      "difficulty": "H"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-7",
      "title": "Shortest Palindrome",
      "link": "https://leetcode.com/problems/shortest-palindrome/",
      "difficulty": "H"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-8",
      "title": "Longest Happy Prefix",
      "link": "https://leetcode.com/problems/longest-happy-prefix/",
      "difficulty": "H"
    },
    {
      "id": "prob-StringPatternMatchingKMPZRabinKarpManacher-9",
      "title": "Distinct Echo Substrings",
      "link": "https://leetcode.com/problems/distinct-echo-substrings/",
      "difficulty": "H"
    }
  ],
  "Number Theory, Combinatorics & Digit DP": [
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-0",
      "title": "Greatest Common Divisor of Strings",
      "link": "https://leetcode.com/problems/greatest-common-divisor-of-strings/",
      "difficulty": "E"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-1",
      "title": "Power of Three",
      "link": "https://leetcode.com/problems/power-of-three/",
      "difficulty": "E"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-2",
      "title": "Nth Digit",
      "link": "https://leetcode.com/problems/nth-digit/",
      "difficulty": "M"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-3",
      "title": "Different Ways to Add Parentheses",
      "link": "https://leetcode.com/problems/different-ways-to-add-parentheses/",
      "difficulty": "M"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-4",
      "title": "Count Numbers with Unique Digits",
      "link": "https://leetcode.com/problems/count-numbers-with-unique-digits/",
      "difficulty": "M"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-5",
      "title": "Permutation Sequence",
      "link": "https://leetcode.com/problems/permutation-sequence/",
      "difficulty": "H"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-6",
      "title": "Numbers With Repeated Digits",
      "link": "https://leetcode.com/problems/numbers-with-repeated-digits/",
      "difficulty": "H"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-7",
      "title": "Numbers At Most N Given Digit Set",
      "link": "https://leetcode.com/problems/numbers-at-most-n-given-digit-set/",
      "difficulty": "H"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-8",
      "title": "K-th Smallest in Lexicographical Order",
      "link": "https://leetcode.com/problems/k-th-smallest-in-lexicographical-order/",
      "difficulty": "H"
    },
    {
      "id": "prob-NumberTheoryCombinatoricsDigitDP-9",
      "title": "Super Egg Drop",
      "link": "https://leetcode.com/problems/super-egg-drop/",
      "difficulty": "H"
    }
  ]
};
