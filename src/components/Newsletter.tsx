export default function Newsletter() {
  return (
    <div className="bg-black text-white grid grid-cols-1 md:grid-cols-2 min-h-[360px] overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
          alt="Newsletter"
          className="w-full h-full object-cover absolute inset-0"
        />
      </div>
      <div className="px-12 py-16 flex flex-col justify-center">
        <p className="text-[10px] tracking-[4px] text-gold uppercase mb-4">
          ✦ Stay in Touch
        </p>
        <h3 className="font-serif text-[clamp(28px,3vw,44px)] font-light mb-3 leading-tight">
          Join Our Inner Circle
        </h3>
        <p className="text-[12px] text-white/50 leading-relaxed mb-8 font-light">
          Be the first to know about new collections, exclusive offers, and behind-the-scenes stories.
        </p>
        <div className="flex max-w-[400px]">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3 bg-white/8 border border-white/15 border-r-0 text-white font-sans text-[12px] outline-none placeholder:text-white/30"
          />
          <button className="bg-gold text-white px-5 py-3 text-[10px] tracking-[2.5px] uppercase cursor-pointer font-sans whitespace-nowrap transition-colors hover:bg-gold-light border-none">
            SUBSCRIBE
          </button>
        </div>
        <p className="text-[10px] text-white/25 mt-3 tracking-[0.3px]">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
