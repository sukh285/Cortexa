import { Dots } from "./ui/dots";
import { Spinner } from "./ui/spinner";

export const Loader = ({ label = "Loading" }: { label?: string }) => {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <Spinner className="size-4 text-primary" />
      <span className="text-sm font-medium">
        {label}
        <Dots />
      </span>
    </div>
  );
};
