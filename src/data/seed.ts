import {Product} from '../models/product';
import { Cart, ICart } from '../models/cart';
import productData from './data.json';
import { v4 as uuidv4 } from 'uuid';

const createUniqueProductSet = async () =>{
  return await Product.distinct('name') as Array<string>;
}

export const generateProductSeed = async () => {
  const productSet = await createUniqueProductSet();
  console.log(productSet)
  let saveCount = 0;

  productData.products.forEach(productEntry => {
    const {
      imgUrl,
      name,
      description,
      price,
    } = productEntry;

    const productId = uuidv4();
    const date = new Date();
    const createdAt = date;
    const lastModified = date;
    const stockQuantity = Math.floor(Math.random() * 30);
    const product = new Product({
      productId,
      imgUrl,
      name,
      description,
      price,
      stockQuantity,
      createdAt,
      lastModified
    });

    if(!productSet.includes(name)){
      product.save();
      saveCount++;
      console.log('Added',{name,productId},'!');
    } else {
      console.log('A similar product already exists! We did not add',{name,productId},'!');
    }
  });
  if(saveCount === 0){
    console.log('We did not add products to the database!');
  } else {
    console.log('Saved',saveCount,'products to the database!');
  }
}

export const createCart = async (objCart: Object) => {
  const found = await Cart.findOne({objCart});
  
  if(!found){
    const cart = await new Cart(objCart);
    cart.save();
    console.log('Saved',cart);
  }
  console.log("We did not save this cart.")
}