import React, { useState } from 'react';
import { Experience, Category } from '../types';
import { CategoryFilter } from './CategoryFilter';
import { ExperienceCard } from './ExperienceCard';
import { useExperiences } from '../hooks/useExperiences';

export function ExperienceList() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showPaidOnly, setShowPaidOnly] = useState<boolean | null>(null);
  // Pass false to get only free experiences when showPaidOnly is false
  const { experiences, loading, error } = useExperiences(showPaidOnly === null ? undefined : showPaidOnly);

  const filteredExperiences = experiences
    .filter((exp) => selectedCategory ? exp.category === selectedCategory : true);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nuanu"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg overflow-hidden">
          <button
            onClick={() => setShowPaidOnly(null)}
            className={`px-8 py-4 text-lg font-medium transition-all ${
              showPaidOnly === null
                ? 'bg-nuanu text-white'
                : 'bg-white text-gray-600 hover:bg-nuanu/10'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setShowPaidOnly(false)}
            className={`px-8 py-4 text-lg font-medium transition-all ${
              showPaidOnly === false
                ? 'bg-nuanu text-white'
                : 'bg-white text-gray-600 hover:bg-nuanu/10'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setShowPaidOnly(true)}
            className={`px-8 py-4 text-lg font-medium transition-all ${
              showPaidOnly === true
                ? 'bg-nuanu text-white'
                : 'bg-white text-gray-600 hover:bg-nuanu/10'
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperiences.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}

        {filteredExperiences.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">
              {showPaidOnly === false 
                ? "No free experiences available"
                : showPaidOnly === true
                ? "No paid experiences available"
                : "No experiences found"}
            </p>
          </div>
        )}
      </div>
    </>
  );
}