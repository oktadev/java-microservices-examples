import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBlog } from 'app/shared/model/blog/blog.model';
import { BlogService } from './blog.service';

@Component({
  selector: 'jhi-blog-delete-dialog',
  templateUrl: './blog-delete-dialog.component.html'
})
export class BlogDeleteDialogComponent {
  blog: IBlog;

  constructor(protected blogService: BlogService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.blogService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'blogListModification',
        content: 'Deleted an blog'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-blog-delete-popup',
  template: ''
})
export class BlogDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ blog }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(BlogDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.blog = blog;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/blog', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/blog', { outlets: { popup: null } }]);
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
