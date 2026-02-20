import Link from "next/link";
import FuzzyText from "@/components/FuzzyText";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
        404
      </FuzzyText>
      <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
        Not Found
      </FuzzyText>
    </div>
  );
}
