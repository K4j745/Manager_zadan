import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Form } from '../form/form';
import { ListaZadComponent } from '../lista-zad/lista-zad';
// import { TaskList } from '../lista-zad/lista-zad';

@Component({
  selector: 'app-home',
  imports: [Form /*, TaskList*/, ListaZadComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private modalService: NgbModal) {}

  openModal() {
    console.log('Przycisk działa');
    this.modalService.open(Form);
  }
}
