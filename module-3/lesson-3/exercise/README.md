# Ejercicio

- Crear una directiva personalizada llamada `appHoverLift` para generar un efecto visual de "elevación" cuando se pasa el cursor sobre `<div class="member-card">` en la vista [TeamMemberCardComponent](team-dashboard/src/app/components/team-member-card/team-member-card.component.html):
  - `ng g d directives/AppHoverLift --skip-tests`
- Añadir la directiva `appHoverLift` en `<div class="member-card">` en la vista [TeamMemberCardComponent](team-dashboard/src/app/components/team-member-card/team-member-card.component.html)
- Importar la directiva en la propiedad imports del componente [TeamMemberCardComponent](team-dashboard/src/app/components/team-member-card/team-member-card.component.ts):
  - `imports: [..., AppHoverLiftDirective]`
