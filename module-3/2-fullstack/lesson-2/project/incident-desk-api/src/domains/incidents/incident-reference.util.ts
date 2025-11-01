let sequence = 1;

// Reinicia o avanza la secuencia de referencias según el último registro conocido.
export function seedReferenceSequence(reference?: string) {
  if (!reference) {
    sequence = 1;
    return;
  }

  const parts = reference.split('-');
  const lastSequence = Number.parseInt(parts[2] ?? '1', 10);
  sequence = Number.isNaN(lastSequence) ? 1 : lastSequence + 1;
}

// Genera un código siguiendo el formato INC-YYYY-#### y aumenta la secuencia.
export function buildReference(date = new Date()) {
  const year = date.getFullYear();
  const padded = sequence.toString().padStart(4, '0');
  sequence += 1;
  return `INC-${year}-${padded}`;
}
