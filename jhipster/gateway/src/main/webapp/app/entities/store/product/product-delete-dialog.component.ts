import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProduct } from 'app/shared/model/store/product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'jhi-product-delete-dialog',
  templateUrl: './product-delete-dialog.component.html'
})
export class ProductDeleteDialogComponent {
  product: IProduct;

  constructor(protected productService: ProductService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.productService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'productListModification',
        content: 'Deleted an product'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-product-delete-popup',
  template: ''
})
export class ProductDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ product }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ProductDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.product = product;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/product', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/product', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
