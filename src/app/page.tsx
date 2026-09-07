import Becoming from "@/components/Becoming";
import GlobeLoader from "@/components/Globe/GlobeLoader";

export default function Home() {
  return (
    <main className="stage relative w-full overflow-hidden bg-black">
      <GlobeLoader />
      <Becoming />
    </main>
  );
}
