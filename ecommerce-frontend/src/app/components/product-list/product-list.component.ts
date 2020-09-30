import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  //templateUrl: './product-list-table.component.html',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  searchMode: boolean = false;
  previousKeyword: string;

  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;
  
  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.listProductsBySearch();
    } else {
      this.listProductsByCategory();
    }
  }

  listProductsBySearch() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    if(this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;
    
    this.productService.searchProductsPaginate(this.pageNumber-1, this.pageSize, 
      keyword).subscribe(this.processResult())
  }

  listProductsByCategory() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    if(this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.pageNumber-1, this.pageSize, 
      this.currentCategoryId).subscribe(this.processResult())
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number+1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    console.log(`add to cart product: ${product.name}, ${product.unitPrice}`);
    this.cartService.addToCart(new CartItem(product));
  }
}