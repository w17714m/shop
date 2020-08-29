import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IBasket, IBasketItem, IBasketTotals} from 'src/app/models/Basket';
import {BasketService} from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket$: Observable<IBasket>;
  basketTotals$: Observable<IBasketTotals>;

  constructor(private basketService: BasketService) {
  }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;
    this.basketTotals$ = this.basketService.basketTotals$;
  }

  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementItem(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }

  decrementItem(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }

  sendwhatsapp() {
    let text = 'https://api.whatsapp.com/send?phone=+573195048604&text=Estoy+interesado+en+comprar+el+';
    let productos = JSON.parse(localStorage.basket).items.map(x => {
      return 'producto:+' + x.productName + '+cantidad:+' + x.quantity;
    });
    this.basketTotals$.subscribe((x: IBasketTotals) => {
      localStorage.clear();
      window.location.href = text + '+' + productos.join('+') + '+Total:+' + x.total;
    });

  }
}
