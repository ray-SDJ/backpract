import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Data Structures & Algorithms in Java",
  description:
    "Master essential data structures and algorithms using Java. Learn ArrayList, LinkedList, Stack, Queue, HashMap, TreeMap, sorting, and searching algorithms with Java Collections Framework.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Data Structures and Algorithms are fundamental to Java development. This lesson covers essential DSA concepts using Java's built-in Collections Framework and custom implementations.</p>

    <h2>Arrays and ArrayList</h2>
    
    <p>Java provides both primitive arrays and the dynamic ArrayList class for storing collections of elements.</p>

    <pre class="code-block">
      <code>
import java.util.*;

public class ArrayExamples {
    public static void main(String[] args) {
        // Primitive array - fixed size
        int[] numbers = {1, 2, 3, 4, 5};
        
        // Access by index - O(1)
        int first = numbers[0];
        
        // ArrayList - dynamic size
        ArrayList&lt;Integer&gt; list = new ArrayList&lt;&gt;();
        
        // Add to end - O(1) amortized
        list.add(10);
        list.add(20);
        list.add(30);
        
        // Insert at position - O(n)
        list.add(0, 5);
        
        // Remove by index - O(n)
        list.remove(0);
        
        // Remove by value - O(n)
        list.remove(Integer.valueOf(20));
        
        // Get element - O(1)
        int value = list.get(0);
        
        // Check if contains - O(n)
        boolean exists = list.contains(30);
        
        // Size
        int size = list.size();
    }
    
    // Two Pointers Technique
    public static int[] twoSum(int[] nums, int target) {
        Arrays.sort(nums); // O(n log n)
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) {
                return new int[]{nums[left], nums[right]};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{};
    }
}
      </code>
    </pre>

    <h2>LinkedList Implementation</h2>
    
    <p>LinkedLists store elements in nodes, where each node points to the next element.</p>

    <pre class="code-block">
      <code>
class Node {
    int data;
    Node next;
    
    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    private Node head;
    
    // Add to end - O(n)
    public void append(int data) {
        Node newNode = new Node(data);
        
        if (head == null) {
            head = newNode;
            return;
        }
        
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
    
    // Add to beginning - O(1)
    public void prepend(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }
    
    // Delete first occurrence - O(n)
    public void delete(int data) {
        if (head == null) return;
        
        if (head.data == data) {
            head = head.next;
            return;
        }
        
        Node current = head;
        while (current.next != null) {
            if (current.next.data == data) {
                current.next = current.next.next;
                return;
            }
            current = current.next;
        }
    }
    
    // Reverse linked list - O(n)
    public void reverse() {
        Node prev = null;
        Node current = head;
        Node next = null;
        
        while (current != null) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        head = prev;
    }
    
    // Find middle element - O(n)
    public Node findMiddle() {
        if (head == null) return null;
        
        Node slow = head;
        Node fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
    
    // Display list
    public void display() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}
      </code>
    </pre>

    <h2>Stack and Queue</h2>
    
    <p>Java provides Stack class and Queue interface implementations like LinkedList and ArrayDeque.</p>

    <pre class="code-block">
      <code>
import java.util.*;

public class StackQueueExamples {
    // Stack using Java's built-in Stack class
    public static void stackExample() {
        Stack&lt;Integer&gt; stack = new Stack&lt;&gt;();
        
        // Push - O(1)
        stack.push(10);
        stack.push(20);
        stack.push(30);
        
        // Peek - O(1)
        int top = stack.peek();
        
        // Pop - O(1)
        int popped = stack.pop();
        
        // Check if empty
        boolean isEmpty = stack.isEmpty();
        
        // Size
        int size = stack.size();
    }
    
    // Queue using LinkedList
    public static void queueExample() {
        Queue&lt;Integer&gt; queue = new LinkedList&lt;&gt;();
        
        // Enqueue - O(1)
        queue.offer(10);
        queue.offer(20);
        queue.offer(30);
        
        // Peek - O(1)
        int front = queue.peek();
        
        // Dequeue - O(1)
        int removed = queue.poll();
        
        // Check if empty
        boolean isEmpty = queue.isEmpty();
    }
    
    // Balanced Parentheses Check
    public static boolean isBalanced(String expression) {
        Stack&lt;Character&gt; stack = new Stack&lt;&gt;();
        Map&lt;Character, Character&gt; pairs = new HashMap&lt;&gt;();
        pairs.put('(', ')');
        pairs.put('{', '}');
        pairs.put('[', ']');
        
        for (char ch : expression.toCharArray()) {
            if (pairs.containsKey(ch)) {
                stack.push(ch);
            } else if (pairs.containsValue(ch)) {
                if (stack.isEmpty() || pairs.get(stack.pop()) != ch) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
    
    // Priority Queue example
    public static void priorityQueueExample() {
        PriorityQueue&lt;Integer&gt; minHeap = new PriorityQueue&lt;&gt;();
        PriorityQueue&lt;Integer&gt; maxHeap = new PriorityQueue&lt;&gt;(
            Collections.reverseOrder()
        );
        
        minHeap.offer(5);
        minHeap.offer(2);
        minHeap.offer(8);
        
        int min = minHeap.poll(); // Returns 2
    }
}
      </code>
    </pre>

    <h2>HashMap and HashSet</h2>
    
    <p>Java's HashMap provides O(1) average-case lookups and is essential for many algorithms.</p>

    <pre class="code-block">
      <code>
import java.util.*;

public class HashMapExamples {
    // Basic HashMap operations
    public static void hashMapBasics() {
        HashMap&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
        
        // Put - O(1)
        map.put("apple", 5);
        map.put("banana", 3);
        map.put("orange", 7);
        
        // Get - O(1)
        int value = map.get("apple");
        
        // Get with default
        int count = map.getOrDefault("grape", 0);
        
        // Contains key - O(1)
        boolean hasApple = map.containsKey("apple");
        
        // Remove - O(1)
        map.remove("banana");
        
        // Iterate
        for (Map.Entry&lt;String, Integer&gt; entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
    
    // Count frequency of elements
    public static Map&lt;Integer, Integer&gt; countFrequency(int[] arr) {
        Map&lt;Integer, Integer&gt; freq = new HashMap&lt;&gt;();
        for (int num : arr) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }
        return freq;
    }
    
    // Two Sum using HashMap - O(n)
    public static int[] twoSum(int[] nums, int target) {
        Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
    
    // First non-repeating character
    public static Character firstUnique(String s) {
        Map&lt;Character, Integer&gt; freq = new HashMap&lt;&gt;();
        
        for (char ch : s.toCharArray()) {
            freq.put(ch, freq.getOrDefault(ch, 0) + 1);
        }
        
        for (char ch : s.toCharArray()) {
            if (freq.get(ch) == 1) {
                return ch;
            }
        }
        return null;
    }
    
    // HashSet for unique elements
    public static boolean hasDuplicate(int[] nums) {
        HashSet&lt;Integer&gt; set = new HashSet&lt;&gt;();
        for (int num : nums) {
            if (!set.add(num)) {
                return true;
            }
        }
        return false;
    }
}
      </code>
    </pre>

    <h2>Binary Trees</h2>
    
    <p>Trees are hierarchical data structures crucial for many applications.</p>

    <pre class="code-block">
      <code>
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int val) {
        this.val = val;
    }
}

class BinaryTree {
    TreeNode root;
    
    // Inorder traversal: Left -> Root -> Right
    public List&lt;Integer&gt; inorder(TreeNode node) {
        List&lt;Integer&gt; result = new ArrayList&lt;&gt;();
        inorderHelper(node, result);
        return result;
    }
    
    private void inorderHelper(TreeNode node, List&lt;Integer&gt; result) {
        if (node != null) {
            inorderHelper(node.left, result);
            result.add(node.val);
            inorderHelper(node.right, result);
        }
    }
    
    // Preorder traversal: Root -> Left -> Right
    public List&lt;Integer&gt; preorder(TreeNode node) {
        List&lt;Integer&gt; result = new ArrayList&lt;&gt;();
        preorderHelper(node, result);
        return result;
    }
    
    private void preorderHelper(TreeNode node, List&lt;Integer&gt; result) {
        if (node != null) {
            result.add(node.val);
            preorderHelper(node.left, result);
            preorderHelper(node.right, result);
        }
    }
    
    // Postorder traversal: Left -> Right -> Root
    public List&lt;Integer&gt; postorder(TreeNode node) {
        List&lt;Integer&gt; result = new ArrayList&lt;&gt;();
        postorderHelper(node, result);
        return result;
    }
    
    private void postorderHelper(TreeNode node, List&lt;Integer&gt; result) {
        if (node != null) {
            postorderHelper(node.left, result);
            postorderHelper(node.right, result);
            result.add(node.val);
        }
    }
    
    // Level order traversal (BFS)
    public List&lt;List&lt;Integer&gt;&gt; levelOrder(TreeNode root) {
        List&lt;List&lt;Integer&gt;&gt; result = new ArrayList&lt;&gt;();
        if (root == null) return result;
        
        Queue&lt;TreeNode&gt; queue = new LinkedList&lt;&gt;();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List&lt;Integer&gt; level = new ArrayList&lt;&gt;();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
    
    // Maximum depth
    public int maxDepth(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
    }
    
    // Check if tree is balanced
    public boolean isBalanced(TreeNode node) {
        return checkHeight(node) != -1;
    }
    
    private int checkHeight(TreeNode node) {
        if (node == null) return 0;
        
        int leftHeight = checkHeight(node.left);
        if (leftHeight == -1) return -1;
        
        int rightHeight = checkHeight(node.right);
        if (rightHeight == -1) return -1;
        
        if (Math.abs(leftHeight - rightHeight) > 1) return -1;
        
        return 1 + Math.max(leftHeight, rightHeight);
    }
}
      </code>
    </pre>

    <h2>Sorting Algorithms</h2>
    
    <p>Understanding sorting algorithms is essential for algorithmic thinking.</p>

    <pre class="code-block">
      <code>
public class SortingAlgorithms {
    // Bubble Sort - O(n²)
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
    
    // Quick Sort - O(n log n) average
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
    
    // Merge Sort - O(n log n)
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }
    
    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        System.arraycopy(arr, left, L, 0, n1);
        System.arraycopy(arr, mid + 1, R, 0, n2);
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k++] = L[i++];
            } else {
                arr[k++] = R[j++];
            }
        }
        
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
    
    // Java's built-in sort
    public static void javaSort(int[] arr) {
        Arrays.sort(arr); // Uses Dual-Pivot Quicksort
    }
    
    // Sort objects with Comparator
    public static void sortObjects() {
        List&lt;String&gt; names = Arrays.asList("John", "Alice", "Bob");
        Collections.sort(names); // Natural order
        
        // Custom comparator
        Collections.sort(names, (a, b) -> b.compareTo(a)); // Reverse
    }
}
      </code>
    </pre>

    <h2>Searching Algorithms</h2>
    
    <p>Efficient searching is crucial for performance optimization.</p>

    <pre class="code-block">
      <code>
public class SearchingAlgorithms {
    // Linear Search - O(n)
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
    
    // Binary Search - O(log n) - requires sorted array
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
    
    // Binary Search (Recursive)
    public static int binarySearchRecursive(int[] arr, int target, 
                                           int left, int right) {
        if (left > right) return -1;
        
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            return binarySearchRecursive(arr, target, mid + 1, right);
        } else {
            return binarySearchRecursive(arr, target, left, mid - 1);
        }
    }
    
    // Find first and last position
    public static int[] searchRange(int[] arr, int target) {
        int first = findFirst(arr, target);
        int last = findLast(arr, target);
        return new int[]{first, last};
    }
    
    private static int findFirst(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        int result = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) {
                result = mid;
                right = mid - 1;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return result;
    }
    
    private static int findLast(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        int result = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) {
                result = mid;
                left = mid + 1;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return result;
    }
    
    // Using Java's built-in binary search
    public static int javaBinarySearch(int[] arr, int target) {
        return Arrays.binarySearch(arr, target);
    }
}
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">📊 Java Collections Complexity</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>ArrayList:</strong> Get O(1), Add O(1)*, Remove O(n)</li>
        <li><strong>LinkedList:</strong> Get O(n), Add O(1), Remove O(1) at ends</li>
        <li><strong>HashMap:</strong> Get/Put/Remove O(1) average</li>
        <li><strong>TreeMap:</strong> Get/Put/Remove O(log n)</li>
        <li><strong>HashSet:</strong> Add/Remove/Contains O(1) average</li>
        <li><strong>TreeSet:</strong> Add/Remove/Contains O(log n)</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Practice Challenge</h4>
      <p class="text-sm text-green-800">
        Implement a function to detect a cycle in a linked list using Floyd's Cycle Detection Algorithm (tortoise and hare approach).
        Then implement a method to find where the cycle begins.
      </p>
    </div>
  </div>`,
  objectives: [
    "Master Java Collections Framework: ArrayList, LinkedList, HashMap, TreeMap",
    "Implement custom data structures: linked lists, trees, stacks, queues",
    "Understand and implement common sorting algorithms",
    "Master binary search and its variations",
    "Analyze time and space complexity using Big O notation",
  ],
  practiceInstructions: [
    "Implement a LinkedList with reverse() method",
    "Create a stack-based solution for balanced parentheses",
    "Write binary search for finding first and last position of target",
    "Implement merge sort algorithm",
    "Solve two-sum problem using HashMap in O(n) time",
  ],
  hints: [
    "Use ArrayList for random access, LinkedList for frequent insertions/deletions",
    "HashMap is your friend for O(1) lookups - use it often",
    "Remember to handle edge cases: null, empty, single element",
    "Draw diagrams for tree and linked list problems",
    "Practice recursion with base cases clearly defined",
  ],
  solution: `// Comprehensive DSA Solutions in Java

// 1. Reverse Linked List
class Node {
    int data;
    Node next;
    Node(int data) { this.data = data; }
}

public Node reverseList(Node head) {
    Node prev = null;
    Node current = head;
    while (current != null) {
        Node next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}

// 2. Balanced Parentheses
public boolean isBalanced(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> pairs = Map.of('(', ')', '{', '}', '[', ']');
    
    for (char ch : s.toCharArray()) {
        if (pairs.containsKey(ch)) {
            stack.push(ch);
        } else if (pairs.containsValue(ch)) {
            if (stack.isEmpty() || pairs.get(stack.pop()) != ch) {
                return false;
            }
        }
    }
    return stack.isEmpty();
}

// 3. Binary Search with First/Last Position
public int[] searchRange(int[] arr, int target) {
    return new int[]{findFirst(arr, target), findLast(arr, target)};
}

private int findFirst(int[] arr, int target) {
    int left = 0, right = arr.length - 1, result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            result = mid;
            right = mid - 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}

// 4. Merge Sort
public void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

// 5. Two Sum
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}

System.out.println("All DSA solutions implemented!");`,
};
