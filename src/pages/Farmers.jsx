import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, MapPin, Phone, User, Sprout } from 'lucide-react';

const Farmers = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        village: '',
        aadhaar: '',
        mobile: '',
        sowing_acre: '',
        seed_packets: '',
        account_number: '',
        ifsc_code: '',
        bank_name: ''
    });

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        try {
            const response = await api.get('/farmers');
            setFarmers(response.data);
        } catch (error) {
            console.error("Error fetching farmers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/farmers', formData);
            setShowModal(false);
            fetchFarmers(); // Refresh list
            setFormData({
                name: '', village: '', aadhaar: '', mobile: '',
                sowing_acre: '', seed_packets: '', account_number: '',
                ifsc_code: '', bank_name: ''
            });
        } catch (error) {
            alert("Error adding farmer: " + (error.response?.data?.detail || error.message));
        }
    };

    const filteredFarmers = farmers.filter(farmer =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.village.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Farmers Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Farmer
                </button>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search by name or village..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFarmers.map(farmer => (
                        <div key={farmer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                        {farmer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{farmer.name}</h3>
                                        <p className="text-xs text-gray-500">ID: {farmer.id}</p>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{farmer.sowing_acre} Acre</span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                    {farmer.village}
                                </div>
                                <div className="flex items-center">
                                    <Phone size={16} className="mr-2 text-gray-400" />
                                    {farmer.mobile}
                                </div>
                                <div className="flex items-center">
                                    <User size={16} className="mr-2 text-gray-400" />
                                    Aadhaar: {farmer.aadhaar}
                                </div>
                                <div className="flex items-center">
                                    <Sprout size={16} className="mr-2 text-gray-400" />
                                    Seeds: {farmer.seed_packets} pkts
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredFarmers.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No farmers found.
                        </div>
                    )}
                </div>
            )}

            {/* Add Farmer Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Add New Farmer</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Personal Details</h4>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="name" required className="w-full p-2 border rounded-lg" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                                <input type="text" name="village" required className="w-full p-2 border rounded-lg" value={formData.village} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                                <input type="text" name="aadhaar" required className="w-full p-2 border rounded-lg" value={formData.aadhaar} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <input type="text" name="mobile" required className="w-full p-2 border rounded-lg" value={formData.mobile} onChange={handleInputChange} />
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Cultivation Details</h4>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sowing Acre</label>
                                <input type="number" step="0.01" name="sowing_acre" required className="w-full p-2 border rounded-lg" value={formData.sowing_acre} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seed Packets Used</label>
                                <input type="number" name="seed_packets" required className="w-full p-2 border rounded-lg" value={formData.seed_packets} onChange={handleInputChange} />
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Bank Details (Optional)</h4>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                <input type="text" name="bank_name" className="w-full p-2 border rounded-lg" value={formData.bank_name} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                <input type="text" name="account_number" className="w-full p-2 border rounded-lg" value={formData.account_number} onChange={handleInputChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                <input type="text" name="ifsc_code" className="w-full p-2 border rounded-lg" value={formData.ifsc_code} onChange={handleInputChange} />
                            </div>

                            <div className="md:col-span-2 mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Farmer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Farmers;
