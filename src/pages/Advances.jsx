import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Banknote, History } from 'lucide-react';

const Advances = () => {
    const [farmers, setFarmers] = useState([]);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        api.get('/farmers').then(res => setFarmers(res.data));
    }, []);

    useEffect(() => {
        if (selectedFarmer) {
            fetchHistory();
        }
    }, [selectedFarmer]);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/advances/farmer/${selectedFarmer.id}`);
            setHistory(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/advances', {
                farmer_id: selectedFarmer.id,
                amount: parseFloat(amount),
                notes: notes
            });
            alert("Advance Recorded!");
            setAmount('');
            setNotes('');
            fetchHistory();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    // Filter logic
    const filteredFarmers = searchTerm ? farmers.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-gray-800 mb-4">Select Farmer</h3>
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search Farmer..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                {searchTerm && (
                    <div className="max-h-60 overflow-y-auto mb-4 border rounded">
                        {filteredFarmers.map(f => (
                            <div key={f.id} onClick={() => { setSelectedFarmer(f); setSearchTerm(''); }} className="p-2 hover:bg-gray-50 cursor-pointer border-b">
                                {f.name} <span className="text-gray-400 text-xs">({f.village})</span>
                            </div>
                        ))}
                    </div>
                )}

                {selectedFarmer && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-bold text-yellow-800">{selectedFarmer.name}</h4>
                        <p className="text-sm text-yellow-700">ID: {selectedFarmer.id}</p>
                        <button onClick={() => setSelectedFarmer(null)} className="text-xs text-red-500 mt-2 hover:underline">Change Farmer</button>
                    </div>
                )}
            </div>

            <div className={`lg:col-span-2 space-y-6 ${!selectedFarmer ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Banknote className="mr-2 text-green-600" /> Give Advance
                    </h3>
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                required
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
                            Record
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <History className="mr-2 text-gray-500" /> Advance History
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(h => (
                                    <tr key={h.id} className="border-b">
                                        <td className="p-3">{h.date}</td>
                                        <td className="p-3 font-semibold text-red-600">- ₹{h.amount}</td>
                                        <td className="p-3 text-gray-500">{h.notes || '-'}</td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr><td colSpan="3" className="p-4 text-center text-gray-400">No history found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Advances;
