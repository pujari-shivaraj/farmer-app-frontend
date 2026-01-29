import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, ShoppingCart, IndianRupee } from 'lucide-react';

const Sales = () => {
    const [farmers, setFarmers] = useState([]);
    const [stocks, setStocks] = useState([]);

    // Selection State
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [saleItem, setSaleItem] = useState({
        item_id: '',
        item_type: '',
        item_name: '',
        quantity: 1,
        rate: 0,
        total: 0
    });

    useEffect(() => {
        const loadData = async () => {
            const [farmersRes, stocksRes] = await Promise.all([
                api.get('/farmers'),
                api.get('/stock')
            ]);
            setFarmers(farmersRes.data);
            setStocks(stocksRes.data);
        };
        loadData();
    }, []);

    const handleFarmerSelect = (farmer) => {
        setSelectedFarmer(farmer);
        setSearchTerm(''); // Clear search to show full list or hide list? 
        // Logic: Once selected, maybe clear list or keep it?
        // Let's keep it simple.
    };

    const handleItemChange = (e) => {
        const stockId = e.target.value;
        const selectedStock = stocks.find(s => s.id === parseInt(stockId));

        if (selectedStock) {
            setSaleItem(prev => ({
                ...prev,
                item_id: selectedStock.id,
                item_type: selectedStock.type,
                item_name: selectedStock.name,
                rate: 0 // We don't have rate in stock model? "Seller to Farmer price?"
                // Stock data has cost price? User must enter selling price.
            }));
        } else {
            setSaleItem({ item_id: '', item_type: '', item_name: '', quantity: 1, rate: 0, total: 0 });
        }
    };

    useEffect(() => {
        setSaleItem(prev => ({ ...prev, total: prev.quantity * prev.rate }));
    }, [saleItem.quantity, saleItem.rate]);

    const handleSaleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sales', {
                farmer_id: selectedFarmer.id,
                item_type: saleItem.item_type,
                item_name: saleItem.item_name,
                quantity: saleItem.quantity,
                rate: saleItem.rate,
                total_amount: saleItem.total
            });
            alert("Sale Recorded Successfully!");
            setSelectedFarmer(null);
            setSaleItem({ item_id: '', item_type: '', item_name: '', quantity: 1, rate: 0, total: 0 });
        } catch (err) {
            alert("Sale Failed: " + err.message);
        }
    };

    // Filter farmers
    const filteredFarmers = searchTerm ? farmers.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmer Selection Column */}
            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-gray-800 mb-4">1. Select Farmer</h3>
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search Farmer Name..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                {searchTerm && (
                    <div className="max-h-60 overflow-y-auto border rounded-lg mb-4">
                        {filteredFarmers.map(f => (
                            <div
                                key={f.id}
                                onClick={() => handleFarmerSelect(f)}
                                className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                            >
                                <p className="font-semibold">{f.name}</p>
                                <p className="text-xs text-gray-500">ID: {f.id} | {f.village}</p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedFarmer ? (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-blue-900">{selectedFarmer.name}</h4>
                                <p className="text-sm text-blue-700">{selectedFarmer.village}</p>
                                <p className="text-xs text-blue-600 mt-1">Mobile: {selectedFarmer.mobile}</p>
                            </div>
                            <button onClick={() => setSelectedFarmer(null)} className="text-blue-400 hover:text-blue-600">&times;</button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                        No Farmer Selected
                    </div>
                )}
            </div>

            {/* Sale Entry Column */}
            <div className={`md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-opacity ${!selectedFarmer ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="font-bold text-gray-800 mb-4">2. Enter Sales Details</h3>
                <form onSubmit={handleSaleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Item from Stock</label>
                        <select
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={handleItemChange}
                            value={saleItem.item_id}
                            required
                        >
                            <option value="">-- Select Item --</option>
                            {stocks.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.type}: {s.name} ({s.size}) - Avail: {s.quantity}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input
                                type="number"
                                className="w-full p-3 border rounded-lg"
                                value={saleItem.quantity}
                                onChange={(e) => setSaleItem({ ...saleItem, quantity: parseFloat(e.target.value) })}
                                required
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rate (Per Unit)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-3 py-3 border rounded-lg"
                                    value={saleItem.rate}
                                    onChange={(e) => setSaleItem({ ...saleItem, rate: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500 font-bold">₹</span>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full pl-8 pr-3 py-3 border rounded-lg bg-gray-50 font-bold text-gray-800"
                                    value={saleItem.total}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg flex justify-center items-center"
                    >
                        <ShoppingCart className="mr-2" />
                        Complete Sale
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Sales;
