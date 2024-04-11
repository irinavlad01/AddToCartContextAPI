import { createContext, useReducer} from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext =  createContext({
    items: [], 
    addItemToCart: () => {},
    updateItemQuantity: () => {}
});

function shoppingCartReducer(state, action){
  if(action.type === 'ADD_ITEM'){
     const updatedItems = [...state.items];
    
          const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
          );
    //cauta indexul elementului cu un anume id, ca sa updateze mereu acelasi produs, sa nu fie de doua ori acelasi produs cu acelasi id
          const existingCartItem = updatedItems[existingCartItemIndex];
    
          if (existingCartItem) { //daca exista deja in cos, update cantitate
            const updatedItem = {
              ...existingCartItem,
              quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
          } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            //daca nu exista, cauta-l in șir si adauga toate proprietatile lui la sirul de elemente
            updatedItems.push({
              id: action.payload,
              name: product.title,
              price: product.price,
              quantity: 1,
            });
          }
    
          return {
            ...state,
            items: updatedItems, //returneaza sirul updated in locul sirului vechi
          };
  }else if(action.type === 'UPDATE_ITEM'){
    const updatedItems = [...state.items];
          const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
          );
    
          const updatedItem = {
            ...updatedItems[updatedItemIndex],
          };
    
          updatedItem.quantity += action.payload.amount;
    
          if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
          } else {
            updatedItems[updatedItemIndex] = updatedItem;
          }
    
          return {
            ...state,
            items: updatedItems,
          };
  }
}

//function shoppingCartReducer(state, action)
//action este un argument pe care il primeste automat de la useReducer, de la dispatch
//primul argument, adica state, este mereu by defaul state-ul creat cu useReducer()

export default function CartContextProvider({children}){
    const [shoppingCartState, dispatch] = useReducer(
      shoppingCartReducer, 
      {
        items: [],
      }
     );
    //primul argument este functia reducer, al doilea argument este o valoare initiala a stateului
    
      function handleAddItemToCart(id) {
        dispatch({
          type: 'ADD_ITEM',
          payload: id,
        })
        
      }
    
      function handleUpdateCartItemQuantity(productId, amount) {
        dispatch({
          type: 'UPDATE_ITEM',
          payload: {
            productId, 
            amount //standard js feature if the property name same as value name
          }
        })
      }
    
      const ctxValue={
        items: shoppingCartState.items, 
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity,
      }

      return(
        <CartContext.Provider value={ctxValue}>
            {children}
        </CartContext.Provider>
      )
}


//the value provided can be any value, object, string, array etc
//nu exportez cu default pentru ca aici cream mai multe contexte daca e necesar
//si sa putem sa le dam tuturor export din acelasi fisier
//valoarea data aici e doar un default value, ar putea fi si null
//dar ajuta mai mult la auto completare sa fie asa. E ca la state, 
//dai o valoare initiala goala. Ea se seteaza de fapt cu prop-ul value