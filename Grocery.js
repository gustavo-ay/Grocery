import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedPrice?: number;
  addedAt: Date;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const categories: Category[] = [
  { id: 'produce', name: 'Fresh Produce', icon: '🥬', color: 'from-green-400 to-green-600' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', color: 'from-blue-400 to-blue-600' },
  { id: 'meat', name: 'Meat & Seafood', icon: '🥩', color: 'from-red-400 to-red-600' },
  { id: 'bakery', name: 'Bakery', icon: '🍞', color: 'from-orange-400 to-orange-600' },
  { id: 'pantry', name: 'Pantry', icon: '🥫', color: 'from-purple-400 to-purple-600' },
  { id: 'frozen', name: 'Frozen', icon: '🧊', color: 'from-cyan-400 to-cyan-600' },
  { id: 'household', name: 'Household', icon: '🧽', color: 'from-gray-400 to-gray-600' },
  { id: 'other', name: 'Other', icon: '📦', color: 'from-indigo-400 to-indigo-600' }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

export default function ModernGroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('produce');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'category' | 'priority' | 'all'>('category');
  const [isDark, setIsDark] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('modernGroceryList');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt)
      }));
      setItems(parsedItems);
    }

    const savedTheme = localStorage.getItem('groceryListTheme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  // Save items to localStorage
  useEffect(() => {
    localStorage.setItem('modernGroceryList', JSON.stringify(items));
  }, [items]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('groceryListTheme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const addItem = () => {
    if (!newItem.trim()) return;

    const item: GroceryItem = {
      id: Date.now().toString(),
      name: newItem.trim(),
      category: selectedCategory,
      quantity,
      unit,
      completed: false,
      priority: selectedPriority,
      addedAt: new Date()
    };

    setItems(prev => [...prev, item]);
    setNewItem('');
    setQuantity(1);
    setShowAddForm(false);
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCompleted = () => {
    setItems(prev => prev.filter(item => !item.completed));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = viewMode === 'category' 
    ? categories.reduce((acc, category) => {
        const categoryItems = filteredItems.filter(item => item.category === category.id);
        if (categoryItems.length > 0) {
          acc[category.id] = { category, items: categoryItems };
        }
        return acc;
      }, {} as Record<string, { category: Category; items: GroceryItem[] }>)
    : { all: { category: null, items: filteredItems } };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl p-8 mb-8 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white/70 border border-white/50'
          } backdrop-blur-xl shadow-2xl`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Smart Grocery List
              </h1>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Organize your shopping with style
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isDark 
                    ? 'bg-yellow-500 text-yellow-900 shadow-yellow-500/25' 
                    : 'bg-purple-500 text-white shadow-purple-500/25'
                } shadow-lg hover:scale-110`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <div className={`text-right ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <p className="text-2xl font-bold">{completedCount}/{totalCount}</p>
                <p className="text-sm">Items completed</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <motion.div 
            className={`mt-6 h-3 rounded-full overflow-hidden ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </motion.header>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 mb-8 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white/70 border border-white/50'
          } backdrop-blur-xl shadow-xl`}
        >
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' 
                    : 'bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/25`}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-3 rounded-xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700/50 border-gray-600 text-white' 
                  : 'bg-white/50 border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/25`}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Buttons */}
          <div className="flex gap-2 mb-6">
            {['category', 'all'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === mode
                    ? 'bg-purple-500 text-white shadow-lg'
                    : isDark
                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mode === 'category' ? '📂 By Category' : '📋 All Items'}
              </button>
            ))}
          </div>

          {/* Add Item Button */}
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showAddForm ? '❌ Cancel' : '➕ Add New Item'}
          </motion.button>
        </motion.div>

        {/* Add Item Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-2xl p-6 mb-8 ${
                isDark 
                  ? 'bg-gray-800/40 border border-gray-700/50' 
                  : 'bg-white/70 border border-white/50'
              } backdrop-blur-xl shadow-xl`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  className={`px-4 py-3 rounded-xl border transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/25`}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/25`}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className={`w-20 px-3 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white/50 border-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/25`}
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className={`flex-1 px-3 py-3 rounded-xl border ${
                      isDark 
                        ? 'bg-gray-700/50 border-gray-600 text-white' 
                        : 'bg-white/50 border-gray-300 text-gray-800'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/25`}
                  >
                    <option value="pc">pieces</option>
                    <option value="kg">kg</option>
                    <option value="g">grams</option>
                    <option value="l">liters</option>
                    <option value="ml">ml</option>
                    <option value="pack">pack</option>
                    <option value="bottle">bottle</option>
                    <option value="can">can</option>
                  </select>
                </div>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                  className={`px-4 py-3 rounded-xl border ${
                    isDark 
                      ? 'bg-gray-700/50 border-gray-600 text-white' 
                      : 'bg-white/50 border-gray-300 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/25`}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>
              <motion.button
                onClick={addItem}
                disabled={!newItem.trim()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: newItem.trim() ? 1.02 : 1 }}
                whileTap={{ scale: newItem.trim() ? 0.98 : 1 }}
              >
                ✨ Add Item
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items List */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([groupKey, { category, items: groupItems }]) => (
            <motion.div
              key={groupKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl overflow-hidden ${
                isDark 
                  ? 'bg-gray-800/40 border border-gray-700/50' 
                  : 'bg-white/70 border border-white/50'
              } backdrop-blur-xl shadow-xl`}
            >
              {category && (
                <div className={`px-6 py-4 bg-gradient-to-r ${category.color} text-white`}>
                  <h2 className="text-xl font-semibold flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                    <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
                      {groupItems.length}
                    </span>
                  </h2>
                </div>
              )}
              
              <div className="p-6">
                <AnimatePresence>
                  {groupItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`text-center py-8 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <div className="text-4xl mb-2">📭</div>
                      <p>No items in this category</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            item.completed
                              ? isDark
                                ? 'bg-green-900/20 border-green-700/50 opacity-60'
                                : 'bg-green-50 border-green-200 opacity-60'
                              : isDark
                              ? 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-600/30'
                              : 'bg-white/50 border-gray-200 hover:bg-white/70'
                          } hover:shadow-lg`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleComplete(item.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                item.completed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : isDark
                                  ? 'border-gray-500 hover:border-green-400'
                                  : 'border-gray-300 hover:border-green-500'
                              }`}
                            >
                              {item.completed && '✓'}
                            </button>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold ${
                                  item.completed
                                    ? 'line-through text-gray-500'
                                    : isDark
                                    ? 'text-white'
                                    : 'text-gray-800'
                                }`}>
                                  {item.name}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[item.priority]}`}>
                                  {item.priority}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                                      isDark
                                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    } transition-colors duration-200`}
                                  >
                                    −
                                  </button>
                                  <span className={`px-2 py-1 rounded-lg min-w-16 text-center ${
                                    isDark ? 'bg-gray-600/50 text-white' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.quantity} {item.unit}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                                      isDark
                                        ? 'bg-gray-600 text-white hover:bg-gray-500'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    } transition-colors duration-200`}
                                  >
                                    +
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => deleteItem(item.id)}
                                  className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex gap-4 justify-center"
          >
            <button
              onClick={clearCompleted}
              disabled={completedCount === 0}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-red-600 hover:scale-105"
            >
              🗑️ Clear Completed ({completedCount})
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center py-16 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold mb-2">Your grocery list is empty</h3>
            <p className="text-lg mb-6">Start adding items to organize your shopping!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              ➕ Add Your First Item
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}