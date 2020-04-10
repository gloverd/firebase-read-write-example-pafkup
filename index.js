import React, { Component } from 'react';
import { render } from 'react-dom';

//use the fire.js and add in your firebase account information
import firebase from './fire.js';
import './style.css';


class App extends Component {
  constructor() {
    super();

    this.state = {
      shoppingList: [],
      isLoading: true,
      itemName: "",
      user: null
    };

    this.handleName= this.handleName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);

  }

  

  componentWillMount() {
       
      console.log("Connecting to firebase");
      
      //allow your app to sign in anonomously
      firebase.auth().signInAnonymously().catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
      });

      //call update ShoppingList
      this.updateShoppingList();
      
  }

  updateShoppingList() {

    //The following code get a particular table
    const shoppingListDB = firebase.database().ref("Shopping List");
    
    //Store content of the database into an array to be used
    //to set the state later.
    const shoppingListTemp = [];

    //Get shoppingList from the DB and add it to the local list.
    shoppingListDB.on('value', snapshot => {
      
      snapshot.forEach(childSnapShot => {
        //console.log( childSnapShot.key + " : "  + childSnapShot.val());
  
        const item = 
        {
            number: childSnapShot.key,
            name: childSnapShot.val()
        }

        //Add an item object to the shoppingListTemp Array
        shoppingListTemp.push(item);
        

      });

      //set the shoppingLItemTemp Array to the state shoppingList, and load to false
      this.setState({ shoppingList: shoppingListTemp, isLoading: false });
        
    });
  }


  //This is called when your type something
  handleName(event) {
    this.setState({ itemName : event.target.value});
  }

  //This is called when you hit enter
  handleSubmit(event) {
    
    //To add an item, you need to specify the key.
    //In this case, it is new unique number.  We can add one to largest number

    //Find the largest
    const largest = Number(this.state.shoppingList[0].number);
    for(const each of this.state.shoppingList){
      if( Number(each.number) > largest)
        largest = Number(each.number);
    }


    const itemNumber = largest+1;

    //Add a new key to Shopping Lists. It will return the new item of that key
    const shoppingListItem = firebase.database().ref("Shopping List/" + itemNumber);
    
    //Add a value to that key
    shoppingListItem.set(
      this.state.itemName
    );

    //update the screen, and clear out the form
    this.setState({isLoading : true, itemName: ""});

    //this will download the shopping list from firebase with the update value
    this.updateShoppingList();
    
    //prevent the page from reloading
    event.preventDefault();
  }

  //Reset Shopping List
  handleReset() {

    //reset shopping list.
    //console.log("reset");
    //Get shoppingList from the DB and remove it
    const shoppingListDB = firebase.database().ref("Shopping List");
    shoppingListDB.remove();

    //Add new shopping List
    const shoppingListItem = firebase.database().ref("Shopping List");
    const items = 
    {
       0 : "Milk",
       1 : "Cereal",
       2 : "Apple Juice"
    }
    shoppingListItem.set(
      items
    );

    this.setState({ isLoading: false });
    this.updateShoppingList();

  }

  

  render() {
    //when date is being loaded
    if (this.state.isLoading) {
      return (
        <div>
        loading...
        </div>
      );
    }

    //when the data is loaded, then do the following
    return (
      <div>
      
          <button onClick={this.handleReset}>Reset List</button>
          <br/>
          <form onSubmit={this.handleSubmit}>
              Add:
              <input type="text" value={this.state.itemName} onChange={this.handleName} />
          </form>

          { this.state.shoppingList.map( (item) => <li>{item.number} : {item.name}</li>) }

       
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
