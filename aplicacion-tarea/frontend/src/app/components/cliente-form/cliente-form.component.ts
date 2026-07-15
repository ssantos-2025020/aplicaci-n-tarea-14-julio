import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent {
  @Output() clienteCreado = new EventEmitter<Cliente>();

  form: FormGroup;
  mensajeError: string | null = null;
  enviando = false;

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
    this.form = this.fb.group({
      codigoCliente: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      direccionCliente: ['', Validators.required],
      telefonoCliente: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.mensajeError = 'Todos los campos son obligatorios.';
      return;
    }

    this.enviando = true;
    this.mensajeError = null;

    this.clienteService.crearCliente(this.form.value).subscribe({
      next: (cliente) => {
        this.clienteCreado.emit(cliente);
        this.form.reset();
        this.enviando = false;
      },
      error: (err) => {
        this.mensajeError = err.error?.mensaje || 'Ocurrió un error al guardar el cliente.';
        this.enviando = false;
      }
    });
  }
}
