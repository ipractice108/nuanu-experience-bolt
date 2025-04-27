import React from 'react';
import { Category } from '../types';
import { Palette, BookOpen, Heart, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'art', label: 'Art', icon: <Palette className="w-6 h-6" /> },
  { id: 'education', label: 'Education', icon: <BookOpen className="w-6 h-6" /> },
  { id: 'wellness', label: 'Wellness', icon: <Heart className="w-6 h-6" /> },
  { id: 'creative', label: 'Creative', icon: <Sparkles className="w-6 h-6" /> },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-3 rounded-full transition-all ${
          selectedCategory === null
            ? 'bg-nuanu text-white'
            : 'bg-white text-gray-600 hover:bg-nuanu/10'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
            selectedCategory === category.id
              ? 'bg-nuanu text-white'
              : 'bg-white text-gray-600 hover:bg-nuanu/10'
          }`}
        >
          {category.icon}
          {category.label}
        </button>
      ))}
    </div>
  );
}