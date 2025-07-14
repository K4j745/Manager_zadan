import {
  Component,
  Inject,
  OnInit,
  Output,
  output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormModel } from '../models/form-model';
import { ToastrService } from 'ngx-toastr';
import { FormSaveDto } from '../models/form-save-dto';
import { ValidateMessageComponent } from '../components/validate-message/validate-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Kategoria, Priorytet } from '../models/form-enum';
import { PrimaryExpression } from 'typescript';
import { TaskService } from '../services/manager.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, ValidateMessageComponent],
  standalone: true,
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form implements OnInit {
  @Output() sendApplication = new EventEmitter<{
    dto: FormSaveDto;
    form: FormGroup<FormModel>;
  }>();

  public form!: FormGroup<FormModel>; // użyj ! albo ustaw jako null początkowo

  constructor(
    private readonly _formBuilder: FormBuilder, //private readonly _toastr: ToastrService
    private readonly taskService: TaskService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group<FormModel>({
      nazwaZadania: new FormControl<string | null>(null, [Validators.required]),
      kategoria: new FormControl<Kategoria | null>(null, [Validators.required]),
      data: new FormControl<Date | null>(null, [Validators.required]),
      priorytet: new FormControl<Priorytet | null>(null, [Validators.required]),
    });
  }
  get f() {
    return this.form.controls;
  }
  public showValidationMessages = true;
  public onCancel(): void {
    this.showValidationMessages = false;

    // Resetujemy formularz
    this.form.reset();

    // Resetujemy dotknięcia pól (touched/dirty)
    this.form.markAsPristine();
    this.form.markAsUntouched();

    // Zamykanie modala
    this.activeModal.dismiss();
  }
  public onSendApplication(): void {
    console.warn(this.form.controls);
    //oznaczenie formularza i jego poprzez markAsTouched
    this.form.markAllAsTouched(); //*
    console.warn(this.form.controls['data'].value);
    console.warn(this.form.controls['priorytet'].value);
    console.warn(this.form.controls['kategoria'].value);
    console.warn(this.form.controls['nazwaZadania'].value);

    // Sprawdzenie czy formularz jest invlaid, jeżeli tak to przerywa funkcje
    if (this.form.invalid) {
      //this._toastr.error('Wypełnij wszystkie wymagane pola!', 'Błąd!');
      return;
    }
    // jeżeli jest w porządku to przypisuje do zmiennej savedto2
    const { nazwaZadania, kategoria, data, priorytet } = this.form.value;

    if (!nazwaZadania || !kategoria || !data || !priorytet) {
      return;
    }

    const dto: FormSaveDto = {
      nazwaZadania: nazwaZadania!,
      kategoria: kategoria!,
      data: data!,
      priorytet: priorytet!, // 👈 tu rzutowanie typu
    };
    this.taskService.addTask(dto);
    this.sendApplication.emit({
      dto,
      form: this.form,
    });
    console.log(this.activeModal);
    this.activeModal.close();
  }
}
