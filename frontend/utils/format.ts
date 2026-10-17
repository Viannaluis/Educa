export function formatStudentCount(count: number): string {
  return new Intl.NumberFormat("pt-BR").format(count);
}
