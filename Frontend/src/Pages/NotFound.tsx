import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

function NotFound() {
  return (
    <section className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold">404</h1>
      <p className="mt-2 text-base-content/60">This page does not exist.</p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Back to Home</Button>
      </Link>
    </section>
  );
}

export default NotFound;