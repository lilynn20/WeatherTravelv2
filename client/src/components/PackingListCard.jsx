import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const PackingListCard = ({ city, mode = 'full' }) => {
  const [packingList, setPackingList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (city) {
      fetchPackingList();
    }
  }, [city, mode]);

  const fetchPackingList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/analytics/packing/${city}?mode=${mode}`
      );
      // Map API response to expected format
      const { packingList } = response.data;
      const essentialsArray = packingList.essentials 
        ? Object.values(packingList.essentials).flat()
        : [];
      
      setPackingList({
        categories: {
          essentials: essentialsArray,
          clothing: packingList.clothing || [],
          gear: [
            ...(packingList.weatherGear || []),
            ...(packingList.activityGear || [])
          ]
        }
      });
      setCheckedItems({});
    } catch (err) {
      setError('Failed to fetch packing list');
    }
    setLoading(false);
  };

  const handleCheckItem = (item) => {
    setCheckedItems({
      ...checkedItems,
      [item]: !checkedItems[item],
    });
  };

  if (!city) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Liste de bagages pour {city}
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-1 rounded-lg text-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition"
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded mb-4">
          {error}
        </div>
      )}

      {isExpanded && packingList && (
        <div className="space-y-4">
          {packingList.categories &&
            Object.entries(packingList.categories).map(([category, items]) => (
              <div key={category} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 capitalize">
                  {category}
                </h4>
                <div className="space-y-2">
                  {Array.isArray(items) &&
                    items.map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems[item] || false}
                          onChange={() => handleCheckItem(item)}
                          className="rounded"
                        />
                        <span
                          className={
                            checkedItems[item]
                              ? 'line-through text-slate-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }
                        >
                          {item}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PackingListCard;
