import React from "react";
import { X, Clock3, ChefHat, UserRound, Star } from "lucide-react";

export default function RecipeModal({ recipe, onClose, onRate, user, onFavorite, favorite }) {
  if (!recipe) return null;
  const ratings = Object.values(recipe.ratings || {});
  const average = ratings.length ? ratings.reduce((a, b) => a + Number(b), 0) / ratings.length : 0;
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <article className="recipe-modal">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X /></button>
        <img className="modal-photo" src={recipe.image} alt={recipe.title} onError={e => e.currentTarget.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"} />
        <div className="modal-content">
          <div className="eyebrow">{recipe.category} · {recipe.difficulty}</div>
          <h2>{recipe.title}</h2>
          <p className="modal-description">{recipe.description}</p>
          <div className="recipe-meta"><span><Clock3 size={16}/>{recipe.time}</span><span><ChefHat size={16}/>{recipe.difficulty}</span><span><UserRound size={16}/>{recipe.author}</span></div>
          <div className="rating-line"><span className="stars"><Star size={16} fill="currentColor"/> {average ? average.toFixed(1) : "New"}</span><span className="muted">{ratings.length} rating{ratings.length === 1 ? "" : "s"}</span></div>
          <div className="modal-actions">
            <button className={`button ${favorite ? "button-dark" : "button-outline"}`} onClick={onFavorite}>{favorite ? "♥ Saved" : "♡ Save recipe"}</button>
            <div className="rate-control"><span>Rate this recipe</span><div>{[1,2,3,4,5].map(n => <button key={n} className={`star-button ${Number(recipe.ratings?.[user.email]) >= n ? "selected" : ""}`} onClick={() => onRate(n)} aria-label={`Rate ${n} stars`}><Star size={20} fill="currentColor"/></button>)}</div></div>
          </div>
          <div className="recipe-columns">
            <section><h3>Ingredients</h3><ul className="ingredient-list">{recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}</ul></section>
            <section><h3>Method</h3><ol className="steps-list">{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol></section>
          </div>
        </div>
      </article>
    </div>
  );
}