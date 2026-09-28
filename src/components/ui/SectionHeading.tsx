export function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
