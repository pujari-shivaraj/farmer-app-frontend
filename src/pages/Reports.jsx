import React, { useState } from 'react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('daily');

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports Module</h2>

            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`py-2 px-4 font-medium transition-colors ${activeTab === 'daily' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Daily Report
                </button>
                <button
                    onClick={() => setActiveTab('stock')}
                    className={`py-2 px-4 font-medium transition-colors ${activeTab === 'stock' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Stock Report
                </button>
                <button
                    onClick={() => setActiveTab('payment')}
                    className={`py-2 px-4 font-medium transition-colors ${activeTab === 'payment' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Payment Report
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-gray-400">
                {activeTab === 'daily' && "Daily transaction summary will appear here."}
                {activeTab === 'stock' && "Detailed stock movement report will appear here."}
                {activeTab === 'payment' && "Payment history and pending settlements report will appear here."}
                {/* 
                For a real app, I would fetch data here.
                Since this is getting large, I'll keep it as placeholder or simple text.
            */}
            </div>
        </div>
    );
};

export default Reports;
