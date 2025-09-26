# Ejercicio

- Crear un pipe personalizado llamado `YearsAgo` para transformar la fecha de ingreso de un equipo de trabajo en un texto que indique la cantidad de años y meses que han pasado desde la fecha de ingreso. El pipe debe tener dos formatos de salida: `short` y `long`.
  - `ng g d pipes/YearsAgo --skip-tests`
  - Importar el pipe en el componente [TeamMemberCardComponent](team-dashboard/src/app/components/team-member-card/team-member-card.component.ts):
    - `imports: [..., YearsAgoPipe]`
  - Usar el pipe en la vista [TeamMemberCardComponent](team-dashboard/src/app/components/team-member-card/team-member-card.component.html):
    - `<span class="value">{{ member.joinDate | yearsAgo:'long' }}</span>`
- Crear un servicio personalizado llamado `LoggerService` para registrar acciones en la consola.
  - `ng g s services/logger --skip-tests`
  - Importar el servicio en los servicios [FavoriteService](team-dashboard/src/app/services/favorite.service.ts) y [TeamMemberService](team-dashboard/src/app/services/team-member.service.ts):
    - `import { LoggerService } from './logger.service';`
  - Inyectar el servicio en el constructor de los servicios:
    - `constructor(private logger: LoggerService) { ... }`
  - Usar el servicio en los servicios:
    - `this.logger.log('Acción realizada');`