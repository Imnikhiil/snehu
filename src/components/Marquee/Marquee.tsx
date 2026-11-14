/** Slowly scrolling text band between chapters (CSS only). */
export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <div className="marquee__row" key={k}>
            {items.map((t, i) => (
              <span key={i}>{t}<i>✦</i></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}