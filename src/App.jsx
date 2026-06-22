import React, { useEffect, useState } from 'react';

const whatsappNumber = '917373323633';

const categories = [
  { title: 'Girls Party Wear', subtitle: 'Sparkly frocks and festive sets' },
  { title: 'Boys Festive Collection', subtitle: 'Stylish kurtas and comfy shirts' },
  { title: 'Newborn Essentials', subtitle: 'Soft cotton sets for tiny angels' },
  { title: 'Everyday Casuals', subtitle: 'Play-ready picks for daily fun' }
];

const fallbackProducts = [
  {
    name: 'Floral Frill Dress',
    price: 'INR 999',
    badge: 'Best Seller',
    image:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Denim Dungaree Set',
    price: 'INR 1,299',
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Princess Tulle Gown',
    price: 'INR 1,799',
    badge: 'Trending',
    image:
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Classic Ethnic Kurta',
    price: 'INR 1,199',
    badge: 'Limited',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Sample dress',
    price: 'INR 1,199',
    badge: 'Limited',
    image:
      '/images/one.jpg'
  },
  {
    name: 'Shorts - pyjamas',
    price: 'INR 150',
    badge: 'Limited',
    image:
      '/images/two.jpg'
  }
];

const testimonials = [
  {
    text: 'Great fabric quality and super cute designs. My daughter loved every dress!',
    author: 'Keerthi, Chennai'
  },
  {
    text: 'Quick delivery and perfect fit. Tiny Teens has become our go-to kids store.',
    author: 'Ramesh, Coimbatore'
  }
];

export default function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.location.hash === '#admin';
  });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [adminToken, setAdminToken] = useState('');
  const [password, setPassword] = useState('');
  const [draftProducts, setDraftProducts] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [status, setStatus] = useState('');

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      const nextProducts = Array.isArray(data.products) && data.products.length > 0
        ? data.products
        : fallbackProducts;
      setProducts(nextProducts);
    } catch {
      setProducts(fallbackProducts);
      setStatus('Could not load products from API. Showing fallback data.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      // Force password entry each time admin page is opened.
      setAdminToken('');
      setPassword('');
      setRemovedIds([]);
      setDraftProducts(
        products.map((item, index) => ({
          id: item.id || null,
          tempId: `temp-${item.id || index}`,
          name: item.name || '',
          price: item.price || '',
          badge: item.badge || '',
          image: item.image || '',
          imageFile: null
        }))
      );
      setStatus('');
    }
  }, [isAdmin, products]);

  const updateDraftProduct = (index, field, value) => {
    setDraftProducts((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addProduct = () => {
    setDraftProducts((current) => [
      ...current,
      {
        id: null,
        tempId: `temp-new-${Date.now()}`,
        name: `New Product ${current.length + 1}`,
        price: 'INR 0',
        badge: 'New',
        image: '/images/one.jpg',
        imageFile: null
      }
    ]);
    setStatus('Product added. Save changes to publish.');
  };

  const removeProduct = (index) => {
    setDraftProducts((current) => {
      const item = current[index];
      if (item?.id) {
        setRemovedIds((existing) => [...existing, item.id]);
      }
      return current.filter((_, i) => i !== index);
    });
    setStatus('Product removed. Save changes to publish.');
  };

  const loginAdmin = async (event) => {
    event.preventDefault();
    setStatus('Checking password...');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!response.ok) {
        throw new Error('Invalid password');
      }
      const data = await response.json();
      setAdminToken(data.token || '');
      setPassword('');
      setStatus('Login successful. You can now edit products.');
    } catch {
      setStatus('Invalid admin password.');
    }
  };

  const saveProducts = async () => {
    if (!adminToken) {
      setStatus('Please login with admin password first.');
      return;
    }

    try {
      setStatus('Saving changes...');

      for (const id of removedIds) {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (!response.ok && response.status !== 404) {
          throw new Error('Delete failed');
        }
      }

      for (const product of draftProducts) {
        if (!product.name || !product.price || !product.badge) {
          throw new Error('Fill all product fields before saving');
        }

        const form = new FormData();
        form.append('name', product.name);
        form.append('price', product.price);
        form.append('badge', product.badge);
        form.append('image', product.image);
        if (product.imageFile) {
          form.append('imageFile', product.imageFile);
        }

        const endpoint = product.id ? `/api/admin/products/${product.id}` : '/api/admin/products';
        const method = product.id ? 'PUT' : 'POST';

        const response = await fetch(endpoint, {
          method,
          headers: { Authorization: `Bearer ${adminToken}` },
          body: form
        });
        if (!response.ok) {
          throw new Error('Save failed');
        }
      }

      await loadProducts();
      setRemovedIds([]);
      setStatus('Changes saved to database.');
    } catch {
      setStatus('Save failed. Please re-login and check all fields.');
    }
  };

  if (isAdmin) {
    return (
      <div className="page admin-page">
        <header className="header">
          <div className="brand">Tiny Teens Admin</div>
          <div className="header-actions">
            <a className="admin-link" href="#">
              Back to Store
            </a>
          </div>
        </header>

        <p className="admin-help">Login to edit products stored in database.</p>

        {!adminToken ? (
          <form className="admin-login-card" onSubmit={loginAdmin}>
            <h3>Admin Login</h3>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button className="btn-primary" type="submit">
              Login
            </button>
          </form>
        ) : (
          <>
            <div className="admin-actions">
              <button className="btn-primary" type="button" onClick={addProduct}>
                Add Product
              </button>
              <button className="btn-secondary" type="button" onClick={saveProducts}>
                Save Changes
              </button>
            </div>

            <section className="admin-product-list">
              {draftProducts.map((product, index) => (
                <article key={product.id || product.tempId} className="admin-product-card">
                  <div className="admin-card-head">
                    <h3>Product {index + 1}</h3>
                    <button
                      className="btn-secondary admin-link danger"
                      type="button"
                      onClick={() => removeProduct(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <label>
                    Name
                    <input
                      type="text"
                      value={product.name}
                      onChange={(event) => updateDraftProduct(index, 'name', event.target.value)}
                    />
                  </label>
                  <label>
                    Price
                    <input
                      type="text"
                      value={product.price}
                      onChange={(event) => updateDraftProduct(index, 'price', event.target.value)}
                    />
                  </label>
                  <label>
                    Badge
                    <input
                      type="text"
                      value={product.badge}
                      onChange={(event) => updateDraftProduct(index, 'badge', event.target.value)}
                    />
                  </label>
                  <label>
                    Image URL
                    <input
                      type="text"
                      value={product.image}
                      onChange={(event) => updateDraftProduct(index, 'image', event.target.value)}
                    />
                  </label>
                  <label>
                    Or Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        updateDraftProduct(index, 'imageFile', event.target.files?.[0] || null)
                      }
                    />
                  </label>
                </article>
              ))}
            </section>
          </>
        )}

        {status && <p className="admin-status">{status}</p>}
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">Tiny Teens</div>
        <div className="header-actions">
          <a className="admin-link" href="#admin">
            Admin
          </a>
          <a className="whatsapp-btn" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            Order on WhatsApp
          </a>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="pill">Inspired by premium kids fashion storefronts</p>
          <h1>Adorable styles for tiny trendsetters.</h1>
          <p className="hero-copy">
            Discover playful, comfy, and occasion-ready outfits for babies, kids, and pre-teens.
            Fresh arrivals every week with easy WhatsApp ordering.
          </p>
          <div className="hero-actions">
            <a className="btn-primary" href="#products">Shop Collection</a>
            <a className="btn-secondary" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
              Chat: 7373323633
            </a>
          </div>
        </div>
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80"
          alt="Kids fashion"
        />
      </section>

      <section className="section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.title} className="category-card">
              <h3>{category.title}</h3>
              <p>{category.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="products">
        <div className="section-head">
          <h2>Popular Picks</h2>
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
            View full catalog on WhatsApp
          </a>
        </div>
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <article key={product.id || product.name} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <span className="badge">{product.badge}</span>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                  <a href={`https://wa.me/${whatsappNumber}?text=Hi%20Tiny%20Teens,%20I%20want%20to%20buy%20${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer">
                    Enquire Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section testimonials">
        <h2>Happy Parents</h2>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <blockquote key={item.author}>
              “{item.text}”
              <cite>{item.author}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      <footer className="footer">
        <h3>Tiny Teens</h3>
        <p>Trendy kidswear for every little celebration.</p>
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
          WhatsApp: 7373323633
        </a>
      </footer>
    </div>
  );
}


