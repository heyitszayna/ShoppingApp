import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { getDatabase, ref, set, push, remove, onValue, DataSnapshot } from 'firebase/database';

class Item{
  value1: string;
  value2: string;
  constructor(mVal1: string,mVal2: string){
    this.value1 = mVal1;
    this.value2 = mVal2;
  }
};

class Unit{
  key: string;
  val1: string;
  val2: string;
  constructor(nKey: string, nVal1: string, nVal2: string){
    this.key = nKey;
    this.val1 = nVal1;
    this.val2 = nVal2;
  }
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  anItem: Item; 
  list: Item[];

  aUnit: Unit;
  file: Unit[];

  constructor(private storage: Storage, private router: Router) { 
   this.anItem = new Item("","");
   this.list = [];

   this.aUnit = new Unit("","","");
   this.file = [];
  }
  
  // local storage
  async init(){
    await this.storage.create();
  }
  async getItemL(){
    await this.init();
    this.anItem = await this.storage.get("1234");;
  }
  async storeItemL(){
    if(this.anItem !=null)
    {
      let object = new Item(this.anItem.value1,this.anItem.value2);
      await this.storage.set("1234", object);
    }
  }
  async getItemsL(){
    await this.init();
    this.list = await this.storage.get("list");

  }
  async addToListL(){
    if(this.anItem != null && this.list != null){
      let object = new Item(this.anItem.value1,this.anItem.value2);
      this.list.push(object);
      await this.storage.set("list",this.list);
    }

  }
  async clearAllL(){
    await this.storage.clear();
    this.list = []; 
    this.anItem = new Item("","");
  }
  async deleteItemL(whichItem: number){
    this.list.splice(whichItem,1);
    await this.storage.set("list",this.list);

  }

  // remote storage
  storeItemR(key: string){
    if(this.aUnit != null){
      let object = new Unit("mykey", this.aUnit.val1, this.aUnit.val2);
      const db = getDatabase();
      set(ref(db, key), object);
    }
  }
  addItemToListR(){
    if(this.aUnit != null && this.file != null){
      let object = new Unit("", this.aUnit.val1, this.aUnit.val2);
      const db = getDatabase();
      const key = push(ref(db, 'units'),
      {val1: this.aUnit.val1, val2: this.aUnit.val2}).key;
    }
  }
  getItemR(key: string){
    const db = getDatabase();
    const unitRef = ref(db, key);
    onValue(unitRef, (data) => {
      if(data.val()!=null) this.aUnit = data.val();
    });
  }
  getItemsR(key: string){
    const db = getDatabase();
    const fileRef = ref(db, key);
    onValue(fileRef, (data) => this.handleIncomingData(data));
  }
  handleIncomingData(data: DataSnapshot){
    this.file = [];
    data.forEach((dataUnit) => this.handleIncomingDataUnit(dataUnit));
  }
  handleIncomingDataUnit(dataUnit: any){
    const key = dataUnit.key;
    const unit = dataUnit.val();
    if(key!=null){
      let object = new Unit(key, unit.val1, unit.val2);
      this.file.push(object);
    }
  }
  removeItemFromListR(unit: Unit){
    let index:number = this.file.indexOf(unit);
    this.file.splice(index,1);
    const db = getDatabase();
    remove(ref(db,'units/'+unit.key))
  }
  clearAllItemsR(){
    this.file = [];
    this.aUnit = new Unit("","","");
    const db = getDatabase();
    set(ref(db, "units"), {});
    set(ref(db, "mykey"), {});
  }

  async ngOnInit() {
    await this.init();
    await this.getItemL();
    await this.getItemsL();
    this.getItemR('mykey');
    this.getItemsR('units');
  }
}