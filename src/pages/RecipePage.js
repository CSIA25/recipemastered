import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase authentication
import "./RecipePage.css";

const RecipePage = () => {
  const [ingredients, setIngredients] = useState(""); // State for ingredient input
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]); // Autocomplete suggestions
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Selected ingredients
  const [categories, setCategories] = useState([]); // Categories list
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [recipes, setRecipes] = useState([]); // Recipe list
  const [favorites, setFavorites] = useState([]); // User's favorite recipes
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }

    // Fetch categories from API on component load
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        setCategories([{ strCategory: "All" }, ...categoryResponse.data.categories]); // Adding "All" category
      } catch (err) {
        setError("Error fetching categories");
        console.error(err);
      }
    };

    fetchCategories();

    // Retrieve saved favorite recipes from localStorage on load
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, [navigate]);

  // Function to fetch meal suggestions based on ingredient query
  const fetchIngredientSuggestions = async (query) => {
    if (!query) return;

    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
      );
      const ingredientList = response.data.meals || [];
      const filteredSuggestions = ingredientList.filter((ingredient) =>
        ingredient.strIngredient.toLowerCase().includes(query.toLowerCase())
      );
      setIngredientSuggestions(filteredSuggestions);
    } catch (err) {
      console.error("Error fetching ingredient suggestions:", err);
    }
  };

  // Function to handle ingredient selection
  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients((prevIngredients) => [
      ...prevIngredients,
      ingredient.strIngredient,
    ]);
    setIngredients(""); // Clear input field
    setIngredientSuggestions([]); // Clear suggestions
  };

  // Function to handle removing an ingredient
  const handleRemoveIngredient = (ingredient) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.filter((ing) => ing !== ingredient)
    );
  };

  // Function to handle clearing all selected ingredients
  const handleClearIngredients = () => {
    setSelectedIngredients([]); // Clear all selected ingredients
  };

  // Function to handle search recipes
  const handleSearchRecipes = async (e) => {
    e.preventDefault();
    const ingredientsQuery = selectedIngredients.join(", "); // Join selected ingredients

    const categoryQuery = selectedCategory && selectedCategory !== "All" ? `&c=${selectedCategory}` : "";

    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientsQuery}${categoryQuery}`
      );
      setRecipes(response.data.meals || []);
    } catch (err) {
      setError("Error fetching recipes, please try again.");
      console.error(err);
    }
  };

  // Function to toggle a recipe as favorite
  const toggleFavorite = (recipe) => {
    const updatedFavorites = [...favorites];
    const index = updatedFavorites.findIndex(
      (fav) => fav.idMeal === recipe.idMeal
    );

    if (index > -1) {
      updatedFavorites.splice(index, 1); // Remove from favorites if already added
    } else {
      updatedFavorites.push(recipe); // Add to favorites if not already added
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
  };

  return (
    <div className="recipe-container">
      <h2>Find Recipes</h2>

      {/* Ingredient input field */}
      <input
        type="text"
        placeholder="Enter ingredients..."
        value={ingredients}
        onChange={(e) => {
          setIngredients(e.target.value);
          fetchIngredientSuggestions(e.target.value); // Fetch suggestions as user types
        }}
      />

      {/* Ingredient Suggestions */}
      {ingredientSuggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {ingredientSuggestions.map((ingredient) => (
            <li
              key={ingredient.strIngredient}
              onClick={() => handleIngredientSelect(ingredient)}
            >
              {ingredient.strIngredient}
              <img
                src={`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`}
                alt={ingredient.strIngredient}
                className="ingredient-image"
              />
            </li>
          ))}
        </ul>
      )}

      {/* Selected ingredients display */}
      <div className="selected-ingredients">
        <strong>Selected Ingredients:</strong>
        {selectedIngredients.map((ingredient, index) => (
          <span key={index} className="ingredient-tag">
            {ingredient}
            <img
              src={`https://www.themealdb.com/images/ingredients/${ingredient}.png`}
              alt={ingredient}
              className="ingredient-image"
            />
            <button
              className="remove-ingredient"
              onClick={() => handleRemoveIngredient(ingredient)}
            >
              Remove
            </button>
          </span>
        ))}
      </div>

      {/* Category Filters */}
      <div className="filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.strCategory} value={category.strCategory}>
              {category.strCategory}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button onClick={handleSearchRecipes}>Search Recipes</button>

      {/* Clear Ingredients Button */}
      <button onClick={handleClearIngredients} className="clear-button">
        Clear Ingredients
      </button>

      {/* Display Recipes */}
      {recipes.length > 0 && (
        <div className="recipe-list">
          <h3>Recipes you can make:</h3>
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.idMeal}>
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="recipe-image"
                />
                <strong>{recipe.strMeal}</strong> -{" "}
                <a
                  href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Recipe
                </a>
                <button
                  onClick={() => toggleFavorite(recipe)}
                  className={`favorite-btn ${
                    favorites.some((fav) => fav.idMeal === recipe.idMeal)
                      ? "favorited"
                      : ""
                  }`}
                >
                  {favorites.some((fav) => fav.idMeal === recipe.idMeal)
                    ? "Unfavorite"
                    : "Favorite"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Display Favorite Recipes */}
      {favorites.length > 0 && (
        <div className="favorite-recipes">
          <h3>Your Favorite Recipes:</h3>
          <ul>
            {favorites.map((recipe) => (
              <li key={recipe.idMeal}>
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="recipe-image"
                />
                <strong>{recipe.strMeal}</strong> -{" "}
                <a
                  href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Recipe
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
