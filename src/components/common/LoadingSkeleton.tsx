import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded-md" />
        <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl space-y-2 animate-pulse"
        >
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-7 w-12 bg-slate-300 dark:bg-slate-700 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="p-4"><div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" /></td>
      <td className="p-4"><div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
      <td className="p-4"><div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" /></td>
      <td className="p-4"><div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded" /></td>
      <td className="p-4"><div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded" /></td>
      <td className="p-4"><div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" /></td>
    </tr>
  );
};
