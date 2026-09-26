import { provideHttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CrearNoticiaComponent } from './crear-noticia.component';
import { NoticiaService } from '../../noticia.service';

describe('CrearNoticiaComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CrearNoticiaComponent],
      providers: [provideRouter([]), provideHttpClient()]
    });
  }));

  function submitWithValidData() {
    const fixture = TestBed.createComponent(CrearNoticiaComponent);
    const formEl = fixture.nativeElement.querySelector('form');
    const form = (formEl as unknown as { __ngForm: NgForm }).__ngForm;

    form.setValue({
      titulo: 'Mi noticia de prueba',
      categoria: 'Tecnológicas',
      descripcion: 'Descripción de prueba',
      imagen: ''
    });

    expect(form.valid).toBe(true);

    fixture.componentInstance.onSubmit(form);
    fixture.detectChanges();
    return { fixture, form };
  }

  it('muestra la confirmación al publicar la noticia', () => {
    const { fixture } = submitWithValidData();
    const feedback = fixture.nativeElement.querySelector('.crear-feedback');
    expect(feedback).not.toBeNull();
    expect(feedback!.textContent).toContain('Mi noticia de prueba');
  });

  it('persiste la noticia en el servicio', () => {
    submitWithValidData();
    const service = TestBed.inject(NoticiaService);
    expect(service.getNoticias().some((n) => n.titulo === 'Mi noticia de prueba')).toBe(true);
  });

  it('reinicia los campos del formulario tras publicar', () => {
    const { form } = submitWithValidData();
    expect((form.value.titulo ?? '') as string).toBe('');
    expect(form.pristine).toBe(true);
  });
});
