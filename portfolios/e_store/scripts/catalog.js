class Catalog{

img;
title;
description;
price;

constructor(img,title,description,price){
    this.img = img;
    this.title = title;
    this.description = description;
    this.price = price;

}
//set functions
set img(value){
    this._img = value;
}
set title(value){
    this._title = value;
}
set description(value){
    this._description = value;
}
set price(value){
    this._price = value;
}
//get functions
get img(){
    return this._img;
}
get title(){
    return this._title;
}
get description(){
    return this._description;
}
get price(){
    return this._price;
}



}


