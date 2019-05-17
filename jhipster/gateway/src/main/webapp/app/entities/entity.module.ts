import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'blog',
        loadChildren: './blog/blog/blog.module#BlogBlogModule'
      },
      {
        path: 'post',
        loadChildren: './blog/post/post.module#BlogPostModule'
      },
      {
        path: 'tag',
        loadChildren: './blog/tag/tag.module#BlogTagModule'
      },
      {
        path: 'product',
        loadChildren: './store/product/product.module#StoreProductModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayEntityModule {}
