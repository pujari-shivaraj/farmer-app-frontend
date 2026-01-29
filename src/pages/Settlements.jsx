import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Calculator, CheckCircle, AlertTriangle } from 'lucide-react';

const Settlements = () => {
    const [farmers, setFarmers] = useState([]);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Settlement Form
    const [calcData, setCalcData] = useState({
        total_cultivation_qty: '',
        approved_qty: '',
        rate_per_kg: ''
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        api.get('/farmers').then(res => setFarmers(res.data));
    }, []);

    const handleCalculate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/payments/preview_settlement', null, {
                params: {
                    farmer_id: selectedFarmer.id,
                    total_cultivation_qty: calcData.total_cultivation_qty,
                    approved_qty: calcData.approved_qty,
                    rate_per_kg: calcData.rate_per_kg
                }
            });
            setPreview(res.data);
        } catch (err) {
            alert("Calculation Error: " + err.message);
        }
    };

    const handleSettle = async () => {
        try {
            await api.post('/payments/settle', {
                ...preview,
                total_cultivation_qty: calcData.total_cultivation_qty,
                approved_qty: calcData.approved_qty,
                rate_per_kg: calcData.rate_per_kg,
                payment_mode: 'Bank Transfer' // Default or add selection
            });
            alert("Payment Settled Successfully!");
            setPreview(null);
            setCalcData({ total_cultivation_qty: '', approved_qty: '', rate_per_kg: '' });
            setSelectedFarmer(null);
        } catch (err) {
            alert("Settlement Failed");
        }
    };

    const filteredFarmers = searchTerm ? farmers.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-gray-800 mb-4">1. Select Farmer</h3>
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
                            <div key={f.id} onClick={() => { setSelectedFarmer(f); setSearchTerm(''); setPreview(null); }} className="p-2 hover:bg-gray-50 cursor-pointer border-b">
                                {f.name}
                            </div>
                        ))}
                    </div>
                )}
                {selectedFarmer && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-800">{selectedFarmer.name}</h4>
                        <p className="text-sm text-green-700">ID: {selectedFarmer.id}</p>
                        <p className="text-xs text-green-600">Bank: {selectedFarmer.bank_name || 'N/A'}</p>
                    </div>
                )}
            </div>

            <div className={`lg:col-span-2 space-y-6 ${!selectedFarmer ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Calculator className="mr-2 text-blue-600" /> Payment Calculation
                    </h3>
                    <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Received Qty</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                required
                                value={calcData.total_cultivation_qty}
                                onChange={e => setCalcData({ ...calcData, total_cultivation_qty: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Approved Qty</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                required
                                value={calcData.approved_qty}
                                onChange={e => setCalcData({ ...calcData, approved_qty: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rate per Kg</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                required
                                value={calcData.rate_per_kg}
                                onChange={e => setCalcData({ ...calcData, rate_per_kg: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Calculate Payment</button>
                        </div>
                    </form>
                </div>

                {preview && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Settlement Summary</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-lg">
                                <span className="text-gray-600">Gross Amount</span>
                                <span className="font-bold text-gray-800">₹ {preview.gross_amount.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between items-center text-red-600">
                                <span className="flex items-center"><AlertTriangle size={16} className="mr-2" /> Sales Deduction</span>
                                <span>- ₹ {preview.total_sales_deduction.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-red-600">
                                <span className="flex items-center"><AlertTriangle size={16} className="mr-2" /> Advance Deduction</span>
                                <span>- ₹ {preview.total_advances_deduction.toLocaleString()}</span>
                            </div>

                            <div className="border-t border-gray-300 pt-3 flex justify-between items-center text-xl text-green-700 font-extrabold">
                                <span>Net Payable</span>
                                <span>₹ {preview.net_payable_amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSettle}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold shadow-lg flex justify-center items-center text-lg"
                        >
                            <CheckCircle className="mr-2" />
                            Confirm & Settle Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settlements;
