import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {IPagination, Pagination} from 'src/app/models/Pagination';
import {IBrand} from '../models/Brand';
import {IType} from '../models/ProductType';
import {map} from 'rxjs/operators';
import {ShopParams} from '../models/ShopParams';
import {IProduct} from '../models/Product';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  // for caching
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();

  constructor(private http: HttpClient) {
  }

  getProducts(useCache: boolean) {

    if (useCache === false) {
      this.products = [];
    }

    if (this.products.length > 0 && useCache === true) {
      const pagesReceived = Math.ceil(this.products.length / this.shopParams.pageSize);

      if (this.shopParams.pageNumber <= pagesReceived) {
        this.pagination.data = this.products.slice((this.shopParams.pageNumber - 1) *
          this.shopParams.pageSize, this.shopParams.pageNumber * this.shopParams.pageSize);
        if (this.shopParams.search) {
          this.pagination.data = this.pagination.data.filter((x) => {
            return x.name.match(this.shopParams.search) || x.description.match(this.shopParams.search);
          });
        }

        if (this.shopParams.brandId) {
          this.pagination.data = this.pagination.data.filter((x) => {
            return x.productBrand.match(this.shopParams.brandId.toString());
          });

        }


        return of(this.pagination);
      }
    }
    let params = new HttpParams();

    if (this.shopParams.brandId !== 0) {
      params = params.append('brandId', this.shopParams.brandId.toString());
    }

    if (this.shopParams.typeId !== 0) {
      params = params.append('typeId', this.shopParams.typeId.toString());
    }

    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber.toString());
    params = params.append('pageIndex', this.shopParams.pageSize.toString());

    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }

    return this.http.get<IPagination>('/assets/products.json', {observe: 'response', params})
      .pipe(
        map(response => {
          // Filled array once all products loaded
          // will append the new set of data with existing set

          this.products = [...this.products, ...response.body.data];
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    // basically angular components throw everything once we switch to another component...
    // Hence, returning from service is best way to stay efficient
    // Then once by id product is accessed, it gets retrieved from products array directly as a cached result.
    const product = this.products.find(p => p.id === id);

    if (product) {
      return of(product);
    }
  }

  getBrands() {
    // returning from service
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IBrand[]>('/assets/brand.json').pipe(
      map((response) => {
        this.brands = response;
        return response;
      })
    );
  }

  getTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IType[]>('/assets/type.json').pipe(
      map((response) => {
        this.types = response;
        return response;
      })
    );
  }
}
