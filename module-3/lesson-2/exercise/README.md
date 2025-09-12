# Ejercicio

- Crear componente inline para el indicador de disponibilidad:
  - `ng g c components/AvailabilityIndicator --inline-template --inline-style --skip-tests`
  - [AvailabilityIndicator](team-dashboard/src/app/components/availability-indicator/availability-indicator.component.ts)
- Crear componente inline para las renderizar las habilidades:
  - `ng g c components/SkillBadge --inline-template --inline-style --skip-tests`
  - [SkillBadge](team-dashboard/src/app/components/skill-badge/skill-badge.component.ts)
- Añadir los selectores de `app-availability` y `app-skill-badge` en la vista [TeamMemberCardComponent](team-dashboard/src/app/components/team-member-card/team-member-card.component.html)
- Importar ambos componentes en la propiedad imports del componente [TeamMemberCardComponent](team-dashboard/src/app/components/team-member-card/team-member-card.component.ts):
  - `imports: [..., SkillBadgeComponent, AvailabilityIndicatorComponent]`