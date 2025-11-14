import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recipeAPI } from '../../services/recipeAPI';

const RecipeStats = () => {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await recipeAPI.getRecipeStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recipe Statistics</h3>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Recipe Statistics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">{stats.totalRecipes}</div>
          <div className="text-sm text-gray-600">Total Recipes</div>
        </div>
        
        {stats.categoryStats.map((category) => (
          <div key={category._id} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{category.count}</div>
            <div className="text-sm text-gray-600">{category._id}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Difficulty Distribution</h4>
        {stats.difficultyStats.map((difficulty) => (
          <div key={difficulty._id} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{difficulty._id}</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ 
                    width: `${(difficulty.count / stats.totalRecipes) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium w-8">{difficulty.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeStats;