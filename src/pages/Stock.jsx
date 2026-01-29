import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Package, Calendar } from 'lucide-react';

const Stock = () => {
    const [stocks, setStocks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        type: 'Pesticide',
        name: '',
        size: '',
        mfg_date: '',
        exp_date: '',
        buyer_name: '',
        quantity: ''
    });

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const res = await api.get('/stock');
            setStocks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/stock', formData);
            setShowModal(false);
            fetchStock();
            setFormData({
                type: 'Pesticide', name: '', size: '',
                mfg_date: '', exp_date: '', buyer_name: '', quantity: ''
            });
        } catch (err) {
            alert("Error adding stock");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                    <Plus size={20} className="mr-2" /> Add Stock
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pesticides */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center">
                        <Package className="mr-2" /> Pesticides Stock
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Size</th>
                                    <th className="p-3">Qty</th>
                                    <th className="p-3">Exp Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stocks.filter(s => s.type === 'Pesticide').map(item => (
                                    <tr key={item.id}>
                                        <td className="p-3 font-medium">{item.name}</td>
                                        <td className="p-3 text-gray-500">{item.size}</td>
                                        <td className="p-3 font-bold text-blue-600">{item.quantity}</td>
                                        <td className="p-3 text-red-500">{item.exp_date || '-'}</td>
                                    </tr>
                                ))}
                                {stocks.filter(s => s.type === 'Pesticide').length === 0 && (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-400">No stock available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Fertilizers */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center">
                        <Package className="mr-2" /> Fertilizers Stock
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Size</th>
                                    <th className="p-3">Qty</th>
                                    <th className="p-3">Exp Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stocks.filter(s => s.type === 'Fertilizer').map(item => (
                                    <tr key={item.id}>
                                        <td className="p-3 font-medium">{item.name}</td>
                                        <td className="p-3 text-gray-500">{item.size}</td>
                                        <td className="p-3 font-bold text-blue-600">{item.quantity}</td>
                                        <td className="p-3 text-red-500">{item.exp_date || '-'}</td>
                                    </tr>
                                ))}
                                {stocks.filter(s => s.type === 'Fertilizer').length === 0 && (
                                    <tr><td colSpan="4" className="p-4 text-center text-gray-400">No stock available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Add New Stock</h3>
                            <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select name="type" className="w-full p-2 border rounded" value={formData.type} onChange={handleChange}>
                                        <option value="Pesticide">Pesticide</option>
                                        <option value="Fertilizer">Fertilizer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Item Name</label>
                                    <input type="text" name="name" required className="w-full p-2 border rounded" value={formData.name} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Size (e.g. 1L, 50Kg)</label>
                                    <input type="text" name="size" required className="w-full p-2 border rounded" value={formData.size} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input type="number" name="quantity" required className="w-full p-2 border rounded" value={formData.quantity} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mfg Date</label>
                                    <input type="date" name="mfg_date" className="w-full p-2 border rounded" value={formData.mfg_date} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Exp Date</label>
                                    <input type="date" name="exp_date" className="w-full p-2 border rounded" value={formData.exp_date} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Buyer Name (Source)</label>
                                <input type="text" name="buyer_name" className="w-full p-2 border rounded" value={formData.buyer_name} onChange={handleChange} />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Stock</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stock;
