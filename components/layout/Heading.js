export default function Heading({ title = "" }) {
  return (
    <div className="container text-center">
      <h1>{title}</h1>
    </div>
  );
}
