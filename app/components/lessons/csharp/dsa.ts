import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Data Structures & Algorithms in C#",
  description:
    "Master essential data structures and algorithms using C# and .NET. Learn List, LinkedList, Stack, Queue, Dictionary, HashSet, sorting, and searching algorithms with LINQ.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Data Structures and Algorithms are fundamental to C# and .NET development. This lesson covers essential DSA concepts using C#'s built-in collections and LINQ capabilities.</p>

    <h2>Arrays and Lists</h2>
    
    <p>C# provides both primitive arrays and the dynamic List&lt;T&gt; class for storing collections of elements.</p>

    <pre class="code-block">
      <code>
using System;
using System.Collections.Generic;
using System.Linq;

public class ArrayExamples
{
    public static void Main()
    {
        // Primitive array - fixed size
        int[] numbers = { 1, 2, 3, 4, 5 };
        
        // Access by index - O(1)
        int first = numbers[0];
        
        // List&lt;T&gt; - dynamic size
        List&lt;int&gt; list = new List&lt;int&gt;();
        
        // Add to end - O(1) amortized
        list.Add(10);
        list.Add(20);
        list.Add(30);
        
        // Insert at position - O(n)
        list.Insert(0, 5);
        
        // Remove by index - O(n)
        list.RemoveAt(0);
        
        // Remove by value - O(n)
        list.Remove(20);
        
        // Get element - O(1)
        int value = list[0];
        
        // Check if contains - O(n)
        bool exists = list.Contains(30);
        
        // Size
        int count = list.Count;
        
        // LINQ operations
        var evens = list.Where(x => x % 2 == 0).ToList();
        var sorted = list.OrderBy(x => x).ToList();
        int sum = list.Sum();
        double average = list.Average();
    }
    
    // Two Pointers Technique
    public static int[] TwoSum(int[] nums, int target)
    {
        Array.Sort(nums); // O(n log n)
        int left = 0;
        int right = nums.Length - 1;
        
        while (left < right)
        {
            int sum = nums[left] + nums[right];
            if (sum == target)
            {
                return new int[] { nums[left], nums[right] };
            }
            else if (sum < target)
            {
                left++;
            }
            else
            {
                right--;
            }
        }
        return new int[] { };
    }
}
      </code>
    </pre>

    <h2>LinkedList Implementation</h2>
    
    <p>C# provides LinkedList&lt;T&gt; class, but understanding custom implementation is valuable.</p>

    <pre class="code-block">
      <code>
public class Node
{
    public int Data { get; set; }
    public Node Next { get; set; }
    
    public Node(int data)
    {
        Data = data;
        Next = null;
    }
}

public class LinkedList
{
    private Node head;
    
    // Add to end - O(n)
    public void Append(int data)
    {
        Node newNode = new Node(data);
        
        if (head == null)
        {
            head = newNode;
            return;
        }
        
        Node current = head;
        while (current.Next != null)
        {
            current = current.Next;
        }
        current.Next = newNode;
    }
    
    // Add to beginning - O(1)
    public void Prepend(int data)
    {
        Node newNode = new Node(data);
        newNode.Next = head;
        head = newNode;
    }
    
    // Delete first occurrence - O(n)
    public void Delete(int data)
    {
        if (head == null) return;
        
        if (head.Data == data)
        {
            head = head.Next;
            return;
        }
        
        Node current = head;
        while (current.Next != null)
        {
            if (current.Next.Data == data)
            {
                current.Next = current.Next.Next;
                return;
            }
            current = current.Next;
        }
    }
    
    // Reverse linked list - O(n)
    public void Reverse()
    {
        Node prev = null;
        Node current = head;
        Node next = null;
        
        while (current != null)
        {
            next = current.Next;
            current.Next = prev;
            prev = current;
            current = next;
        }
        head = prev;
    }
    
    // Find middle element using slow/fast pointers - O(n)
    public Node FindMiddle()
    {
        if (head == null) return null;
        
        Node slow = head;
        Node fast = head;
        
        while (fast != null && fast.Next != null)
        {
            slow = slow.Next;
            fast = fast.Next.Next;
        }
        return slow;
    }
    
    // Display list
    public void Display()
    {
        Node current = head;
        while (current != null)
        {
            Console.Write(current.Data + " -> ");
            current = current.Next;
        }
        Console.WriteLine("null");
    }
}
      </code>
    </pre>

    <h2>Stack and Queue</h2>
    
    <p>C# provides Stack&lt;T&gt; and Queue&lt;T&gt; classes for LIFO and FIFO operations.</p>

    <pre class="code-block">
      <code>
using System.Collections.Generic;

public class StackQueueExamples
{
    // Stack example
    public static void StackExample()
    {
        Stack&lt;int&gt; stack = new Stack&lt;int&gt;();
        
        // Push - O(1)
        stack.Push(10);
        stack.Push(20);
        stack.Push(30);
        
        // Peek - O(1)
        int top = stack.Peek();
        
        // Pop - O(1)
        int popped = stack.Pop();
        
        // Check if empty
        bool isEmpty = stack.Count == 0;
        
        // Size
        int size = stack.Count;
    }
    
    // Queue example
    public static void QueueExample()
    {
        Queue&lt;int&gt; queue = new Queue&lt;int&gt;();
        
        // Enqueue - O(1)
        queue.Enqueue(10);
        queue.Enqueue(20);
        queue.Enqueue(30);
        
        // Peek - O(1)
        int front = queue.Peek();
        
        // Dequeue - O(1)
        int removed = queue.Dequeue();
        
        // Check if empty
        bool isEmpty = queue.Count == 0;
    }
    
    // Balanced Parentheses Check
    public static bool IsBalanced(string expression)
    {
        Stack&lt;char&gt; stack = new Stack&lt;char&gt;();
        Dictionary&lt;char, char&gt; pairs = new Dictionary&lt;char, char&gt;
        {
            { '(', ')' },
            { '{', '}' },
            { '[', ']' }
        };
        
        foreach (char ch in expression)
        {
            if (pairs.ContainsKey(ch))
            {
                stack.Push(ch);
            }
            else if (pairs.ContainsValue(ch))
            {
                if (stack.Count == 0 || pairs[stack.Pop()] != ch)
                {
                    return false;
                }
            }
        }
        return stack.Count == 0;
    }
    
    // Priority Queue using SortedSet
    public static void PriorityQueueExample()
    {
        // .NET 6+ has built-in PriorityQueue
        PriorityQueue&lt;string, int&gt; pq = new PriorityQueue&lt;string, int&gt;();
        
        pq.Enqueue("Low priority", 3);
        pq.Enqueue("High priority", 1);
        pq.Enqueue("Medium priority", 2);
        
        string first = pq.Dequeue(); // Returns "High priority"
    }
}
      </code>
    </pre>

    <h2>Dictionary and HashSet</h2>
    
    <p>C#'s Dictionary&lt;TKey, TValue&gt; provides O(1) average-case lookups.</p>

    <pre class="code-block">
      <code>
using System.Collections.Generic;

public class DictionaryExamples
{
    // Basic Dictionary operations
    public static void DictionaryBasics()
    {
        Dictionary&lt;string, int&gt; dict = new Dictionary&lt;string, int&gt;();
        
        // Add - O(1)
        dict["apple"] = 5;
        dict["banana"] = 3;
        dict["orange"] = 7;
        
        // Get - O(1)
        int value = dict["apple"];
        
        // TryGetValue (safer)
        if (dict.TryGetValue("grape", out int count))
        {
            Console.WriteLine(count);
        }
        
        // Contains key - O(1)
        bool hasApple = dict.ContainsKey("apple");
        
        // Remove - O(1)
        dict.Remove("banana");
        
        // Iterate
        foreach (var kvp in dict)
        {
            Console.WriteLine($"{kvp.Key}: {kvp.Value}");
        }
    }
    
    // Count frequency of elements
    public static Dictionary&lt;int, int&gt; CountFrequency(int[] arr)
    {
        Dictionary&lt;int, int&gt; freq = new Dictionary&lt;int, int&gt;();
        
        foreach (int num in arr)
        {
            if (freq.ContainsKey(num))
                freq[num]++;
            else
                freq[num] = 1;
        }
        return freq;
    }
    
    // Two Sum using Dictionary - O(n)
    public static int[] TwoSum(int[] nums, int target)
    {
        Dictionary&lt;int, int&gt; map = new Dictionary&lt;int, int&gt;();
        
        for (int i = 0; i < nums.Length; i++)
        {
            int complement = target - nums[i];
            if (map.ContainsKey(complement))
            {
                return new int[] { map[complement], i };
            }
            map[nums[i]] = i;
        }
        return new int[] { };
    }
    
    // First non-repeating character
    public static char? FirstUnique(string s)
    {
        Dictionary&lt;char, int&gt; freq = new Dictionary&lt;char, int&gt;();
        
        foreach (char ch in s)
        {
            freq[ch] = freq.ContainsKey(ch) ? freq[ch] + 1 : 1;
        }
        
        foreach (char ch in s)
        {
            if (freq[ch] == 1)
            {
                return ch;
            }
        }
        return null;
    }
    
    // HashSet for unique elements
    public static bool HasDuplicate(int[] nums)
    {
        HashSet&lt;int&gt; set = new HashSet&lt;int&gt;();
        
        foreach (int num in nums)
        {
            if (!set.Add(num))
            {
                return true;
            }
        }
        return false;
    }
    
    // Using LINQ with Dictionary
    public static void LinqWithDictionary()
    {
        var dict = new Dictionary&lt;string, int&gt;
        {
            { "apple", 5 },
            { "banana", 3 },
            { "orange", 7 }
        };
        
        // Find max value
        var max = dict.Values.Max();
        
        // Get key with max value
        var maxKey = dict.OrderByDescending(x => x.Value).First().Key;
        
        // Filter
        var filtered = dict.Where(x => x.Value > 4).ToDictionary(x => x.Key, x => x.Value);
    }
}
      </code>
    </pre>

    <h2>Binary Trees</h2>
    
    <p>Trees are hierarchical data structures essential for many algorithms.</p>

    <pre class="code-block">
      <code>
public class TreeNode
{
    public int Val { get; set; }
    public TreeNode Left { get; set; }
    public TreeNode Right { get; set; }
    
    public TreeNode(int val = 0)
    {
        Val = val;
        Left = null;
        Right = null;
    }
}

public class BinaryTree
{
    public TreeNode Root { get; set; }
    
    // Inorder traversal: Left -> Root -> Right
    public List&lt;int&gt; Inorder(TreeNode node)
    {
        List&lt;int&gt; result = new List&lt;int&gt;();
        InorderHelper(node, result);
        return result;
    }
    
    private void InorderHelper(TreeNode node, List&lt;int&gt; result)
    {
        if (node != null)
        {
            InorderHelper(node.Left, result);
            result.Add(node.Val);
            InorderHelper(node.Right, result);
        }
    }
    
    // Preorder traversal: Root -> Left -> Right
    public List&lt;int&gt; Preorder(TreeNode node)
    {
        List&lt;int&gt; result = new List&lt;int&gt;();
        PreorderHelper(node, result);
        return result;
    }
    
    private void PreorderHelper(TreeNode node, List&lt;int&gt; result)
    {
        if (node != null)
        {
            result.Add(node.Val);
            PreorderHelper(node.Left, result);
            PreorderHelper(node.Right, result);
        }
    }
    
    // Postorder traversal: Left -> Right -> Root
    public List&lt;int&gt; Postorder(TreeNode node)
    {
        List&lt;int&gt; result = new List&lt;int&gt;();
        PostorderHelper(node, result);
        return result;
    }
    
    private void PostorderHelper(TreeNode node, List&lt;int&gt; result)
    {
        if (node != null)
        {
            PostorderHelper(node.Left, result);
            PostorderHelper(node.Right, result);
            result.Add(node.Val);
        }
    }
    
    // Level order traversal (BFS)
    public List&lt;List&lt;int&gt;&gt; LevelOrder(TreeNode root)
    {
        List&lt;List&lt;int&gt;&gt; result = new List&lt;List&lt;int&gt;&gt;();
        if (root == null) return result;
        
        Queue&lt;TreeNode&gt; queue = new Queue&lt;TreeNode&gt;();
        queue.Enqueue(root);
        
        while (queue.Count > 0)
        {
            int levelSize = queue.Count;
            List&lt;int&gt; level = new List&lt;int&gt;();
            
            for (int i = 0; i < levelSize; i++)
            {
                TreeNode node = queue.Dequeue();
                level.Add(node.Val);
                
                if (node.Left != null) queue.Enqueue(node.Left);
                if (node.Right != null) queue.Enqueue(node.Right);
            }
            result.Add(level);
        }
        return result;
    }
    
    // Maximum depth
    public int MaxDepth(TreeNode node)
    {
        if (node == null) return 0;
        return 1 + Math.Max(MaxDepth(node.Left), MaxDepth(node.Right));
    }
    
    // Check if tree is balanced
    public bool IsBalanced(TreeNode node)
    {
        return CheckHeight(node) != -1;
    }
    
    private int CheckHeight(TreeNode node)
    {
        if (node == null) return 0;
        
        int leftHeight = CheckHeight(node.Left);
        if (leftHeight == -1) return -1;
        
        int rightHeight = CheckHeight(node.Right);
        if (rightHeight == -1) return -1;
        
        if (Math.Abs(leftHeight - rightHeight) > 1) return -1;
        
        return 1 + Math.Max(leftHeight, rightHeight);
    }
}
      </code>
    </pre>

    <h2>Sorting Algorithms</h2>
    
    <p>Understanding sorting algorithms helps you choose the right approach for different scenarios.</p>

    <pre class="code-block">
      <code>
public class SortingAlgorithms
{
    // Bubble Sort - O(n²)
    public static void BubbleSort(int[] arr)
    {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++)
        {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++)
            {
                if (arr[j] > arr[j + 1])
                {
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
    public static void QuickSort(int[] arr, int low, int high)
    {
        if (low < high)
        {
            int pi = Partition(arr, low, high);
            QuickSort(arr, low, pi - 1);
            QuickSort(arr, pi + 1, high);
        }
    }
    
    private static int Partition(int[] arr, int low, int high)
    {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++)
        {
            if (arr[j] < pivot)
            {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp2 = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp2;
        
        return i + 1;
    }
    
    // Merge Sort - O(n log n)
    public static void MergeSort(int[] arr, int left, int right)
    {
        if (left < right)
        {
            int mid = left + (right - left) / 2;
            MergeSort(arr, left, mid);
            MergeSort(arr, mid + 1, right);
            Merge(arr, left, mid, right);
        }
    }
    
    private static void Merge(int[] arr, int left, int mid, int right)
    {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        Array.Copy(arr, left, L, 0, n1);
        Array.Copy(arr, mid + 1, R, 0, n2);
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2)
        {
            if (L[i] <= R[j])
            {
                arr[k++] = L[i++];
            }
            else
            {
                arr[k++] = R[j++];
            }
        }
        
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
    
    // C#'s built-in sort
    public static void ArraySort(int[] arr)
    {
        Array.Sort(arr); // Uses IntroSort (QuickSort + HeapSort + InsertionSort)
    }
    
    // LINQ OrderBy
    public static void LinqSort()
    {
        int[] arr = { 64, 34, 25, 12, 22, 11, 90 };
        var sorted = arr.OrderBy(x => x).ToArray();
        var sortedDesc = arr.OrderByDescending(x => x).ToArray();
    }
    
    // Sort objects with custom comparer
    public static void SortObjects()
    {
        List&lt;string&gt; names = new List&lt;string&gt; { "John", "Alice", "Bob" };
        names.Sort(); // Natural order
        
        // Custom comparison
        names.Sort((a, b) => b.CompareTo(a)); // Reverse
        
        // LINQ
        var sortedNames = names.OrderBy(n => n.Length).ToList();
    }
}
      </code>
    </pre>

    <h2>Searching Algorithms</h2>
    
    <p>Efficient searching is critical for performance optimization.</p>

    <pre class="code-block">
      <code>
public class SearchingAlgorithms
{
    // Linear Search - O(n)
    public static int LinearSearch(int[] arr, int target)
    {
        for (int i = 0; i < arr.Length; i++)
        {
            if (arr[i] == target)
            {
                return i;
            }
        }
        return -1;
    }
    
    // Binary Search - O(log n) - requires sorted array
    public static int BinarySearch(int[] arr, int target)
    {
        int left = 0;
        int right = arr.Length - 1;
        
        while (left <= right)
        {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target)
            {
                return mid;
            }
            else if (arr[mid] < target)
            {
                left = mid + 1;
            }
            else
            {
                right = mid - 1;
            }
        }
        return -1;
    }
    
    // Binary Search (Recursive)
    public static int BinarySearchRecursive(int[] arr, int target, 
                                           int left, int right)
    {
        if (left > right) return -1;
        
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target)
        {
            return mid;
        }
        else if (arr[mid] < target)
        {
            return BinarySearchRecursive(arr, target, mid + 1, right);
        }
        else
        {
            return BinarySearchRecursive(arr, target, left, mid - 1);
        }
    }
    
    // Find first and last position
    public static int[] SearchRange(int[] arr, int target)
    {
        int first = FindFirst(arr, target);
        int last = FindLast(arr, target);
        return new int[] { first, last };
    }
    
    private static int FindFirst(int[] arr, int target)
    {
        int left = 0, right = arr.Length - 1;
        int result = -1;
        
        while (left <= right)
        {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target)
            {
                result = mid;
                right = mid - 1;
            }
            else if (arr[mid] < target)
            {
                left = mid + 1;
            }
            else
            {
                right = mid - 1;
            }
        }
        return result;
    }
    
    private static int FindLast(int[] arr, int target)
    {
        int left = 0, right = arr.Length - 1;
        int result = -1;
        
        while (left <= right)
        {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target)
            {
                result = mid;
                left = mid + 1;
            }
            else if (arr[mid] < target)
            {
                left = mid + 1;
            }
            else
            {
                right = mid - 1;
            }
        }
        return result;
    }
    
    // Using C#'s built-in binary search
    public static int ArrayBinarySearch(int[] arr, int target)
    {
        return Array.BinarySearch(arr, target);
    }
    
    // Using LINQ
    public static void LinqSearch()
    {
        int[] arr = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        
        // Find first element matching condition
        int first = arr.FirstOrDefault(x => x > 5); // Returns 6
        
        // Check if any element matches
        bool hasEven = arr.Any(x => x % 2 == 0);
        
        // Check if all elements match
        bool allPositive = arr.All(x => x > 0);
        
        // Find index
        int index = Array.FindIndex(arr, x => x == 5);
    }
}
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">📊 C# Collections Complexity</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>List&lt;T&gt;:</strong> Get O(1), Add O(1)*, Remove O(n)</li>
        <li><strong>LinkedList&lt;T&gt;:</strong> AddFirst/Last O(1), Find O(n)</li>
        <li><strong>Dictionary&lt;K,V&gt;:</strong> Get/Add/Remove O(1) average</li>
        <li><strong>SortedDictionary&lt;K,V&gt;:</strong> Get/Add/Remove O(log n)</li>
        <li><strong>HashSet&lt;T&gt;:</strong> Add/Remove/Contains O(1) average</li>
        <li><strong>SortedSet&lt;T&gt;:</strong> Add/Remove/Contains O(log n)</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Practice Challenge</h4>
      <p class="text-sm text-green-800">
        Implement a function to find the Kth largest element in an unsorted array using a heap-based approach.
        Compare it with a sorting-based solution and analyze the time complexity difference.
      </p>
    </div>
  </div>`,
  objectives: [
    "Master C# Collections: List, Dictionary, HashSet, Stack, Queue",
    "Implement custom data structures using C# classes",
    "Understand and implement common sorting algorithms",
    "Master binary search and LINQ for searching",
    "Analyze time and space complexity using Big O notation",
  ],
  practiceInstructions: [
    "Implement a LinkedList class with Reverse() method",
    "Create a stack-based solution for balanced parentheses",
    "Write binary search for finding first and last position",
    "Implement merge sort algorithm",
    "Solve two-sum problem using Dictionary in O(n) time",
  ],
  hints: [
    "Use List<T> for most scenarios, LinkedList<T> for frequent insertions",
    "Dictionary<K,V> provides O(1) lookups - use it often",
    "LINQ makes code readable but may impact performance",
    "Remember nullable types: char?, int? for potential null returns",
    "Practice with generics: <T> makes code reusable",
  ],
  solution: `// Comprehensive DSA Solutions in C#

// 1. Reverse Linked List
public class Node
{
    public int Data { get; set; }
    public Node Next { get; set; }
    public Node(int data) { Data = data; }
}

public Node ReverseList(Node head)
{
    Node prev = null;
    Node current = head;
    while (current != null)
    {
        Node next = current.Next;
        current.Next = prev;
        prev = current;
        current = next;
    }
    return prev;
}

// 2. Balanced Parentheses
public bool IsBalanced(string s)
{
    Stack<char> stack = new Stack<char>();
    Dictionary<char, char> pairs = new Dictionary<char, char>
    {
        { '(', ')' }, { '{', '}' }, { '[', ']' }
    };
    
    foreach (char ch in s)
    {
        if (pairs.ContainsKey(ch))
        {
            stack.Push(ch);
        }
        else if (pairs.ContainsValue(ch))
        {
            if (stack.Count == 0 || pairs[stack.Pop()] != ch)
                return false;
        }
    }
    return stack.Count == 0;
}

// 3. Binary Search with First/Last Position
public int[] SearchRange(int[] arr, int target)
{
    return new int[] { FindFirst(arr, target), FindLast(arr, target) };
}

private int FindFirst(int[] arr, int target)
{
    int left = 0, right = arr.Length - 1, result = -1;
    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target)
        {
            result = mid;
            right = mid - 1;
        }
        else if (arr[mid] < target)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return result;
}

// 4. Merge Sort
public void MergeSort(int[] arr, int left, int right)
{
    if (left < right)
    {
        int mid = left + (right - left) / 2;
        MergeSort(arr, left, mid);
        MergeSort(arr, mid + 1, right);
        Merge(arr, left, mid, right);
    }
}

// 5. Two Sum
public int[] TwoSum(int[] nums, int target)
{
    Dictionary<int, int> map = new Dictionary<int, int>();
    for (int i = 0; i < nums.Length; i++)
    {
        int complement = target - nums[i];
        if (map.ContainsKey(complement))
            return new int[] { map[complement], i };
        map[nums[i]] = i;
    }
    return new int[] { };
}

Console.WriteLine("All DSA solutions implemented!");`,
};
