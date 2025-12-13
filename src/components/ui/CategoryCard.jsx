// frontend/src/components/ui/CategoryCard.jsx
import React from 'react';

export default function CategoryCard({ icon, title }) {
  return (
    <div className="panel-card rounded-md p-4 min-h-[84px] flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div className="font-medium text-white">{title}</div>
    </div>
  );
}
