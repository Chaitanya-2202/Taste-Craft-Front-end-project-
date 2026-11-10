import React, { useMemo, useState } from "react";
import { Search, Plus, Heart, Clock3, Star, SlidersHorizontal, ChefHat, X, Camera, Utensils, LogOut, LayoutDashboard, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import RecipeModal from "../components/RecipeModal.jsx";
import { starterRecipes } from "../data/recipes.js";

const RECIPES_KEY = "tastecraft_recipes_v1";
const FAV_KEY = "tastecraft_favorites_v1";
function readRecipes() {
  try { const saved = localStorage.getItem(RECIPES_KEY); return saved ? JSON.parse(saved) : starterRecipes; }
  catch { return starterRecipes; }
}

export default function HomePage({ onAdmin }) {
  const { user, logout } = useAuth();
  const [recipes, setRecipes] = useState(readRecipes);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem(FAV_KEY) || "{}"));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All recipes");
  const [activeTab, setActiveTab] = useState("discover");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Dinner", time: "20 min", difficulty: "Easy", image: "", description: "", ingredients: "", steps: "" });
  const [formError, setFormError] = useState("");

  function updateRecipes(next) { setRecipes(next); localStorage.setItem(RECIPES_KEY, JSON.stringify(next)); }
  function toggleFavorite(id) {
    const next = { ...favorites, [user.email]: { ...(favorites[user.email] || {}) } };
    if (next[user.email][id]) delete next[user.email][id]; else next[user.email][id] = true;
    setFavorites(next); localStorage.setItem(FAV_KEY, JSON.stringify(next));
  }
  function rateRecipe(id, score) {
    const next = recipes.map(r => r.id === id ? { ...r, ratings: { ...(r.ratings || {}), [user.email]: score } } : r);
    updateRecipes(next); setSelected(next.find(r => r.id === id));
  }
  function addRecipe(e) {
    e.preventDefault(); setFormError("");
    const ingredients = form.ingredients.split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
    const steps = form.steps.split("\n").map(x => x.trim()).filter(Boolean);
    if (!ingredients.length || !steps.length) { setFormError("Add ingredients separated by commas and at least one method step."); return; }
    const recipe = { ...form, id: crypto.randomUUID(), image: form.image.trim() || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85", ingredients, steps, author: user.name, authorEmail: user.email, ratings: {}, createdAt: Date.now() };
    updateRecipes([recipe, ...recipes]); setShowAdd(false); setForm({ title: "", category: "Dinner", time: "20 min", difficulty: "Easy", image: "", description: "", ingredients: "", steps: "" }); setActiveTab("discover"); setQuery("");
  }

  const categories = ["All recipes", "Breakfast", "Lunch", "Dinner", "Healthy", "Dessert", "Drinks"];
  const filtered = useMemo(() => recipes.filter(r => {
    const matchesCategory = category === "All recipes" || r.category === category;
    const matchesTab = activeTab !== "favorites" || Boolean(favorites[user.email]?.[r.id]);
    const words = query.toLowerCase().split(",").map(x => x.trim()).filter(Boolean);
    const searchable = [r.title, r.description, r.category, ...(r.ingredients || [])].join(" ").toLowerCase();
    const matchesSearch = !words.length || words.every(word => searchable.includes(word));
    return matchesCategory && matchesTab && matchesSearch;
  }), [recipes, category, activeTab, favorites, user.email, query]);

  return (
    <div className="site-shell">
      <header className="topbar"><div className="topbar-inner">
        <a className="brand" href="#"><span className="brand-mark"><ChefHat size={22}/></span><span>TasteCraft<span className="brand-dot">.</span></span></a>
        <nav className="main-nav"><button className={activeTab === "discover" ? "nav-active" : ""} onClick={() => setActiveTab("discover")}>Discover</button><button className={activeTab === "favorites" ? "nav-active" : ""} onClick={() => setActiveTab("favorites")}>My favourites</button></nav>
        <div className="topbar-user"><span className="avatar">{user.name.slice(0,1).toUpperCase()}</span><span className="user-name">{user.name}</span>{user.role === "admin" && <button className="admin-nav" onClick={onAdmin}><LayoutDashboard size={16}/> Admin</button>}<button className="icon-button logout-button" onClick={logout} title="Log out"><LogOut size={18}/></button></div>
      </div></header>

      <main>
        <section className="hero">
          <div className="hero-copy"><div className="eyebrow hero-eyebrow"><Sparkles size={15}/> A LITTLE INSPIRATION FOR EVERY MEAL</div><h1>Find your next<br/><em>favourite</em> flavour.</h1><p>Good recipes are better when they're shared. Explore the community, try something new, and add a little magic to your table.</p>
            <div className="hero-actions"><button className="button button-primary" onClick={() => document.getElementById("recipe-library")?.scrollIntoView({ behavior: "smooth" })}>Explore recipes <ArrowIcon/></button><button className="button button-outline" onClick={() => setShowAdd(true)}><Plus size={18}/> Share a recipe</button></div>
            <div className="hero-note"><span className="tiny-avatars"><i>🍋</i><i>🥑</i><i>🍓</i></span><span>Made by food lovers, for food lovers</span></div>
          </div>
          <div className="hero-image-wrap"><img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85" alt="Freshly prepared food" onError={e => e.currentTarget.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85"}/><div className="hero-image-tag"><span>✦</span><div><strong>Cook something lovely</strong><small>One recipe at a time</small></div></div></div>
        </section>

        <section className="community-strip"><div><span className="strip-icon"><BookOpen size={19}/></span><span><strong>{recipes.length} recipes</strong><small>and growing every day</small></span></div><div><span className="strip-icon"><Heart size={19}/></span><span><strong>Made to share</strong><small>Save the ones you love</small></span></div><div><span className="strip-icon"><Star size={19}/></span><span><strong>Your voice matters</strong><small>Rate every recipe you try</small></span></div></section>

        <section className="library-section" id="recipe-library">
          <div className="section-heading"><div><div className="eyebrow">THE COMMUNITY TABLE</div><h2>{activeTab === "favorites" ? "Your saved recipes" : "Explore the recipe box"}</h2><p>Search by recipe name or type ingredients like <b>tomato, paneer, garlic</b>.</p></div><button className="button button-primary add-recipe-top" onClick={() => setShowAdd(true)}><Plus size={18}/> Add a recipe</button></div>
          <div className="search-toolbar"><div className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes or ingredients (e.g. paneer, tomato)"/>{query && <button onClick={() => setQuery("")}><X size={16}/></button>}</div><div className="filter-label"><SlidersHorizontal size={16}/> Filter</div></div>
          <div className="category-row">{categories.map(c => <button key={c} className={`category-chip ${category === c ? "chip-active" : ""}`} onClick={() => setCategory(c)}>{c}</button>)}</div>
          {filtered.length ? <div className="recipe-grid">{filtered.map(recipe => {
            const ratings = Object.values(recipe.ratings || {}); const avg = ratings.length ? ratings.reduce((a,b) => a + Number(b),0) / ratings.length : 0;
            return <article className="recipe-card" key={recipe.id}>
              <button className="recipe-photo-button" onClick={() => setSelected(recipe)}><img className="recipe-photo" src={recipe.image} alt={recipe.title} onError={e => e.currentTarget.src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80"}/><span className="photo-category">{recipe.category}</span></button>
              <button className={`favorite-button ${favorites[user.email]?.[recipe.id] ? "is-favorite" : ""}`} onClick={() => toggleFavorite(recipe.id)} aria-label="Toggle favourite"><Heart size={18} fill={favorites[user.email]?.[recipe.id] ? "currentColor" : "none"}/></button>
              <div className="recipe-card-body"><div className="recipe-card-meta"><span><Clock3 size={14}/>{recipe.time}</span><span className="card-rating"><Star size={14} fill="currentColor"/>{avg ? avg.toFixed(1) : "New"}{ratings.length ? ` (${ratings.length})` : ""}</span></div><button className="recipe-title-button" onClick={() => setSelected(recipe)}>{recipe.title}</button><p>{recipe.description}</p><div className="card-bottom"><span>By {recipe.author}</span><button onClick={() => setSelected(recipe)}>View recipe <ArrowIcon/></button></div></div>
            </article>;
          })}</div> : <div className="empty-state"><div>🥣</div><h3>No recipes found</h3><p>Try another ingredient or category, or be the first to add a recipe.</p><button className="button button-primary" onClick={() => {setQuery("");setCategory("All recipes");setActiveTab("discover");}}>Show all recipes</button></div>}
        </section>
      </main>
      <footer className="footer"><a className="brand" href="#"><span className="brand-mark"><ChefHat size={20}/></span><span>TasteCraft<span className="brand-dot">.</span></span></a><span>Good food brings people together. © 2026 TasteCraft</span><span>Cook · Share · Connect</span></footer>

      {selected && <RecipeModal recipe={selected} user={user} onClose={() => setSelected(null)} onRate={n => rateRecipe(selected.id, n)} favorite={Boolean(favorites[user.email]?.[selected.id])} onFavorite={() => toggleFavorite(selected.id)}/>}
      {showAdd && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowAdd(false)}><section className="add-modal"><button className="icon-button modal-close" onClick={() => setShowAdd(false)}><X/></button><div className="eyebrow">PASS IT AROUND</div><h2>Share your recipe</h2><p className="muted">Add your own kitchen favourite to the community cookbook.</p>
        <form className="add-form" onSubmit={addRecipe}>
          <label>Recipe name<input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="e.g. Grandma's vegetable pulao"/></label>
          <div className="form-two"><label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{["Breakfast","Lunch","Dinner","Healthy","Dessert","Drinks"].map(x => <option key={x}>{x}</option>)}</select></label><label>Cooking time<input value={form.time} onChange={e => setForm({...form,time:e.target.value})} placeholder="20 min" required/></label></div>
          <div className="form-two"><label>Difficulty<select value={form.difficulty} onChange={e => setForm({...form,difficulty:e.target.value})}>{["Easy","Medium","Hard"].map(x => <option key={x}>{x}</option>)}</select></label><label>Photo URL <span className="optional">(optional)</span><input value={form.image} onChange={e => setForm({...form,image:e.target.value})} placeholder="Paste an image link"/></label></div>
          <label>Short description<textarea required rows="2" value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="What makes this recipe special?"/></label>
          <label>Ingredients <span className="optional">(separate with commas)</span><textarea required rows="2" value={form.ingredients} onChange={e => setForm({...form,ingredients:e.target.value})} placeholder="rice, paneer, tomato, onion..."/></label>
          <label>Method <span className="optional">(one step per line)</span><textarea required rows="4" value={form.steps} onChange={e => setForm({...form,steps:e.target.value})} placeholder={"Wash and prepare the ingredients.\nCook until tender.\nServe and enjoy!"}/></label>
          {formError && <div className="form-error">{formError}</div>}
          <button className="button button-primary button-wide" type="submit"><Plus size={18}/> Publish recipe</button>
        </form>
      </section></div>}
    </div>
  );
}
function ArrowIcon() { return <span className="arrow-right">↗</span>; }