import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPost } from 'app/shared/model/blog/post.model';
import { PostService } from './post.service';

@Component({
  selector: 'jhi-post-delete-dialog',
  templateUrl: './post-delete-dialog.component.html'
})
export class PostDeleteDialogComponent {
  post: IPost;

  constructor(protected postService: PostService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.postService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'postListModification',
        content: 'Deleted an post'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-post-delete-popup',
  template: ''
})
export class PostDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ post }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(PostDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.post = post;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/post', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/post', { outlets: { popup: null } }]);
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
