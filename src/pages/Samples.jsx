import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, FlaskConical, CheckCircle, XCircle } from 'lucide-react';

const Samples = () => {
    const [farmers, setFarmers] = useState([]);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [samples, setSamples] = useState([]);

    // New Sample Form
    const [formData, setFormData] = useState({
        crop_type: '',
        sample_qty: ''
    });

    // Update Status State
    const [editingSample, setEditingSample] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({
        status: 'Approved',
        grade: 'A',
        approved_qty: 0
    });

    useEffect(() => {
        api.get('/farmers').then(res => setFarmers(res.data));
    }, []);

    useEffect(() => {
        if (selectedFarmer) fetchSamples();
    }, [selectedFarmer]);

    const fetchSamples = async () => {
        const res = await api.get(`/samples/farmer/${selectedFarmer.id}`);
        setSamples(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/samples', { ...formData, farmer_id: selectedFarmer.id });
            setFormData({ crop_type: '', sample_qty: '' });
            fetchSamples();
        } catch (err) {
            alert("Error creating sample");
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/samples/${editingSample.id}`, statusUpdate);
            setEditingSample(null);
            fetchSamples();
        } catch (err) {
            alert("Error updating status");
        }
    };

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
                                {f.name}
                            </div>
                        ))}
                    </div>
                )}
                {selectedFarmer && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-800">{selectedFarmer.name}</h4>
                        <p className="text-sm text-purple-700">ID: {selectedFarmer.id}</p>
                    </div>
                )}
            </div>

            <div className={`lg:col-span-2 space-y-6 ${!selectedFarmer ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Add Sample */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <FlaskConical className="mr-2 text-purple-600" /> Collect Sample
                    </h3>
                    <form onSubmit={handleCreate} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Crop Type</label>
                            <input type="text" className="w-full p-2 border rounded" required value={formData.crop_type} onChange={e => setFormData({ ...formData, crop_type: e.target.value })} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Sample Qty (Kg)</label>
                            <input type="number" className="w-full p-2 border rounded" required value={formData.sample_qty} onChange={e => setFormData({ ...formData, sample_qty: e.target.value })} />
                        </div>
                        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Submit</button>
                    </form>
                </div>

                {/* Samples List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Sample History</h3>
                    <div className="space-y-4">
                        {samples.map(sample => (
                            <div key={sample.id} className="border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800">{sample.crop_type}</p>
                                    <p className="text-sm text-gray-500">Date: {sample.sample_date} | Qty: {sample.sample_qty} Kg</p>
                                    <div className="mt-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${sample.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                sample.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {sample.status}
                                        </span>
                                        {sample.status === 'Approved' && (
                                            <span className="ml-2 text-xs text-gray-600">
                                                Grade: {sample.grade} | Approved: {sample.approved_qty} Kg
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {sample.status === 'Pending' && (
                                    <button
                                        onClick={() => { setEditingSample(sample); setStatusUpdate({ status: 'Approved', grade: 'A', approved_qty: sample.sample_qty }) }}
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Update Status
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {editingSample && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Update Sample Result</h3>
                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Testing Status</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={statusUpdate.status}
                                    onChange={e => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                >
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {statusUpdate.status === 'Approved' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Quality Grade</label>
                                        <select
                                            className="w-full p-2 border rounded"
                                            value={statusUpdate.grade}
                                            onChange={e => setStatusUpdate({ ...statusUpdate, grade: e.target.value })}
                                        >
                                            <option value="A">Grade A</option>
                                            <option value="B">Grade B</option>
                                            <option value="C">Grade C</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Approved Quantity (Kg)</label>
                                        <input
                                            type="number"
                                            className="w-full p-2 border rounded"
                                            value={statusUpdate.approved_qty}
                                            onChange={e => setStatusUpdate({ ...statusUpdate, approved_qty: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={() => setEditingSample(null)} className="px-4 py-2 text-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Result</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Samples;
