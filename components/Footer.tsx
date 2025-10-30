import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Demo: store locally and show success message
    try {
      const list = JSON.parse(localStorage.getItem('newsletter') || '[]');
      if (!list.includes(email)) {
        list.push(email);
        localStorage.setItem('newsletter', JSON.stringify(list));
      }
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.warn('Could not save subscription locally', err);
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white text-lg font-semibold mb-3">PopBasket</h4>
          <p className="text-sm text-gray-400">Curated goods, thoughtful prices. Shop electronics, home goods, books and more — all in one place.</p>
          <div className="mt-4 flex items-center gap-3">
            <a aria-label="Twitter" href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M22 5.92c-.64.28-1.33.47-2.05.55.74-.45 1.3-1.17 1.57-2.03-.69.41-1.46.72-2.27.88A3.5 3.5 0 0 0 12.7 8.5c0 .27.03.53.08.78C8.4 9.03 5.07 7.13 2.9 4.15c-.29.5-.46 1.08-.46 1.7 0 1.17.6 2.2 1.52 2.8-.56-.02-1.08-.17-1.54-.42v.04c0 1.64 1.17 3.01 2.72 3.32-.28.08-.58.12-.88.12-.22 0-.44-.02-.65-.06.44 1.36 1.72 2.35 3.24 2.38A7.03 7.03 0 0 1 2 19.54 9.9 9.9 0 0 0 7.29 21c8.76 0 13.56-7.3 13.56-13.62v-.62A9.6 9.6 0 0 0 22 5.92z"/></svg>
            </a>
            <a aria-label="Facebook" href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.12 8.44 9.92v-7.02H7.9v-2.9h2.54V9.41c0-2.5 1.5-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.86h2.74l-.44 2.9h-2.3V22c4.78-.8 8.44-4.93 8.44-9.93z"/></svg>
            </a>
            <a aria-label="Instagram" href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 5.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm5.5-.75a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.5 6.75zM12 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3">Shop</h5>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">All Products</a></li>
            <li><a href="#" className="hover:text-white">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white">Best Sellers</a></li>
            <li><a href="#" className="hover:text-white">Gift Cards</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3">Company</h5>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
            <li><a href="#" className="hover:text-white">Affiliates</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-3">Get updates</h5>
          <p className="text-sm text-gray-400 mb-3">Subscribe to our newsletter for deals and product updates.</p>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2">
            <input
              aria-label="Email for newsletter"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 rounded-md bg-gray-800 placeholder-gray-400 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-indigo-600"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-md text-white font-medium hover:bg-indigo-500">Subscribe</button>
          </form>
          {subscribed && <p className="mt-2 text-sm text-green-400">Thanks — you're subscribed!</p>}
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} PopBasket. All rights reserved.</p>
          <div className="mt-3 md:mt-0 flex items-center gap-4">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Help</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
