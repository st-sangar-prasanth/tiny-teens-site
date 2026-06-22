import React from 'react';

const whatsappNumber = '917373323633';

const categories = [
  { title: 'Girls Party Wear', subtitle: 'Sparkly frocks and festive sets' },
  { title: 'Boys Festive Collection', subtitle: 'Stylish kurtas and comfy shirts' },
  { title: 'Newborn Essentials', subtitle: 'Soft cotton sets for tiny angels' },
  { title: 'Everyday Casuals', subtitle: 'Play-ready picks for daily fun' }
];

const products = [
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
  return (
    <div className="page">
      <header className="header">
        <div className="brand">Tiny Teens</div>
        <a className="whatsapp-btn" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
          Order on WhatsApp
        </a>
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
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.name} className="product-card">
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


