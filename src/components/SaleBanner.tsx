export default function SaleBanner() {
  return (
    <div className="bg-red text-white grid grid-cols-1 md:grid-cols-[1fr_auto] items-center px-8 py-10 md:px-16 gap-8">
      <div>
        <p className="eyebrow !text-white/70 !mb-2">✦ Limited Time</p>
        <h3 className="font-serif text-[clamp(26px,3vw,44px)] font-light leading-tight">
          RAMADAN SALE — UP TO 40% OFF
        </h3>
        <p className="text-[11px] tracking-[2px] opacity-70 mt-1 uppercase">
          Free delivery over PKR 5,000
        </p>
      </div>
      <button className="btn-white">SHOP THE SALE</button>
    </div>
  );
}
