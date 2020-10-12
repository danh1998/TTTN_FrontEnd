import { LocalStorageService } from './../core/services/local-storage.service';
import { ProductDetailPageComponent } from './views/product-detail-page/product-detail-page.component';
import { CategoryPageComponent } from './views/category-page/category-page.component';
import { CartListPageComponent } from './views/cart-list-page/cart-list-page.component';
import { CartItem } from './../shared/models/cart';
import { Component, Input, OnInit } from '@angular/core';
import { Cart } from '../shared/models/cart';
import { Subject } from 'rxjs';
import { HomePageComponent } from './views/home-page/home-page.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  cartItem: any = {
    items: [],
  }
  // cart$ = new Subject<Array<CartItem>>();

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.localStorageService.getItemLocalStorage('cart').subscribe(cart => {
      if (cart) {
        this.cartItem = cart
      } else {
        this.localStorageService.setItemLocalStorage('cart', this.cartItem).subscribe(() => { });
      }
    })
  }

  onActivate(componentReference) {
    if (componentReference instanceof CartListPageComponent) {
      this.localStorageService.getItemLocalStorage('cart').subscribe((rs) => {
        // console.log(rs['items']);
        componentReference.cartItems = rs['items'];
      })
      componentReference.deleteProduct.subscribe(item => {
        let newCart = this.cartItem.items.filter(el => el.idProduct != item.idProduct);
        this.cartItem.items = newCart;
        this.localStorageService.setItemLocalStorage('cart', this.cartItem).subscribe(() => { });
      })
      // componentReference.changeAmoutProduct.subscribe(item => {
      //   this.cartItem.items.map(el => {
      //     if (el.idProduct == item.id) {
      //       return el.amout = item.amount
      //     }
      //   })
      // })
    }

    if (componentReference instanceof HomePageComponent ||
      componentReference instanceof CategoryPageComponent ||
      componentReference instanceof ProductDetailPageComponent
    ) {
      componentReference.addProduct.subscribe((data) => {
        let productTemp = this.cartItem.items.find(el => el.idProduct == data._id);
        if (productTemp) {
          this.cartItem.items.map(el => {
            if (el.idProduct == data._id) {
              el.amout += 1;
            }
            return el;
          })
        } else {
          this.cartItem.items.push({
            idProduct: data._id,
            name: data.title,
            price: data.price,
            amout: 1,
            logo: data.logo
          })
        }
        // this.cart$.next(this.cartItem.items);
        // console.log(this.cartItem);
        this.localStorageService.setItemLocalStorage('cart', this.cartItem).subscribe(() => { });
      })
    }
  }
}
