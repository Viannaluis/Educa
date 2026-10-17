import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "orange";
};

export function StatCard({ label, value, note, icon, tone = "blue" }: StatCardProps) {
  const Icon = icon;

  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon${tone === "blue" ? "" : ` ${tone}`}`} aria-hidden="true">
          <Icon className="ui-icon" />
        </span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </article>
  );
}
