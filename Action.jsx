import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let Search = (n)=>{
    return{
        type:"Search",
        payload:n
    }
}

let Search11 = (n)=>{
  return{
      type:"Cat",
      payload:n
  }
}

let Se = (n)=>{
  return{
      type:"Show",
      payload:n
  }
}


const Ca = () => {
  return async (dispatch) => {
    try {
      // Make a request to the backend API to get the cart count
      const response = await axios.post('http://localhost:2001/cartcount', {}, { withCredentials: true });

      // Extract the cart count from the response
      const cartCount = response.data.cartCount;

      // Dispatch the action with the received cart count
      dispatch({
        type: 'coca',
        payload: cartCount,
      });
    } catch (error) {
      console.error('Error fetching cart count:', error);
      // Handle errors appropriately, such as dispatching an error action
    }
  };
};

const Role =(n) => {
  
      
      return {
        type:"role",
        payload:n
    }
  };

let NullSearch = (n)=>{
    return {
        type:"Search",
        payload:""
    }
}

let total = (n)=>{
    return{
        type:"total",
        payload:n
    }
}



const totalPrice = (cart) => {
  const total = cart.reduce((acc, product) => acc + product.total, 0);
  return {
    type: 'totalp',
    payload: total,
  };
};


let current = (n)=>{
    return{
        type:"current",
        payload:n
    }
}
const fetchProducts = (search,cr) => {
    return async (dispatch) => {
      try {
        // Make the API request to get product data
        const response = await axios.get('http://192.168.1.104:2001/products', {
          params: {
            search: search,
            cr:cr
          },
        });
        
        // Dispatch the action with the fetched data
        dispatch({
          type: 'FETCH_PRODUCTS',
          payload: response.data.products,
        });
        dispatch({
            type: 'total',
            payload: response.data.totalPages
          });
          
         
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  };
  
  const updateProduct = (pname, newPrice, newQuantity,search,cr) => {
    return async (dispatch) => {
      try {
        // Make the API request to update product data
        await axios.put('http://192.168.1.104:2001/updateProduct', {
          pname,
          newPrice,
          newQuantity,
        });
  
        // If the update is successful, fetch the updated product list
        const response = await axios.get('http://192.168.1.104:2001/products', {
          params: {
            search: search,
            cr:cr
          },
        });
        
        // Dispatch the action with the fetched data
        dispatch({
          type: 'FETCH_PRODUCTS',
          payload: response.data.products,
        });
        dispatch({
            type: 'total',
            payload: response.data.totalPages
          });
      } catch (error) {
        console.error('Error updating product:', error);
      }
    };
  };
  const fetchProducts1 = (search,cr,pr,s) => {
    return async (dispatch) => {
      try {
        s(true);
        // Make the API request to get product data
        const response = await axios.get('http://192.168.1.104:2001/products12', {
          params: {
            search: search,
            cr:cr,
            pr:pr,
          },
        });
        
        // Dispatch the action with the fetched data
        dispatch({
          type: 'FETCH_PRODUCTS',
          payload: response.data.products,
        });

        dispatch({
            type: 'total',
            payload: response.data.totalPages
          });
          s(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  };

  const fetchProducts2 = () => {
    return async (dispatch) => {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token'); // Replace 'yourTokenKey' with the actual key used to store the token
  
        if (!token) {
          console.error('Token not found in AsyncStorage');
          return;
        }
  
        // Make the API request to get cart data with the token
        const response = await axios.get('http://192.168.1.104:2001/getcart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Dispatch the action with the fetched data
        dispatch({
          type: 'FETCH_CPRODUCTS',
          payload: response.data.products,
        });
  
      } catch (error) {
        console.error('Error fetching cart products:', error);
      }
    };
  };
  


  const fetchProducts3 = (e, pname) => {
    return async (dispatch) => {
      try {
        // Make the API request to update the quantity in the cart
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://192.168.1.104:2001/upqty', {
          headers: {
            Authorization: `Bearer ${token}`, // Replace YOUR_ACCESS_TOKEN with the actual access token
          },
          params: {
            e,
            pname,
          },
        });
  
        // Dispatch the action with the updated cart products
        dispatch({
          type: 'FETCH_CPRODUCTS',
          payload: response.data.products,
        });
      } catch (error) {
        console.error('Error updating cart product quantity:', error);
      }
    };
  };
  
  export default fetchProducts3;
  

const fetchProducts4 = (pname) => {
  return async (dispatch) => {
    try {
      // Assuming you have the user's token stored in your state or using some authentication mechanism
      const token = await AsyncStorage.getItem('token');
      // Make the API request to remove the product from the cart
      const response = await axios.get('http://192.168.1.104:2001/rem', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
        params: { pname }, // Include 'pname' as a query parameter
        withCredentials: true,
      });

      // Assuming 'cartCount' is returned in the response, modify as needed based on your backend response
     

      // Dispatch the action with the fetched data
      dispatch({
        type: 'FETCH_CPRODUCTS',
        payload: response.data.cart, // Assuming your backend returns cart data
      });
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };
};


  
const deleteProducts = (pid,search,cr) => {
    return async (dispatch) => {
      try {
        // Make the API request to get product data
        const response1 = await axios.delete(`http://192.168.1.104:2001/products/${pid}`);
        
        // Dispatch the action with the fetched data
        const response = await axios.get('http://192.168.1.104:2001/products', {
          params: {
            search: search,
            cr:cr
          },
        });
        
        // Dispatch the action with the fetched data
        dispatch({
          type: 'FETCH_PRODUCTS',
          payload: response.data.products,
        });
        dispatch({
            type: 'total',
            payload: response.data.totalPages
          });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  };
  
  
export { Search11,fetchProducts,deleteProducts,Search,total,current,NullSearch,fetchProducts1,fetchProducts2,fetchProducts3,fetchProducts4,totalPrice,Role,Se,Ca,updateProduct};

