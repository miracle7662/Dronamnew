import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Bruschetta',
    description: 'Toasted bread with tomatoes, basil, and olive oil.',
    price: 8.99,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1627308594174-3ca6933fd267?w=300',
  },
  {
    id: 2,
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, tomatoes, and balsamic glaze.',
    price: 10.99,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1590701914042-4b7fd29cac65?w=300',
  },
  {
    id: 3,
    name: 'Grilled Salmon',
    description: 'Served with lemon herb sauce and asparagus.',
    price: 22.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300',
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce and mozzarella.',
    price: 15.99,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d8db?w=300',
  },
  {
    id: 5,
    name: 'Chocolate Lava Cake',
    description: 'Warm cake with a molten center and ice cream.',
    price: 7.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1617296538902-22f9e5f0c77c?w=300',
  },
  {
    id: 6,
    name: 'Tiramisu',
    description: 'Coffee-soaked ladyfingers with mascarpone cream.',
    price: 6.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571878093904-1df3b0b5f376?w=300',
  },
];

const categories = ['All', 'Appetizers', 'Main Course', 'Desserts'];

const Customer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const cartVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">Restaurant Menu</h1>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors"
            aria-label="Toggle cart"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 backdrop-blur-md ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-300 text-sm mt-2">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-indigo-300 font-bold">${item.price.toFixed(2)}</p>
                  <motion.button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-indigo-600 rounded-full text-sm hover:bg-indigo-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-indigo-800/90 backdrop-blur-md p-6 shadow-lg overflow-y-auto"
              variants={cartVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Close cart"
                >
                  <X size={24} />
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="text-gray-300">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex justify-between items-center mb-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div>
                        <h3 className="text-lg">{item.name}</h3>
                        <p className="text-gray-300">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 bg-gray-700 rounded-full"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={16} />
                        </button>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 bg-gray-700 rounded-full"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 bg-red-600 rounded-full"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <div className="mt-6">
                    <p className="text-xl font-bold">
                      Total: ${cartTotal.toFixed(2)}
                    </p>
                    <motion.button
                      className="w-full mt-4 px-4 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Place Order
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Customer;