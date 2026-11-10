import React, { useState } from "react";
import { ArrowLeft, ChefHat, LogOut, Trash2, Users, BookOpen, Star, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { starterRecipes } from "../data/recipes.js";

export default function AdminDashboard({ onBack }) {
  const { users, logout } = useAuth();
  const [recipes, setRecipes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tastecraft_recipes_v1")) || starterRecipes; } catch { return starterRecipes; }
  });
  const [search, setSearch] = useState("");
  function removeRecipe(id) {
    if (!window.confirm("Delete this recipe from TasteCraft?")) return;
    const next = recipes.filter(r => r.id !== id); setRecipes(next); localStorage.setItem("tastecraft_recipes_v1", JSON.stringify(next));
  }
  const totalRatings = recipes.reduce((sum, r) => sum + Object.keys(r.ratings || {}).length, 0);
  return <div className="admin-page"><header className="admin-top"><a className="brand" href="#"><span className="brand-mark"><ChefHat size={22}/></span><span>TasteCraft<span className="brand-dot">.</span></span></a><div className="admin-top-actions"><span className="admin-pill">ADMIN PANEL</span><button className="icon-button" onClick={onBack} title="Back to site"><ArrowLeft/></button><button className="icon-button" onClick={logout} title="Log out"><LogOut/></button></div></header>
    <main className="admin-main"><div className="eyebrow">YOUR KITCHEN, YOUR COMMUNITY</div><h1>Admin dashboard</h1><p className="muted">Overview and recipe moderation for your TasteCraft community.</p>
      <div className="admin-stats"><div className="admin-stat"><span><BookOpen/></span><div><strong>{recipes.length}</strong><small>Total recipes</small></div></div><div className="admin-stat"><span><Users/></span><div><strong>{users.length}</strong><small>Registered accounts</small></div></div><div className="admin-stat"><span><Star/></span><div><strong>{totalRatings}</strong><small>Community ratings</small></div></div></div>
      <section className="admin-table-section"><div className="admin-table-heading"><div><h2>Recipe management</h2><p className="muted">Review recipes shared by the community.</p></div><div className="admin-search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a recipe"/></div></div>
        <div className="table-wrap"><table><thead><tr><th>Recipe</th><th>Category</th><th>Created by</th><th>Ratings</th><th>Action</th></tr></thead><tbody>{recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase())).map(r => <tr key={r.id}><td><div className="admin-recipe-cell"><img src={r.image} alt=""/><strong>{r.title}</strong></div></td><td>{r.category}</td><td>{r.author}</td><td>{Object.keys(r.ratings || {}).length}</td><td><button className="delete-button" onClick={() => removeRecipe(r.id)}><Trash2 size={16}/> Delete</button></td></tr>)}</tbody></table>{!recipes.length && <div className="empty-table">No recipes to display.</div>}</div>
      </section>
      <section className="admin-note"><strong>Demo storage note</strong><p>This version saves accounts, recipes and ratings in this browser's local storage. It is suitable for a local project demo. For real multi-device users, secure authentication and shared data, connect a backend such as Firebase or Supabase.</p></section>
    </main>
  </div>;
}