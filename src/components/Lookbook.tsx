import Link from "next/link";

export default function Lookbook() {
  return (
    <div className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
        <Link
          href="/necklaces"
          className="lk-card relative overflow-hidden cursor-pointer aspect-[4/5] md:aspect-auto block"
        >
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
            alt="Lookbook"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/65 to-transparent text-white">
            <p className="font-serif text-[17px] font-light">The Crystal Edit</p>
            <span className="text-[10px] tracking-[2px] text-gold-light uppercase">
              Discover Now
            </span>
          </div>
        </Link>

        <div className="grid grid-rows-2 gap-[3px]">
          <Link
            href="/rings"
            className="lk-sub relative overflow-hidden cursor-pointer aspect-[16/9] md:aspect-auto block"
          >
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80"
              alt="Rings"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/65 to-transparent text-white">
              <p className="font-serif text-[17px] font-light">Rings</p>
              <span className="text-[10px] tracking-[2px] text-gold-light uppercase">
                Shop Now
              </span>
            </div>
          </Link>
          <Link
            href="/earrings"
            className="lk-sub relative overflow-hidden cursor-pointer aspect-[16/9] md:aspect-auto block"
          >
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
              alt="Earrings"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/65 to-transparent text-white">
              <p className="font-serif text-[17px] font-light">Earrings</p>
              <span className="text-[10px] tracking-[2px] text-gold-light uppercase">
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
