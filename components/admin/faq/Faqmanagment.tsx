import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Sparkles, MoreVertical } from 'lucide-react';

// FAQ type for better type safety
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQAdminPanel = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "a9a37e85-b1fa-4eab-bd00-b8a3563f3fdf",
      question: "How do I get started with your platform?",
      answer: "Getting started is simple! Sign up for an account, complete the onboarding process, and you'll have access to all our features within minutes."
    },
    {
      id: "e568b634-910c-4f37-81da-0407364b930b",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers for enterprise customers."
    },
    {
      id: "f568b634-910c-4f37-81da-0407364b931c",
      question: "Is there a mobile app available?",
      answer: "Yes! Our mobile apps are available on both iOS and Android. Download them from the App Store or Google Play Store."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ question: '', answer: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ question: '', answer: '' });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null); // For delete animation

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setEditForm({ question: faq.question, answer: faq.answer });
    setActiveDropdown(null);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    setFaqs(faqs.map(faq =>
      faq.id === editingId
        ? { ...faq, question: editForm.question, answer: editForm.answer }
        : faq
    ));
    setEditingId(null);
    setEditForm({ question: '', answer: '' });
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ question: '', answer: '' });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setFaqs(faqs.filter(faq => faq.id !== id));
    setActiveDropdown(null);
    setIsLoading(false);
    setTimeout(() => setDeletingId(null), 400); // Wait for animation to finish
  };

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newFaq: FAQ = {
      id: Date.now().toString(),
      question: createForm.question,
      answer: createForm.answer
    };
    setFaqs([newFaq, ...faqs]);
    setCreateForm({ question: '', answer: '' });
    setShowCreateForm(false);
    setIsLoading(false);
  };

  const handleCancelCreate = () => {
    setCreateForm({ question: '', answer: '' });
    setShowCreateForm(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 animate-fadein">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 gap-4 md:gap-0">
            <div className="space-y-2 w-full md:w-auto">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                  FAQ Management
                </h1>
              </div>
              <p className="text-base md:text-lg text-gray-500 ml-12 md:ml-14">Create and manage your frequently asked questions</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="group relative overflow-hidden px-5 md:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold w-full md:w-auto"
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add FAQ
              </div>
            </button>
          </div>

          {/* Enhanced Search */}
          <div className="relative max-w-full md:max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/90 rounded-2xl border border-white/20 shadow-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search through your knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-base md:text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg md:max-w-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Create New FAQ</h2>
                </div>
                <button
                  onClick={handleCancelCreate}
                  className="p-3 hover:bg-gray-100/80 rounded-2xl transition-all duration-200 group"
                >
                  <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
                </button>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 tracking-wide">QUESTION</label>
                  <input
                    type="text"
                    value={createForm.question}
                    onChange={(e) => setCreateForm({ ...createForm, question: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200 text-base md:text-lg"
                    placeholder="What would you like to know?"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 tracking-wide">ANSWER</label>
                  <textarea
                    value={createForm.answer}
                    onChange={(e) => setCreateForm({ ...createForm, answer: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none transition-all duration-200 text-base md:text-lg"
                    placeholder="Provide a helpful and detailed answer..."
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-end md:space-x-4 space-y-2 md:space-y-0 p-6 md:p-8 border-t border-gray-100/50 bg-gray-50/30">
                <button
                  onClick={handleCancelCreate}
                  className="px-6 py-3 text-gray-600 hover:bg-white/80 rounded-xl transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!createForm.question || !createForm.answer || isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold transform hover:scale-105"
                >
                  {isLoading ? 'Creating...' : 'Create FAQ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="relative max-w-6xl mx-auto p-2 sm:p-4 md:p-8">
        <div className="grid gap-4 md:gap-6">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <div className="relative mx-auto mb-8 w-20 h-20 md:w-24 md:h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                <div className="relative backdrop-blur-xl bg-white/90 rounded-full flex items-center justify-center w-full h-full border border-white/20">
                  <Search className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-500">Try adjusting your search or create a new FAQ</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`group relative transition-all duration-400 ease-in-out ${deletingId === faq.id ? 'opacity-0 -translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'} animate-in slide-in-from-bottom duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {editingId === faq.id ? (
                    <div className="p-4 md:p-8">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700 tracking-wide">QUESTION</label>
                          <input
                            type="text"
                            value={editForm.question}
                            onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                            className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200 text-base md:text-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700 tracking-wide">ANSWER</label>
                          <textarea
                            value={editForm.answer}
                            onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none transition-all duration-200 text-base md:text-lg"
                          />
                        </div>
                        <div className="flex flex-col md:flex-row justify-end md:space-x-4 space-y-2 md:space-y-0 pt-4">
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-200 font-semibold"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            disabled={isLoading}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold transform hover:scale-105"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 md:p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2 md:gap-0">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 leading-tight pr-4">{faq.question}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveDropdown(faq.id)}
                            className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-200 font-semibold"
                          >
                            <Search className="w-4 h-4 mr-1" /> Read
                          </button>
                          <button
                            onClick={() => handleEdit(faq)}
                            className="flex items-center px-3 py-2 text-emerald-600 hover:bg-emerald-50/80 rounded-xl transition-all duration-200 font-semibold"
                          >
                            <Edit2 className="w-4 h-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            disabled={isLoading}
                            className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 font-semibold disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 leading-relaxed break-words">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enhanced Stats Footer */}
      <div className="relative mt-10 md:mt-20 backdrop-blur-xl bg-white/60 border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8 text-sm gap-2 md:gap-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span className="text-gray-600 font-medium">
                {faqs.length} FAQ{faqs.length !== 1 ? 's' : ''} total
              </span>
            </div>
            {searchTerm && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                <span className="text-gray-600 font-medium">
                  {filteredFaqs.length} matching search
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-white/90 rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Read Modal */}
      {activeDropdown && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg md:max-w-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
            <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">FAQ Details</h2>
                </div>
                <button
                  onClick={() => setActiveDropdown(null)}
                  className="p-3 hover:bg-gray-100/80 rounded-2xl transition-all duration-200 group"
                >
                  <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
                </button>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 tracking-wide">QUESTION</label>
                  <div className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl text-base md:text-lg">
                    {faqs.find(f => f.id === activeDropdown)?.question}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 tracking-wide">ANSWER</label>
                  <div className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200/50 rounded-2xl text-base md:text-lg">
                    {faqs.find(f => f.id === activeDropdown)?.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page fade-in animation */}
      <style jsx global>{`
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FAQAdminPanel;