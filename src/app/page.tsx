import Becoming from "@/components/Becoming";
import GlobeLoader from "@/components/Globe/GlobeLoader";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-black">
      <GlobeLoader />
      <Becoming />
    </main>
  );
}
