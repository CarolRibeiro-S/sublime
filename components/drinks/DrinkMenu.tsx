import Image from "next/image";

type Drink = {
  name: string;
  image: string;
  badge?: string;
  ingredients?: string[];
};

const FEATURED_DRINK: Drink = {
  name: "Hibis",
  image: "/images/hibis-autoral.jpg",
  badge: "Autoral Sublime",
  ingredients: [
    "Gin",
    "Suco de limão",
    "Xarope de hibisco",
    "Licor de laranja",
    "Espuma cítrica de hibisco",
  ],
};

const OTHER_DRINKS: Drink[] = [
  { name: "Negroni", image: "/images/negroni.jpg" },
  { name: "Fitzgerald", image: "/images/fitzgerald.jpg" },
  {
    name: "Soda Italiana (Não Alcoólica)",
    image: "/images/soda-italiana-nao-alcoolica.jpg",
  },
];

function IngredientList({ ingredients }: { ingredients: string[] }) {
  return (
    <p className="mt-4 max-w-md text-center text-xs tracking-widest text-[var(--color-text-secondary)]">
      {ingredients.map((ingredient, index) => (
        <span key={ingredient}>
          {ingredient}
          {index < ingredients.length - 1 && (
            <span className="mx-3 text-[var(--color-gold)]">•</span>
          )}
        </span>
      ))}
    </p>
  );
}

function DrinkCard({ drink }: { drink: Drink }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-[var(--color-gold)] bg-[var(--color-bg)]">
        <Image
          src={drink.image}
          alt={drink.badge ? `${drink.name}, ${drink.badge}` : drink.name}
          fill
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
        {drink.badge && (
          <span className="absolute left-3 top-3 rounded-sm border border-[var(--color-gold)] bg-[var(--color-bg)]/80 px-3 py-1 text-[10px] tracking-widest text-[var(--color-gold)]">
            {drink.badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-center font-[family-name:var(--font-heading)] text-xl text-[var(--color-gold)]">
        {drink.name}
      </h3>
      {drink.ingredients && <IngredientList ingredients={drink.ingredients} />}
    </div>
  );
}

export default function DrinkMenu() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-start-2">
          <DrinkCard drink={FEATURED_DRINK} />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
        {OTHER_DRINKS.map((drink) => (
          <DrinkCard key={drink.name} drink={drink} />
        ))}
      </div>
    </section>
  );
}
