import logo from "@/assets/shocheton.svg";

export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return <img src={logo} alt="Shocheton" className={className} />;
}
