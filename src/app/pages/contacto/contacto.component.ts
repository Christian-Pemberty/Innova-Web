import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { IdiomaService } from '../../language.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  /** Servicio de idiomas para el mensaje de confirmación del formulario. */
  protected readonly idiomas = inject(IdiomaService);

  /** Mensaje de confirmación temporal tras enviar el formulario. */
  readonly enviado = signal<string | null>(null);

  private avisoTimer: ReturnType<typeof setTimeout> | undefined;

  /** Recupero datos de contacto fijos para mostrar en la página. */
  readonly redaccion = {
    email: 'redaccion@innova.com',
    celular: '+57 604 234 5678',
    ciudad: 'Medellín'
  };

  /**
   * Envía el formulario de contacto. No existe backend: se valida el
   * formulario, se confirma la recepción al usuario y se limpian los campos.
   */
  onEnvio(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const nombre = (form.value.nombre ?? '').toString().trim();

    // Confirmación temporal que se disipa sola.
    this.enviado.set(this.idiomas.tConParametros('contacto.gracias', { nombre }));
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this.avisoTimer = setTimeout(() => this.enviado.set(null), 6000);

    // Deferimos el reset para que Angular procese la confirmación primero.
    setTimeout(() => form.reset(), 0);
  }
}
