import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Context/AppContext';
import {
  GraduationCap,
  Filter,
  IndianRupee,
  Calendar,
  ArrowRight,
  Plane,
  BookOpen,
  Building,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const SchemesPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');

  const schemesList = [
    {
      id: 'nfst',
      title: 'National Fellowship for Scheduled Tribe (NFST)',
      subtitle: 'Ph.D. & M.Phil. Research Fellowship (India)',
      category: 'Fellowship',
      grant: '₹31,000 / month + HRA',
      incomeLimit: 'No Limit',
      lastDate: '30 Sep 2026',
      eligibility: 'ST students pursuing regular M.Phil / Ph.D.',
      status: 'Open',
      icon: GraduationCap,
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'nos',
      title: 'National Overseas Scholarship (NOS)',
      subtitle: "Master's & Ph.D. Programmes Abroad",
      category: 'Overseas',
      grant: '$15,400 / year + Tuition Fee',
      incomeLimit: '₹6,00,000 / yr',
      lastDate: '15 Oct 2026',
      eligibility: 'Minimum 55% marks in Bachelor/Master degree',
      status: 'Open',
      icon: Plane,
      iconBg: 'bg-sky-100 text-sky-600',
    },
    {
      id: 'post-matric',
      title: 'Post-Matric Scholarship for ST Students',
      subtitle: 'Higher Studies in Recognized Institutions in India',
      category: 'Post-Matric',
      grant: 'Full Tuition Fee + Maintenance',
      incomeLimit: '₹2,50,000 / yr',
      lastDate: '31 Dec 2026',
      eligibility: 'ST candidates studying Class 11th through Post-Graduation',
      status: 'Open',
      icon: BookOpen,
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'pre-matric',
      title: 'Pre-Matric Scholarship for ST Students',
      subtitle: 'For Secondary School Education (Class 9 & 10)',
      category: 'Pre-Matric',
      grant: '₹3,500 / year + Books Allowance',
      incomeLimit: '₹2,50,000 / yr',
      lastDate: '15 Nov 2026',
      eligibility: 'ST students studying in Class 9th or 10th',
      status: 'Open',
      icon: Building,
      iconBg: 'bg-emerald-100 text-emerald-700',
    }
  ];

  const categories = ['All', 'Fellowship', 'Overseas', 'Post-Matric', 'Pre-Matric'];

  const filteredSchemes = schemesList.filter((scheme) => {
    return selectedCategory === 'All' || scheme.category === selectedCategory;
  });

  return (
    <>
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold text-emerald-200 mb-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Government of India Scholarship Schemes
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Ministry of Tribal Affairs Schemes</h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            Explore government-funded scholarships designed for higher education, research, and skill building.
          </p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-2 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredSchemes.length}</span> schemes
        </p>
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredSchemes.map((scheme) => {
          const Icon = scheme.icon;
          return (
            <div key={scheme.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6">
              
              {/* Card Header & Information */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${scheme.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {scheme.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{scheme.title}</h3>
                      <p className="text-xs text-slate-500">{scheme.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Financial Assistance</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <IndianRupee className="w-3 h-3 text-emerald-600" /> {scheme.grant}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Annual Income Ceiling</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">{scheme.incomeLimit}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p><span className="font-semibold text-slate-800">Eligibility:</span> {scheme.eligibility}</p>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deadline: <span className="font-bold text-slate-800">{scheme.lastDate}</span></span>
                </div>

                <button
                  onClick={() => navigate(`/student/apply/${scheme.id}`)}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-700/20"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
};

export default SchemesPage;