import React from 'react';
import { IndianRupee, Calendar, CheckCircle, Receipt, TrendingUp } from 'lucide-react';
import { DuesSummary } from './types';
import { formatCurrency } from '@/utils/formatters';

interface SummaryCardsProps {
  duesSummary: DuesSummary;
  bookingsCount: number;
  onPaymentHistoryClick: () => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  duesSummary,
  bookingsCount,
  onPaymentHistoryClick
}) => {
  const cards = [
    {
      title: "Total Due to Clinzor",
      value: formatCurrency(duesSummary.total_dues),
      icon: IndianRupee,
      gradient: "from-blue-500 to-indigo-600",
      trend: { icon: TrendingUp, color: "text-blue-600", text: "Outstanding" }
    },
    {
      title: "Total Bookings",
      value: bookingsCount.toString(),
      icon: Calendar,
      gradient: "from-green-500 to-emerald-600",
      trend: { icon: TrendingUp, color: "text-green-600", text: "Bookings" }
    },
    {
      title: "Total Paid to Clinzor",
      value: formatCurrency(duesSummary.total_paid),
      icon: CheckCircle,
      gradient: "from-emerald-500 to-green-600",
      trend: { icon: TrendingUp, color: "text-emerald-600", text: "Collected" }
    },
    {
      title: "Payment History",
      value: "View",
      icon: Receipt,
      gradient: "from-purple-500 to-pink-600",
      trend: { icon: TrendingUp, color: "text-purple-600", text: "History" },
      clickable: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trend.icon;
        
        return (
          <div
            key={index}
            className={`group bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
              card.clickable ? 'cursor-pointer' : ''
            }`}
            onClick={card.clickable ? onPaymentHistoryClick : undefined}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 bg-gradient-to-r ${card.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base text-slate-600 font-semibold mb-1">{card.title}</p>
                <p className="text-lg sm:text-[22px] font-bold text-slate-900">{card.value}</p>
              </div>
            </div>
            <div className="flex items-center">
              <TrendIcon className={`w-5 h-5 ${card.trend.color} mr-2`} />
              <span className={`text-sm sm:text-base ${card.trend.color} font-semibold`}>{card.trend.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;