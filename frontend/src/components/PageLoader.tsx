import { Loader } from "./Loader";

export function PageLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader />
    </div>
  );
}
