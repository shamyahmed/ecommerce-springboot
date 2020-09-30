import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {
    // need to build URL based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListPaginate(page: number, pageSize: number, categoryId: number): 
    Observable<GetResponseProducts> {
    const url = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` 
    + `&page=${page}` + `&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(url);
  }

  searchProducts(keyword: string) {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  searchProductsPaginate(page: number, pageSize: number, keyword: string) {
    const url = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
    + `&page=${page}` + `&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(url);
  }

  getProduct(productId: number) {
    return this.httpClient.get<Product>(`${this.baseUrl}/${productId}`);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}