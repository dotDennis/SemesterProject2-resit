export default function Heading({ title = "" }) {
  return (
    <div className="container text-center mt-5">
      <h1>{title}</h1>
    </div>
  );
}
