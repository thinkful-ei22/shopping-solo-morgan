'use strict';

//stores all items in the shopping list as an array of objects
const STORE = [
  {name: "apples", checked: false, show: true},
  {name: "oranges", checked: false, show: true},
  {name: "milk", checked: true, show: true},
  {name: "bread", checked: false, show: true}
];


//takes in an item and itemIndex
//returns an <li> html element
//Why is 'template' defined here??
function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <div class='edit-name'>
          <input type='text' placeholder='edit item name' name='edit-item-name' class='edit-name-text'>
          <button class='js-item-edit' type='button'><span class='button-label'>Change Item Name</span>
          </button>
        </div>
      </div>
    </li>`;
}


//takes in an array (shopping list)
//iterates through each element
//if that item 'show' attribute is true, then it
//turns it into an <li> using generateItemElement()
//returns all the <li>'s joined into one string
function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => {
    if(item['show'] === true) {
      return generateItemElement(item, index);
    }
  }
  );
  console.log("Generating shopping list element");
  return items.join("");
}


//generates an HTML string from the shopping list using 
//generateShoppingItgit emsString(STORE)
//inserts the HTML string inside the <ul>
function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


//takes in an item name
//makes an object of that item {name: checked:false}
//pushes that item into the STORE array
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false, show: true});
}

//when 'Submit' button is clicked
//retrieves value from text input
//adds that value to STORE using addItemToShoppinglist()
//re-loads HTML using renderShoppingList()
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}


//takes in itemIndex
//changes the STORE array so that the item is checked or not
function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}


//takes in an <li> item
//finds the attribute 'data-item-index
//returns the index as a number'
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}


//when filter checkbox is changed, if checked attribute 
//is true, changes all "checked" items to show: false
//if checked attribute is fales, reassign all items 'show: true'
function reassignShowByCheckbox(listArr) {
  $('.js-checked-filter').on('change', 'input', event => {
    const checkedBox = event.target.checked;
    if (checkedBox === true) {
      for(let i = 0; i<listArr.length; i++){
        if (listArr[i]['checked'] === true) {
          listArr[i]['show'] = false;
        } else {
          listArr[i]['show'] = true;
        }
      }
    } else {
      for(let i = 0; i<listArr.length; i++) {
        listArr[i]['show'] = true;
      }
    }
    console.log(listArr);
    renderShoppingList();
  });
}

/* When Search-checkbox is changed, value is grabbed from text box
if checked, change all 'show' to false, except for items whose name
matches the input.  Then list is re-rendered. */
function reassignShowBySearch(listArr) {
  $('.js-search-list').on('change', '.checkbox', event => {
    const searchInput = $('.js-search-list .text').val();
    console.log(searchInput);
    const checkedBox = event.target.checked;
    if (checkedBox === true) {
      listArr.forEach(item => {
        item['show'] = false;
        if (item['name'].startsWith(searchInput) === true) {
          item['show'] = true;
        }
      });
    } else {
      listArr.forEach(item => item['show'] = true);
      $('.js-search-list .text').val('');
    }
    renderShoppingList();
  })
}


/* When user clicks on Change-Name button, it triggers an event where
value is grabbed from textbox, STORES array is modified, then page is 
re-rendered. */
function reassignName(listArr) {
  $('.js-shopping-list').on('click', '.edit-name button', event => {
    const newName = $(event.currentTarget).closest('.edit-name').children('.edit-name-text').val();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    listArr[itemIndex]['name'] = newName;
    renderShoppingList();    
  });
}


//runs all the 'reassign' functions on the STORE array
function handleShowKey () {
  reassignShowByCheckbox(STORE);
  reassignShowBySearch(STORE);
}


function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


//when Delete button is clicked
//retrieves index of element using getItemIndexFromElement()
//deletes that item from the list
//re-renders the shopping list
function handleDeleteItemClicked() {
  console.log('`handleDeleteItemClicked` ran');
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const index = getItemIndexFromElement(event.currentTarget);
    STORE.splice(index, 1);
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleShowKey();
  reassignName(STORE);
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);