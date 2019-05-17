import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITag } from 'app/shared/model/blog/tag.model';

@Component({
  selector: 'jhi-tag-detail',
  templateUrl: './tag-detail.component.html'
})
export class TagDetailComponent implements OnInit {
  tag: ITag;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ tag }) => {
      this.tag = tag;
    });
  }

  previousState() {
    window.history.back();
  }
}
