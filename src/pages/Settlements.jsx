import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, Calculator, CheckCircle, AlertTriangle } from 'lucide-react';

const Settlements = () => {
    const [farmers, setFarmers] = useState([]);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Settlement Form - removed approved_qty from manual input
    const [calcData, setCalcData] = useState({
        total_cultivation_qty: '',
        rate_per_kg: ''
    });

    const [preview, setPreview] = useState(null);
    const [approvedSample, setApprovedSample] = useState(null);

    useEffect(() => {
        api.get('/farmers').then(res => setFarmers(res.data));
    }, []);

    // Fetch approved sample when farmer is selected
    useEffect(() => {
        const fetchApprovedSample = async () => {
            if (selectedFarmer) {
                try {
                    const res = await api.get(`/samples/farmer/${selectedFarmer.id}`);
                    const approved = res.data.find(s => s.status === 'Approved');
                    setApprovedSample(approved || null);
                } catch (err) {
                    console.error('Error fetching samples:', err);
                    setApprovedSample(null);
                }
            } else {
                setApprovedSample(null);
            }
        };
        fetchApprovedSample();
    }, [selectedFarmer]);

    const handleCalculate = async (e) => {
        e.preventDefault();
        try {
            // approved_qty is now auto-fetched by the backend
            const res = await api.post('/payments/preview_settlement', null, {
                params: {
                    farmer_id: selectedFarmer.id,
                    total_cultivation_qty: calcData.total_cultivation_qty,
                    rate_per_kg: calcData.rate_per_kg
                    // approved_qty removed - backend fetches it automatically
                }
            });
            setPreview(res.data);
        } catch (err) {
            alert("Calculation Error: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleSettle = async () => {
        try {
            await api.post('/payments/settle', {
                ...preview,
                payment_mode: 'Bank Transfer' // Default or add selection
            });
            alert("Payment Settled Successfully!");
            setPreview(null);
            setCalcData({ total_cultivation_qty: '', rate_per_kg: '' });
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
                    <div className="space-y-3">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-bold text-green-800">{selectedFarmer.name}</h4>
                            <p className="text-sm text-green-700">ID: {selectedFarmer.id}</p>
                            <p className="text-xs text-green-600">Bank: {selectedFarmer.bank_name || 'N/A'}</p>
                        </div>

                        {approvedSample ? (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-bold text-blue-800 mb-2">✅ Approved Sample</h4>
                                <div className="text-sm space-y-1">
                                    <p className="text-blue-700">
                                        <span className="font-medium">Crop:</span> {approvedSample.crop_type}
                                    </p>
                                    <p className="text-blue-700">
                                        <span className="font-medium">Grade:</span> {approvedSample.grade || 'N/A'}
                                    </p>
                                    <p className="text-blue-800 font-bold text-lg mt-2">
                                        Approved Qty: {approvedSample.approved_qty} kg
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-red-700 text-sm">⚠️ No approved sample found for this farmer</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={`lg:col-span-2 space-y-6 ${!selectedFarmer ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <Calculator className="mr-2 text-blue-600" /> Payment Calculation
                    </h3>
                    <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium mb-1">Rate per Kg</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                required
                                value={calcData.rate_per_kg}
                                onChange={e => setCalcData({ ...calcData, rate_per_kg: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Calculate Payment</button>
                        </div>
                    </form>
                </div>

                {preview && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-fade-in">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Settlement Summary</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <span className="text-blue-700 font-medium">Approved Qty (Auto-fetched)</span>
                                <span className="font-bold text-blue-800">{preview.approved_qty} kg</span>
                            </div>

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
