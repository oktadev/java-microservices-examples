import { Authority } from '@/shared/security/authority';
/* tslint:disable */
// prettier-ignore

// prettier-ignore
const Tag = () => import('@/entities/blog/tag/tag.vue');
// prettier-ignore
const TagUpdate = () => import('@/entities/blog/tag/tag-update.vue');
// prettier-ignore
const TagDetails = () => import('@/entities/blog/tag/tag-details.vue');
// prettier-ignore
const Product = () => import('@/entities/store/product/product.vue');
// prettier-ignore
const ProductUpdate = () => import('@/entities/store/product/product-update.vue');
// prettier-ignore
const ProductDetails = () => import('@/entities/store/product/product-details.vue');
// prettier-ignore
const Blog = () => import('@/entities/blog/blog/blog.vue');
// prettier-ignore
const BlogUpdate = () => import('@/entities/blog/blog/blog-update.vue');
// prettier-ignore
const BlogDetails = () => import('@/entities/blog/blog/blog-details.vue');
// prettier-ignore
const Post = () => import('@/entities/blog/post/post.vue');
// prettier-ignore
const PostUpdate = () => import('@/entities/blog/post/post-update.vue');
// prettier-ignore
const PostDetails = () => import('@/entities/blog/post/post-details.vue');
// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

export default [
  {
    path: '/tag',
    name: 'Tag',
    component: Tag,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/tag/new',
    name: 'TagCreate',
    component: TagUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/tag/:tagId/edit',
    name: 'TagEdit',
    component: TagUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/tag/:tagId/view',
    name: 'TagView',
    component: TagDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product',
    name: 'Product',
    component: Product,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product/new',
    name: 'ProductCreate',
    component: ProductUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product/:productId/edit',
    name: 'ProductEdit',
    component: ProductUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/product/:productId/view',
    name: 'ProductView',
    component: ProductDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/blog/new',
    name: 'BlogCreate',
    component: BlogUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/blog/:blogId/edit',
    name: 'BlogEdit',
    component: BlogUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/blog/:blogId/view',
    name: 'BlogView',
    component: BlogDetails,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/post',
    name: 'Post',
    component: Post,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/post/new',
    name: 'PostCreate',
    component: PostUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/post/:postId/edit',
    name: 'PostEdit',
    component: PostUpdate,
    meta: { authorities: [Authority.USER] },
  },
  {
    path: '/post/:postId/view',
    name: 'PostView',
    component: PostDetails,
    meta: { authorities: [Authority.USER] },
  },
  // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
];
