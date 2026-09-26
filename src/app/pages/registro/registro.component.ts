import { Component, inject } from '@angular/core';
import { RegistroService } from '../../registro.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private readonly registro = inject(RegistroService);
  private readonly auth = inject(AuthService);

  onAbrirModal(): void {
    this.registro.abrir();
  }

  onAbrirLogin(): void {
    this.auth.abrir();
  }
}
