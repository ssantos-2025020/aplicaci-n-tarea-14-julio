import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit, OnChanges {
  @Input() refrescar = 0;

  clientes: Cliente[] = [];
  cargando = false;
  mensajeError: string | null = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngOnChanges(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.mensajeError = null;

    this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.cargando = false;
      },
      error: () => {
        this.mensajeError = 'No fue posible cargar los clientes.';
        this.cargando = false;
      }
    });
  }

  eliminar(codigoCliente: string): void {
    this.clienteService.eliminarCliente(codigoCliente).subscribe({
      next: () => this.cargarClientes(),
      error: () => this.mensajeError = 'No fue posible eliminar el cliente.'
    });
  }
}
