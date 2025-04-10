import ProductListing from "./components/product-listing"

export default function Home() {
  // This is a Server Component, but we'll redirect to login if no token
  // The actual auth check happens in the client component
  return <ProductListing />
}
