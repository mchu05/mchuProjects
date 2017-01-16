new Vue({
  el: '#shopping-trolley',
  
  data: {
  	drinks: [
  		{ id: 1, description: 'Coffee', price: 1.5 },
  		{ id: 2, description: 'Latte', price: 2 },
  		{ id: 3, description: 'Americiano', price: 1.5 },
  		{ id: 4, description: 'Expresso', price: 3 },
  	],
    tray: [],
  },
  
  computed: {
    trayTotal: function() {     
      var total = 0;
      var item;
      
      for (item in this.tray) {
        total = total + (this.tray[item].quantity * this.tray[item].price);
      }
      
      return total;
    }
  },
 
  methods: {
    addToTray: function(drink) {
      this.tray.push({
        id: drink.id,
        description: drink.description,
        price: drink.price,
        quantity: 1
      });
    },
    
    plusOne: function(item) {
      item.quantity = item.quantity + 1;
    },
    
    minusOne: function(item) {
      if (item.quantity == 1) {
        this.removeItem(item);
      } else {
        item.quantity = item.quantity - 1;
      }
    },
    
    removeItem: function(item) {
      this.tray.$remove(item);   
    },    
  }
})