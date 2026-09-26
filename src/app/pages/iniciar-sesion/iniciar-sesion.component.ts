import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})
export class IniciarSesionComponent {
  private readonly auth = inject(AuthService);

  abrirModal(): void {
    this.auth.abrir();
  }
}
