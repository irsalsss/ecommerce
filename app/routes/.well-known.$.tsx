import { data, type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  data(null, { status: 404 });
};

// This component won't be rendered since we always throw in the loader
export default function WellKnownRoute() {
  return null;
}
