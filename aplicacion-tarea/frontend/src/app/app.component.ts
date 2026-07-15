import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { Cliente } from './models/cliente.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ClienteFormComponent, ClienteListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestión de Clientes';
  contadorRefresco = 0;

  onClienteCreado(cliente: Cliente): void {
    this.contadorRefresco++;
  }
}
