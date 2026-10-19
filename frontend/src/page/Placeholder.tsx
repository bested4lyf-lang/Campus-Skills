export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}
