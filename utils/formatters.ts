import * as LucideIcons from 'lucide-react';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusConfig = (status: string) => {
  const statusConfigs: Record<string, { color: string; dot: string; icon: string }> = {
    COMPLETED: {
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: 'CheckCircle'
    },
    PENDING: {
      color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      dot: 'bg-amber-500',
      icon: 'Clock'
    },
    CREATED: {
      color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      dot: 'bg-amber-500',
      icon: 'Clock'
    },
    FAILED: {
      color: 'bg-red-500/10 text-red-700 border-red-500/20',
      dot: 'bg-red-500',
      icon: 'AlertCircle'
    },
    ACTIVE: {
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      dot: 'bg-emerald-500',
      icon: 'CheckCircle'
    },
    INACTIVE: {
      color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
      dot: 'bg-slate-500',
      icon: 'Clock'
    },
    SUSPENDED: {
      color: 'bg-red-500/10 text-red-700 border-red-500/20',
      dot: 'bg-red-500',
      icon: 'AlertCircle'
    },
    NEW: {
      color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      dot: 'bg-blue-500',
      icon: 'Clock'
    },
    CANCELLED: {
      color: 'bg-red-500/10 text-red-700 border-red-500/20',
      dot: 'bg-red-500',
      icon: 'X'
    }
  };

  return statusConfigs[status] || {
    color: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
    dot: 'bg-slate-500',
    icon: 'AlertCircle'
  };
};

// Helper function to get the icon component
export const getStatusIcon = (iconName: string): React.ComponentType<any> => {
  return LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any> || LucideIcons.AlertCircle;
};