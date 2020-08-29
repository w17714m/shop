import {Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {IProduct} from 'src/app/models/Product';
import {ShopService} from './shop.service';
import {IBrand} from 'src/app/models/Brand';
import {IType} from 'src/app/models/ProductType';
import {ShopParams} from 'src/app/models/ShopParams';
import './acordeon.js';

declare var toogleComp: any;

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  @ViewChild('search', {static: false}) searchTerm: ElementRef;

  @ViewChild('toggle') botonToggle: ElementRef;

  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams: ShopParams;
  totalCount: number;
  showToggle: boolean;
  sortOptions = [
    {name: 'Precio: Mas Bajo a Alto', value: 'priceAsc'},
    {name: 'Precio: Mas Alto a Bajo', value: 'priceDesc'},
    {name: 'Alfabetico', value: 'name'}
  ];

  constructor(private shopService: ShopService, private renderer: Renderer2) {
    this.shopParams = this.shopService.getShopParams();
    this.showToggle = false;
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
    this.toogleAcordion();
  }

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe(res => {
      this.products = res.data;
      this.totalCount = res.count;
    }, error => {
      console.log(error);
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe(res => {
      this.brands = [{id: 0, name: 'Todos'}, ...res];
    }, error => {
      console.log(error);
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe(res => {
      this.types = [{id: 0, name: 'Todos'}, ...res];
    }, error => {
      console.log(error);
    });
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts(true);
  }

  onTypeSelected(typeId: any) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts(true);
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts(true);
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }
  }

  onSearch() {
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts(true);
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }

  toogleAcordion() {
    if (this.showToggle) {
      this.renderer.addClass(this.botonToggle.nativeElement, 'showt');
      this.renderer.removeClass(this.botonToggle.nativeElement, 'hidet');

    } else {
      this.renderer.addClass(this.botonToggle.nativeElement, 'hidet');
      this.renderer.removeClass(this.botonToggle.nativeElement, 'showt');
    }
    this.showToggle = !this.showToggle;
  }
}
