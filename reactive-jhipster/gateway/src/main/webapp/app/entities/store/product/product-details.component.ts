import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { IProduct } from '@/shared/model/store/product.model';
import ProductService from './product.service';

@Component
export default class ProductDetails extends mixins(JhiDataUtils) {
  @Inject('productService') private productService: () => ProductService;
  public product: IProduct = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.productId) {
        vm.retrieveProduct(to.params.productId);
      }
    });
  }

  public retrieveProduct(productId) {
    this.productService()
      .find(productId)
      .then(res => {
        this.product = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
