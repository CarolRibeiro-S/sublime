import DrinkMenu from "@/components/drinks/DrinkMenu";
import TimelineHistoria from "@/components/drinks/TimelineHistoria";

export default function DrinksPage() {
  return (
    <div className="pt-32">
      <h1 className="text-center text-3xl">Drinks</h1>
      <DrinkMenu />
      <TimelineHistoria />
    </div>
  );
}
