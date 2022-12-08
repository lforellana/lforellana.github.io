import { Component, OnInit } from '@angular/core';
import { Invoice } from 'src/app/api/models';
import { InvoiceControllerService } from '../../api/services/invoice-controller.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoice:Invoice[] = [];
  visible: boolean = false;

  constructor(
    private invoiceService:InvoiceControllerService,
    private messageService: NzMessageService,
    private fb: FormBuilder
  ) {}

  formInvoice: FormGroup = this.fb.group({
    id: [],
    correlative: [],
    email: [],
    name: [],
    scheduled: []
  })


  ngOnInit(): void{
    //this.invoiceService.find().subscribe(data => this.invoice = data)
  }

  eliminar(id: string): void {
    this.invoiceService.deleteById({ id }).subscribe(() => {
      this.invoice = this.invoice.filter(x => x.id !== id);
      this.messageService.success('Registro Eliminado')
    })
  }

  cancel(): void {
    this.messageService.info('Su registro sigue activo!')
  }
 

  
 
  guardar(): void {
    this.formInvoice.setValue({ ...this.formInvoice.value, 'disponible': Boolean(this.formInvoice.value.disponible) })
    if (this.formInvoice.value.id) {
      this.invoiceService.updateById({ 'id': this.formInvoice.value.id, 'body': this.formInvoice.value }).subscribe(
        () => {
          this.invoice = this.invoice.map(obj => {
            if (obj.id === this.formInvoice.value.id){
              return this.formInvoice.value;
            }
            return obj;
          })
          this.messageService.success('Registro actualizado con exito!')
          this.formInvoice.reset()
        }
      )
    } else {
      delete this.formInvoice.value.id
      this.invoiceService.create({ body: this.formInvoice.value }).subscribe((datoAgregado) => {
        this.invoice = [...this.invoice, datoAgregado]
        this.messageService.success('Registro creado con exito!')
        this.formInvoice.reset()
      })
    }
    this.visible = false
  }
}
