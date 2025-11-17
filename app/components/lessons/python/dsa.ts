import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Data Structures & Algorithms in Python",
  description:
    "Master essential data structures and algorithms using Python. Learn arrays, linked lists, stacks, queues, trees, sorting, and searching algorithms.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Data Structures and Algorithms are the foundation of computer science and essential for writing efficient code. In this lesson, you'll learn the most important data structures and algorithms using Python.</p>

    <h2>Arrays and Lists</h2>
    
    <p>Python's <code>list</code> is a dynamic array that can grow or shrink as needed. Under the hood, Python lists are implemented as dynamic arrays that automatically resize when they run out of space.</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Lists Work Internally</h4>
      <p class="text-sm text-blue-800 mb-2">
        Python lists store references to objects in contiguous memory. When you append and the list runs out of space, Python:
      </p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>1. Allocates a new, larger block of memory (typically ~12.5% larger)</li>
        <li>2. Copies all existing references to the new location</li>
        <li>3. Frees the old memory block</li>
        <li>4. This is why append is O(1) <em>amortized</em> - occasionally O(n), but mostly O(1)</li>
      </ul>
    </div>
    
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">⏱️ Time & Space Complexity</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Operation</th>
            <th class="text-left py-2">Time</th>
            <th class="text-left py-2">Space</th>
            <th class="text-left py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Access by index</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Direct memory access</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Append to end</td>
            <td class="py-2 text-green-600 font-semibold">O(1)*</td>
            <td class="py-2">O(1)*</td>
            <td class="py-2">Amortized - occasionally O(n) when resizing</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Insert at position</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Must shift all elements after index</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Delete by index</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Must shift elements to fill gap</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Search by value</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Must check each element</td>
          </tr>
          <tr>
            <td class="py-2">Slice [a:b]</td>
            <td class="py-2 text-orange-600 font-semibold">O(k)</td>
            <td class="py-2">O(k)</td>
            <td class="py-2">k = slice length, creates new list</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre class="code-block">
      <code>
# List operations and time complexity
numbers = [1, 2, 3, 4, 5]</code>

# Access by index - O(1)
first = numbers[0]

# Append to end - O(1)
numbers.append(6)

# Insert at position - O(n)
numbers.insert(0, 0)

# Remove by value - O(n)
numbers.remove(3)

# List comprehension - Pythonic way
squares = [x**2 for x in range(10)]

# Two pointers technique
def two_sum(nums, target):
    """Find two numbers that add up to target"""
    left, right = 0, len(nums) - 1
    nums.sort()  # O(n log n)
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [nums[left], nums[right]]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return None
      </code>
    </pre>

    <h2>Linked Lists</h2>
    
    <p>A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a reference (link) to the next node. Unlike arrays, linked list elements are not stored in contiguous memory.</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Linked Lists Work</h4>
      <p class="text-sm text-blue-800 mb-2">
        Each node is a separate object in memory containing:
      </p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>Data:</strong> The actual value stored</li>
        <li>• <strong>Next pointer:</strong> Reference to the next node (or None for the last node)</li>
        <li>• The <code>head</code> pointer tracks the first node</li>
        <li>• No indexing - must traverse from head to reach any element</li>
      </ul>
      <p class="text-sm text-blue-800 mt-2">
        <strong>Memory advantage:</strong> No need to allocate large contiguous blocks. <strong>Trade-off:</strong> Extra memory for pointers, slower access.
      </p>
    </div>
    
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">⏱️ Time & Space Complexity</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Operation</th>
            <th class="text-left py-2">Time</th>
            <th class="text-left py-2">Space</th>
            <th class="text-left py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Prepend (add to front)</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Just update head pointer</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Append (add to end)</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Must traverse to find last node</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Delete by value</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Must find node (O(n)), then delete (O(1))</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Search</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Must traverse from head</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Reverse</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">One pass through list</td>
          </tr>
          <tr>
            <td class="py-2">Space per node</td>
            <td class="py-2">-</td>
            <td class="py-2">O(1)</td>
            <td class="py-2">Data + 1 pointer (vs array overhead)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre class="code-block">
      <code>
class Node:</code>
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        """Add node to end - O(n)"""
        new_node = Node(data)
        
        if not self.head:
            self.head = new_node
            return
        
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def prepend(self, data):
        """Add node to beginning - O(1)"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, data):
        """Delete first occurrence - O(n)"""
        if not self.head:
            return
        
        if self.head.data == data:
            self.head = self.head.next
            return
        
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next
    
    def reverse(self):
        """Reverse linked list - O(n)"""
        prev = None
        current = self.head
        
        while current:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        self.head = prev
    
    def display(self):
        """Print all elements"""
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        return " -> ".join(elements)
      </code>
    </pre>

    <h2>Stacks and Queues</h2>
    
    <p>Stacks follow Last-In-First-Out (LIFO) principle, while Queues follow First-In-First-Out (FIFO). Both can be implemented using lists or specialized data structures.</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Stacks & Queues Work</h4>
      <p class="text-sm text-blue-800 mb-2"><strong>Stack (LIFO):</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4 mb-3">
        <li>• Like a stack of plates - last plate added is first removed</li>
        <li>• Python list works great: <code>append()</code> to push, <code>pop()</code> to pop</li>
        <li>• Use cases: function call stack, undo/redo, expression parsing</li>
      </ul>
      <p class="text-sm text-blue-800 mb-2"><strong>Queue (FIFO):</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• Like a line at a store - first person in line is first served</li>
        <li>• Use <code>collections.deque</code> for efficient O(1) operations on both ends</li>
        <li>• List is inefficient: <code>pop(0)</code> is O(n) due to shifting</li>
        <li>• Use cases: BFS traversal, task scheduling, buffering</li>
      </ul>
    </div>
    
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">⏱️ Time & Space Complexity</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Operation</th>
            <th class="text-left py-2">Stack (list)</th>
            <th class="text-left py-2">Queue (deque)</th>
            <th class="text-left py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Push/Enqueue</td>
            <td class="py-2 text-green-600 font-semibold">O(1)*</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2">Amortized for list</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Pop/Dequeue</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2">Both efficient</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Peek (top/front)</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2">Just read, don't remove</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Is empty</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2">Check length/size</td>
          </tr>
          <tr>
            <td class="py-2">Space</td>
            <td class="py-2">O(n)</td>
            <td class="py-2">O(n)</td>
            <td class="py-2">n = number of elements</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre class="code-block">
      <code>
# Stack using list</code>
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)  # O(1)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()  # O(1)
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Queue using collections.deque (efficient)
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)  # O(1)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()  # O(1)
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# Practical example: Balanced parentheses
def is_balanced(expression):
    """Check if parentheses are balanced"""
    stack = Stack()
    opening = "({["
    closing = ")}]"
    matches = {"(": ")", "{": "}", "[": "]"}
    
    for char in expression:
        if char in opening:
            stack.push(char)
        elif char in closing:
            if stack.is_empty():
                return False
            if matches[stack.pop()] != char:
                return False
    
    return stack.is_empty()
      </code>
    </pre>

    <h2>Hash Tables (Dictionaries)</h2>
    
    <p>Python's <code>dict</code> is a hash table implementation that provides average O(1) time complexity for insertions, deletions, and lookups.</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Hash Tables Work</h4>
      <p class="text-sm text-blue-800 mb-2">
        Hash tables use a <strong>hash function</strong> to compute an index from the key:
      </p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>1. <strong>Hash the key:</strong> <code>hash('apple')</code> → large integer</li>
        <li>2. <strong>Map to bucket:</strong> <code>hash % array_size</code> → index (0 to size-1)</li>
        <li>3. <strong>Store key-value:</strong> Place in that bucket</li>
        <li>4. <strong>Collision handling:</strong> If two keys hash to same index, use chaining (linked list) or open addressing</li>
      </ul>
      <p class="text-sm text-blue-800 mt-2">
        <strong>Why O(1)?</strong> Computing hash + array access are constant time. <strong>Caveat:</strong> Worst case O(n) if all keys collide (rare with good hash function).
      </p>
    </div>
    
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">⏱️ Time & Space Complexity</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Operation</th>
            <th class="text-left py-2">Average</th>
            <th class="text-left py-2">Worst Case</th>
            <th class="text-left py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Insert/Update</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2 text-red-600">O(n)</td>
            <td class="py-2">Worst case with many collisions</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Delete</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2 text-red-600">O(n)</td>
            <td class="py-2">Same as insert</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Lookup/Get</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2 text-red-600">O(n)</td>
            <td class="py-2">Hash + array access</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Contains key</td>
            <td class="py-2 text-green-600 font-semibold">O(1)</td>
            <td class="py-2 text-red-600">O(n)</td>
            <td class="py-2">Same as lookup</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Iteration</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2">Must visit all n keys</td>
          </tr>
          <tr>
            <td class="py-2">Space</td>
            <td class="py-2">O(n)</td>
            <td class="py-2">O(n)</td>
            <td class="py-2">Load factor typically ~0.66, resizes dynamically</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre class="code-block">
      <code>
# Dictionary operations</code>
hash_table = {}

# Insert/Update - O(1)
hash_table['key'] = 'value'

# Lookup - O(1)
value = hash_table.get('key')

# Delete - O(1)
del hash_table['key']

# Check existence - O(1)
if 'key' in hash_table:
    print("Found!")

# Common use case: Counting occurrences
def count_frequency(arr):
    """Count frequency of elements"""
    freq = {}
    for item in arr:
        freq[item] = freq.get(item, 0) + 1
    return freq

# Or using Counter from collections
from collections import Counter
freq = Counter([1, 2, 2, 3, 3, 3])

# Find first non-repeating character
def first_unique_char(s):
    """Find first character that appears only once"""
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    
    for char in s:
        if freq[char] == 1:
            return char
    return None
      </code>
    </pre>

    <h2>Binary Trees</h2>
    
    <p>A binary tree is a hierarchical data structure where each node has at most two children (left and right). Trees are fundamental for representing hierarchical relationships and enable efficient searching, sorting, and organization of data.</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Binary Trees Work</h4>
      <p class="text-sm text-blue-800 mb-2"><strong>Structure:</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4 mb-3">
        <li>• <strong>Root:</strong> The topmost node (no parent)</li>
        <li>• <strong>Internal nodes:</strong> Have at least one child</li>
        <li>• <strong>Leaf nodes:</strong> Have no children (left = right = None)</li>
        <li>• <strong>Height:</strong> Longest path from root to leaf</li>
        <li>• <strong>Depth:</strong> Distance from root to a node</li>
      </ul>
      <p class="text-sm text-blue-800 mb-2"><strong>Tree Traversals:</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>Inorder (Left-Root-Right):</strong> For BST, gives sorted order</li>
        <li>• <strong>Preorder (Root-Left-Right):</strong> Good for copying tree structure</li>
        <li>• <strong>Postorder (Left-Right-Root):</strong> Good for deleting tree</li>
        <li>• <strong>Level-order (BFS):</strong> Visit nodes level by level using queue</li>
      </ul>
    </div>
    
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">⏱️ Time & Space Complexity</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Operation</th>
            <th class="text-left py-2">General Tree</th>
            <th class="text-left py-2">Balanced (BST)</th>
            <th class="text-left py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Search</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2 text-green-600 font-semibold">O(log n)</td>
            <td class="py-2">Binary search in balanced BST</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Insert</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2 text-green-600 font-semibold">O(log n)</td>
            <td class="py-2">Find position + insert</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Delete</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2 text-green-600 font-semibold">O(log n)</td>
            <td class="py-2">Find + remove + restructure</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Traversal (any)</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2">Must visit every node</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Height/Depth</td>
            <td class="py-2 text-orange-600 font-semibold">O(n)</td>
            <td class="py-2 text-green-600 font-semibold">O(log n)</td>
            <td class="py-2">Worst case: skewed tree = O(n)</td>
          </tr>
          <tr>
            <td class="py-2">Space (recursion)</td>
            <td class="py-2">O(h)</td>
            <td class="py-2">O(log n)</td>
            <td class="py-2">h = height, call stack depth</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre class="code-block">
      <code>
class TreeNode:</code>
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
    
    # Tree Traversals
    def inorder(self, node, result=None):
        """Left -> Root -> Right - O(n)"""
        if result is None:
            result = []
        if node:
            self.inorder(node.left, result)
            result.append(node.val)
            self.inorder(node.right, result)
        return result
    
    def preorder(self, node, result=None):
        """Root -> Left -> Right - O(n)"""
        if result is None:
            result = []
        if node:
            result.append(node.val)
            self.preorder(node.left, result)
            self.preorder(node.right, result)
        return result
    
    def postorder(self, node, result=None):
        """Left -> Right -> Root - O(n)"""
        if result is None:
            result = []
        if node:
            self.postorder(node.left, result)
            self.postorder(node.right, result)
            result.append(node.val)
        return result
    
    def level_order(self, root):
        """Breadth-first traversal - O(n)"""
        if not root:
            return []
        
        result = []
        queue = deque([root])
        
        while queue:
            level_size = len(queue)
            level = []
            
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(level)
        return result
    
    def max_depth(self, node):
        """Find maximum depth - O(n)"""
        if not node:
            return 0
        return 1 + max(self.max_depth(node.left), 
                      self.max_depth(node.right))
      </code>
    </pre>

    <h2>Sorting Algorithms</h2>
    
    <p>Understanding sorting algorithms helps you choose the right approach for different data sizes and characteristics. Each algorithm has trade-offs between time complexity, space usage, and stability.</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Sorting Algorithms Work</h4>
      <p class="text-sm text-blue-800 mb-2"><strong>Bubble Sort:</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4 mb-3">
        <li>• Repeatedly swaps adjacent elements if they're in wrong order</li>
        <li>• Each pass "bubbles" the largest element to the end</li>
        <li>• Simple but slow - use only for tiny datasets or teaching</li>
      </ul>
      <p class="text-sm text-blue-800 mb-2"><strong>Quick Sort:</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4 mb-3">
        <li>• Pick a pivot, partition array into smaller/larger elements</li>
        <li>• Recursively sort partitions</li>
        <li>• Fast on average, but O(n²) worst case (already sorted with bad pivot)</li>
        <li>• In-place (O(1) space except recursion stack)</li>
      </ul>
      <p class="text-sm text-blue-800 mb-2"><strong>Merge Sort:</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• Divide array in half recursively until single elements</li>
        <li>• Merge sorted halves back together</li>
        <li>• Guaranteed O(n log n) - stable and predictable</li>
        <li>• Requires O(n) extra space for merging</li>
      </ul>
    </div>
    
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">⏱️ Sorting Algorithms Complexity Comparison</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Algorithm</th>
            <th class="text-left py-2">Best</th>
            <th class="text-left py-2">Average</th>
            <th class="text-left py-2">Worst</th>
            <th class="text-left py-2">Space</th>
            <th class="text-left py-2">Stable?</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Bubble Sort</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2 text-red-600">O(n²)</td>
            <td class="py-2 text-red-600">O(n²)</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2">✓</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Quick Sort</td>
            <td class="py-2 text-green-600">O(n log n)</td>
            <td class="py-2 text-green-600">O(n log n)</td>
            <td class="py-2 text-red-600">O(n²)</td>
            <td class="py-2 text-green-600">O(log n)</td>
            <td class="py-2">✗</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Merge Sort</td>
            <td class="py-2 text-green-600">O(n log n)</td>
            <td class="py-2 text-green-600">O(n log n)</td>
            <td class="py-2 text-green-600">O(n log n)</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2">✓</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Python sorted()</td>
            <td class="py-2 text-green-600">O(n)</td>
            <td class="py-2 text-green-600">O(n log n)</td>
            <td class="py-2 text-green-600">O(n log n)</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2">✓</td>
          </tr>
        </tbody>
      </table>
      <p class="text-xs text-gray-600 mt-2">Note: Python uses Timsort (hybrid of merge + insertion sort) - best for real-world data</p>
    </div>

    <pre class="code-block">
      <code>
# Bubble Sort - O(n²)</code>
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

# Quick Sort - O(n log n) average
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Merge Sort - O(n log n) always
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Python's built-in sort - Timsort O(n log n)
arr = [64, 34, 25, 12, 22, 11, 90]
arr.sort()  # In-place
sorted_arr = sorted(arr)  # Returns new list
      </code>
    </pre>

    <h2>Searching Algorithms</h2>
    
    <p>Searching efficiently is crucial for performance. The choice between linear and binary search depends on whether your data is sorted.</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Searching Algorithms Work</h4>
      <p class="text-sm text-blue-800 mb-2"><strong>Linear Search:</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4 mb-3">
        <li>• Check each element one by one from start to end</li>
        <li>• Works on unsorted data</li>
        <li>• Simple but slow for large datasets</li>
        <li>• Best case: element is first (O(1)), Worst: element is last or missing (O(n))</li>
      </ul>
      <p class="text-sm text-blue-800 mb-2"><strong>Binary Search:</strong></p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>Requires sorted array</strong> - this is critical!</li>
        <li>• Compare middle element: if target is smaller, search left half; if larger, search right half</li>
        <li>• Eliminates half the remaining elements each step</li>
        <li>• Example: In 1M elements, finds target in max 20 steps (log₂(1,000,000) ≈ 20)</li>
        <li>• Can be implemented iteratively or recursively</li>
      </ul>
    </div>
    
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">⏱️ Searching Algorithms Complexity</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Algorithm</th>
            <th class="text-left py-2">Time (Best)</th>
            <th class="text-left py-2">Time (Avg)</th>
            <th class="text-left py-2">Time (Worst)</th>
            <th class="text-left py-2">Space</th>
            <th class="text-left py-2">Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Linear Search</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2">None</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Binary Search (iterative)</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2 text-green-600">O(log n)</td>
            <td class="py-2 text-green-600">O(log n)</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2">Sorted array</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Binary Search (recursive)</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2 text-green-600">O(log n)</td>
            <td class="py-2 text-green-600">O(log n)</td>
            <td class="py-2 text-orange-600">O(log n)</td>
            <td class="py-2">Sorted array</td>
          </tr>
          <tr>
            <td class="py-2">Hash Table Lookup</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2 text-green-600">O(1)</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2 text-orange-600">O(n)</td>
            <td class="py-2">Hash function</td>
          </tr>
        </tbody>
      </table>
      <p class="text-xs text-gray-600 mt-2">Pro tip: If searching repeatedly, sort once O(n log n) then use binary search O(log n) each time</p>
    </div>

    <pre class="code-block">
      <code>
# Linear Search - O(n)</code>
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Binary Search - O(log n) - requires sorted array
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Binary Search (Recursive)
def binary_search_recursive(arr, target, left, right):
    if left > right:
        return -1
    
    mid = (left + right) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# Find first and last position in sorted array
def search_range(arr, target):
    def find_first():
        left, right = 0, len(arr) - 1
        result = -1
        while left <= right:
            mid = (left + right) // 2
            if arr[mid] == target:
                result = mid
                right = mid - 1  # Continue searching left
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result
    
    def find_last():
        left, right = 0, len(arr) - 1
        result = -1
        while left <= right:
            mid = (left + right) // 2
            if arr[mid] == target:
                result = mid
                left = mid + 1  # Continue searching right
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return result
    
    return [find_first(), find_last()]
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">📊 Time Complexity Cheat Sheet</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>O(1):</strong> Constant - Hash table lookup, array access</li>
        <li><strong>O(log n):</strong> Logarithmic - Binary search, balanced tree operations</li>
        <li><strong>O(n):</strong> Linear - Array traversal, linear search</li>
        <li><strong>O(n log n):</strong> Linearithmic - Efficient sorting (merge sort, quick sort)</li>
        <li><strong>O(n²):</strong> Quadratic - Nested loops, bubble sort</li>
        <li><strong>O(2ⁿ):</strong> Exponential - Recursive algorithms without memoization</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Practice Challenge</h4>
      <p class="text-sm text-green-800">
        Implement a function to find the kth largest element in an unsorted array.
        Try solving it using both sorting and heap-based approaches, and compare their time complexities.
      </p>
    </div>
  </div>`,
  objectives: [
    "Understand fundamental data structures: arrays, linked lists, stacks, queues, trees",
    "Master hash tables and their applications",
    "Implement common sorting algorithms and understand their time complexity",
    "Learn binary search and its variations",
    "Analyze time and space complexity of algorithms",
  ],
  practiceInstructions: [
    "Implement a function to reverse a linked list",
    "Create a stack-based solution for validating balanced parentheses",
    "Write a binary search function for a sorted array",
    "Implement merge sort algorithm",
    "Solve the two-sum problem using hash tables",
  ],
  hints: [
    "Always consider time and space complexity when choosing a data structure",
    "Hash tables provide O(1) lookup but use more memory",
    "Recursion is elegant but watch out for stack overflow",
    "Two-pointers technique is useful for many array problems",
    "Practice drawing diagrams for tree and linked list problems",
  ],
  solution: `# Comprehensive DSA Solutions

# 1. Reverse Linked List
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def reverse_linked_list(head):
    prev = None
    current = head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev

# 2. Balanced Parentheses
def is_balanced(s):
    stack = []
    pairs = {'(': ')', '{': '}', '[': ']'}
    for char in s:
        if char in pairs:
            stack.append(char)
        elif char in pairs.values():
            if not stack or pairs[stack.pop()] != char:
                return False
    return len(stack) == 0

# 3. Binary Search
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# 4. Merge Sort
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# 5. Two Sum
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return None

print("All DSA solutions implemented!")`,
};
