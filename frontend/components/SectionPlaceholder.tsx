import { PageHeading } from "@/components/PageHeading";

type SectionPlaceholderProps = {
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
};

export function SectionPlaceholder({ title, description, cardTitle, cardDescription }: SectionPlaceholderProps) {
  return (
    <>
      <PageHeading title={title} description={description} />
      <section className="placeholder-card">
        <h2>{cardTitle}</h2>
        <p>{cardDescription}</p>
      </section>
    </>
  );
}
