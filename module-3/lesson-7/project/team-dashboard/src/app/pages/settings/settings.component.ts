import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-page">
      <h2>Configuraciones</h2>
    </div>
  `,
  styles: `
    .settings-page {
      padding: 20px;
      text-align: center;
    }
  `
})
export class SettingsComponent {}
