import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Search, Trash2, Tag, Check, X } from 'lucide-react';
import { formatTaka } from '../utils/bakiUtils';
import { useToast } from '../../../context/ToastContext';

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
}

const DEFAULT_PRODUCTS: ShopProduct[] = [
  { id: 'p1', name: '1L Soybean Oil', price: 170, unit: 'Bottle', category: 'Grocery' },
  { id: 'p2', name: '1kg Sugar (চিনি)', price: 130, unit: 'Kg', category: 'Grocery' },
  { id: 'p3', name: '4x Farm Eggs (ডিম)', price: 50, unit: 'Hali', category: 'Grocery' },
  { id: 'p4', name: 'Tea & Biscuit (চা ও বিস্কুট)', price: 15, unit: 'Cup', category: 'Tea & Pan' },
  { id: 'p5', name: 'Betel Leaf & Pan (পান সুপারি)', price: 10, unit: 'Piece', category: 'Tea & Pan' },
  { id: 'p6', name: '1kg Miniket Rice (চাল)', price: 70, unit: 'Kg', category: 'Grocery' },
  { id: 'p7', name: '1kg Mosur Dal (মসুর ডাল)', price: 140, unit: 'Kg', category: 'Grocery' },
  { id: 'p8', name: 'Bath Soap (সাবান)', price: 45, unit: 'Piece', category: 'Household' },
  { id: 'p9', name: '1L Fresh Milk (দুধ)', price: 90, unit: 'Liter', category: 'Grocery' },
];

export const ProductListView: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ShopProduct[]>(() => {
    try {
      const saved = localStorage.getItem('bakikhata_store_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PRODUCTS;
  });

  const [search, setSearch] = useState('');
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('Kg');
  const [newCategory, setNewCategory] = useState('Grocery');

  useEffect(() => {
    try {
      localStorage.setItem('bakikhata_store_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;
    const priceNum = Number(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('সঠিক মূল্য লিখুন!', 'error');
      return;
    }

    const newProd: ShopProduct = {
      id: 'prod_' + Date.now(),
      name: newName.trim(),
      price: priceNum,
      unit: newUnit,
      category: newCategory,
    };

    setProducts((prev) => [newProd, ...prev]);
    setNewName('');
    setNewPrice('');
    setIsOpenAddModal(false);
    showToast('নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে!', 'success');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('প্রোডাক্ট মুছে ফেলা হয়েছে!', 'info');
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Store Product Listing ({products.length})
            </h3>
            <p className="text-xs text-slate-500">Manage grocery, tea, and retail items with prices</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpenAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 shadow-xs"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between hover:border-indigo-500/50 transition group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  {p.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Unit: {p.unit}</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">{p.name}</h4>
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {formatTaka(p.price)}
              </div>
            </div>

            <button
              onClick={() => handleDeleteProduct(p.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
        </div>
      )}

      {/* Add Product Modal */}
      {isOpenAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add New Product</h3>
              <button
                onClick={() => setIsOpenAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5L Soybean Oil"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Price (৳) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 850"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Liter">Liter</option>
                    <option value="Piece">Piece</option>
                    <option value="Packet">Packet</option>
                    <option value="Hali">Hali</option>
                    <option value="Cup">Cup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Grocery">Grocery</option>
                    <option value="Tea & Pan">Tea & Pan</option>
                    <option value="Household">Household</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
