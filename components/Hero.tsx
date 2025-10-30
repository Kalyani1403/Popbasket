import React from 'react';

interface HeroProps {
  onShopNowClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNowClick }) => {
  // Custom animation classes
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-bounce-slow {
        animation: bounce-slow 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <section className="relative w-full min-h-[85vh] bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 overflow-hidden">
      {/* Radial glow effect */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl transform -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text */}
          <div className="text-white z-10 relative">
            <div className="mb-6 inline-block">
              <span className="inline-block bg-yellow-300 text-gray-900 rounded-full px-5 py-2 font-medium text-sm shadow-lg">
                🔥 50% Off Festive Sale!
              </span>
            </div>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
              Premium Tech,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">
                Unbeatable Prices.
              </span>
            </h1>
            
            <p className="mt-8 text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed">
              Discover the latest in cutting-edge electronics and accessories, delivered right to your door.
            </p>

            <div className="mt-10">
              <button
                onClick={onShopNowClick}
                className="inline-flex items-center gap-3 bg-white/95 text-purple-700 font-semibold rounded-lg px-8 py-4 shadow-xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
              >
                <span>Shop Now</span>
              </button>
            </div>
          </div>

          {/* Right - Image */}
          <div className="flex items-center justify-center relative z-10">
            <div className="relative w-full max-w-lg xl:max-w-xl">
              {/* Background card effect */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl transform rotate-6 scale-105" />
              
              {/* Main image container */}
              <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm p-2 transform hover:scale-[1.02] transition-transform duration-500">
                <div className="relative">
                  <img
                    src="/img/hero-banner.jpg"
                    alt="Shopping cart on laptop with products"
                    className="w-full h-auto rounded-xl shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))'
                    }}
                  />
                  {/* Decorative floating elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full animate-bounce-slow opacity-75" />
                  <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-purple-300 rounded-full animate-float opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
