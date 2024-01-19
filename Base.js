let bcrypt = require('bcryptjs');
let jwt = require("jsonwebtoken");
let {app} = require("./Mongo");
let {profile, product,tota} = require("./Models");
const multer = require('multer');
let cookie = require("cookie-parser");
const fs = require('fs');

app.use(cookie());
let {signoutMiddleware,extractEmailMiddleware,extractTokenMiddleware} = require("./Middle");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const customFileName = `${timestamp}-${file.originalname}`; // Custom filename
      cb(null, customFileName);
    }
  });
  
  const upload = multer({ storage: storage });
  
  app.post("/signup", upload.single('profilePic'), async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        city,
        country,
        pass
      } = req.body;
  
      // Check if any input field is empty
  
      // Check if a user with the same email already exists
      const existingUser = await profile.findOne({ email });
  
      if (existingUser) {
        // User with the same email already exists
        console.log("User with the same email already exists");
        return res.status(203).json({ message: "User with the same email already exists" });
      }
      console.log(req.body);
      // Hash the password asynchronously
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(req.body.pass, 10);
      } catch (error) {
        console.error('Error hashing password:', error);
        // handle the error, possibly send an error response
        return res.status(500).json({ message: "Internal Server Error" });
      }
  
      // No user found with the same email, proceed with insertion
      const newProfile = new profile({
        fname: firstName,
        lname: lastName,
        phone,
        email,
        city,
        country,
        pass: hashedPassword, // Save the hashed password
        profilePic: req.file ? req.file.filename : "3364044.png",
        role: "customer"
      });
  
      await newProfile.save();
      console.log("User registered successfully");
      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

  function generateToken(user) {
    return jwt.sign({ userId: user.id}, secretKey);
  }


  app.get('/signin', async (req, res) => {
    try {
      const { email1, pass1 } = req.query;
      console.log('Received request with email:', email1, 'and password:', pass1);
  
      // Find the user by email
      const user = await profile.findOne({ email: email1 });
  
      if (user && (await bcrypt.compare(pass1, user.pass))) {
        // Passwords match, generate JWT token using the method
        const token = await user.generateToken();
        
        // Send success response with additional information
        res.status(200).json({
          message: 'Sign in successful',
          user: {
            role: user.role,
          },
          token: token, // Send the token in the response
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  



app.post('/signout', signoutMiddleware);

app.post('/add', upload.single('img'), async (req, res) => {
    try {
        const { pname, desc, quant, price, category } = req.body;

        // Check if a product with the same name already exists
        const existingProduct = await product.findOne({ pname });

        if (existingProduct) {
            console.log('Product with the same name already exists');
            return res.status(201).json({ message: 'Product with the same name already exists' });
        }

        // Check if any of the required fields is empty
        if (!pname || !desc || !category) {
            console.log('Please fill in all the required fields.', pname, desc, category);
            return res.status(202).json({ message: 'Please fill in all the required fields.' });
        }

        // Check if quantity is negative
        if (quant < 0) {
            console.log('Quantity cannot be negative');
            return res.status(203).json({ message: 'Quantity cannot be negative' });
        }

        // Check if price is negative
        if (price < 0) {
            console.log('Price cannot be negative');
            return res.status(204).json({ message: 'Price cannot be negative' });
        }

        // Check if a file is uploaded
        const img = req.file ? req.file.filename : "Pr.jpg";

        const newProduct = new product({
            pname,
            desc,
            quant,
            price,
            category,
            img,
        });

        await newProduct.save();
        console.log('Product added successfully');
        res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const path = require('path');

app.get('/profile', async (req, res) => {
  try {
    // Get the token from the 'Authorization' header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, 'your-secret-key');

    // Extract user ID from the decoded token
    const userId = decodedToken.userId;

    // Fetch profile data from the database using the user ID
    const user = await profile.findById(userId);

    // Fetch product data from the database
    const products = await product.find();

    // Aggregate to calculate total quantity for each category
    const categoryQuantities = await product.aggregate([
      {
        $group: {
          _id: '$category',
          totalQuantity: { $sum: '$quant' },
        },
      },
    ]);

    // Fetch the total price from the 'tota' model
    const totalDocument = await tota.findOne();

    if (user && totalDocument) {
      // If profilePic exists, create the image file path
      const filePath = user.profilePic ? path.join(__dirname, 'uploads', user.profilePic) : null;
      if (filePath && !fs.existsSync(filePath)) {
        console.error(`Profile picture not found: ${filePath}`);
        res.status(404).json({ message: 'Profile picture not found' });
        return;
      }
      if (filePath) {
        res.setHeader('Content-Type', 'image/jpg');
      }
      
      // Fetch the total count of profiles
      const totalCount = await profile.countDocuments();
      console.log(filePath)
      // Return the user profile data along with the image file URL, total count, and price
      res.status(200).json({
        tc: totalCount - 1,
        userId: user._id,
        fname: user.fname,
        lname: user.lname,
        phone: user.phone,
        email: user.email,
        city: user.city,
        country: user.country,
        role: user.role,
        profilePic: filePath ? `/uploads/${user.profilePic}` : null,
        price: totalDocument.price,
        categoryQuantities: categoryQuantities,
      });
    } else {
      // User or total document not found
      res.status(404).json({ message: 'User or total document not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

  app.get('/products', async (req, res) => {
    try {
      const { search, cr } = req.query;
      const pageSize = 10;
  
      // Calculate the skip value based on the current page
      const skip = Math.max((cr ? cr : 1) - 1, 0) * pageSize;
  
      // Define the search criteria based on the presence of the search parameter
      const searchCriteria = search ? { pname: { $regex: search, $options: 'i' } } : {};
  
      // Fetch products for the specified page
      const products = await product.find(searchCriteria).skip(skip).limit(pageSize);
  
      // Count the total number of documents in the collection
      const totalDocuments = await product.countDocuments(searchCriteria);
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalDocuments / pageSize);
  
      // Log the search criteria and results
     
  
      // Return the products with images and total pages as JSON
      const productsWithImages = products.map(product => ({
        pname: product.pname,
        desc: product.desc,
        quant: product.quant,
        img: `/uploads/${product.img}`,
        price: product.price,
        category: product.category,
      }));
  
      res.status(200).json({ products: productsWithImages, totalPages });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  app.get('/products12', async (req, res) => {
    try {
      const { search, cr, pr } = req.query;
      const pageSize = 10;
      console.log(pr);
      // Calculate the skip value based on the current page
      const skip = Math.max((cr ? cr : 1) - 1, 0) * pageSize;
  
      // Define the search criteria based on the presence of the search parameter
      const searchCriteria = search ? { pname: { $regex: search, $options: 'i' } } : {};
  
      // Extract the category string from the object
      const category = pr && pr !== 'all' ? pr : null;

  
      // Define criteria for category filtering
      const categoryCriteria = category ? { category } : {};
  
      // Combine search criteria and category criteria
      const combinedCriteria = { ...searchCriteria, ...categoryCriteria };
  
      // Fetch products for the specified page, search, and category
      const products = await product.find(combinedCriteria).skip(skip).limit(pageSize);
  
      // Count the total number of documents in the collection for the specified criteria
      const totalDocuments = await product.countDocuments(combinedCriteria);
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalDocuments / pageSize);
  
      // Log the search criteria and results
  
      // Return the products with images and total pages as JSON
      const productsWithImages = products.map(product => ({
        pname: product.pname,
        desc: product.desc,
        quant: product.quant,
        img: `/uploads/${product.img}`,
        price: product.price,
        category: product.category,
      }));
  
      res.status(200).json({ products: productsWithImages, totalPages });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  
  app.delete('/products/:pname', async (req, res) => {
    try {
      const pname = req.params.pname;
      console.log(pname);
  
      // Check if the product exists
      const existingProduct = await product.findOne({ pname });
  
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Delete the product from the database
      await product.findOneAndDelete({ pname });
  
      // Fetch all products from the database after deletion
      const products = await product.find();
  
      // Return the products with images as JSON
      const productsWithImages = products.map(product => ({
        pname: product.pname,
        desc: product.desc,
        quant: product.quant,
        img: `/uploads/${product.img}`, // Assuming your images are in an 'uploads' directory
        price: product.price,
        category: product.category,
      }));
  
      // Delete the product from all users' carts
      const users = await profile.find({ 'cart.pname': pname });
  
      users.forEach(async (user) => {
        const updatedCart = user.cart.filter(cartProduct => cartProduct.pname !== pname);
  
        // Update the user's cart with the modified cart
        user.cart = updatedCart;
  
        // Save the changes to the user document
        await user.save();
      });
  
      // Return the updated list of products
      res.status(200).json({ message: 'Product deleted successfully', products: productsWithImages });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

app.put('/updateProduct', async (req, res) => {
  try {
    const { pname, newPrice, newQuantity } = req.body;

    // Check if the product exists
    const existingProduct = await product.findOne({ pname });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Save the current quantity and price in cart for comparison
    const currentQuantityInCart = existingProduct.quant;
    const currentPriceInCart = existingProduct.price;

    // Update price and quantity
    existingProduct.price = newPrice;
    existingProduct.quant = newQuantity;

    // Save the updated product
    await existingProduct.save();

    // If quantity or price is updated, update the quantity and price in all users' carts
    const users = await profile.find({ 'cart.pname': pname });

    users.forEach(async (user) => {
      const cartProducts = user.cart || [];

      const updatedCart = cartProducts.map((cartProduct) => {
        if (cartProduct.pname === pname) {
          // Update the quantity and price in cart
          if (cartProduct.quant > newQuantity) {
            // If cart qty is greater than new qty, update cart qty to new qty
            cartProduct.quant = newQuantity;
          }
          // Update the total based on the new quantity and price
          cartProduct.price = newPrice;
        }
        return cartProduct;
      });

      // Update the user's cart with the modified cart
      user.cart = updatedCart;

      // Save the changes to the user document
      await user.save();
    });

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




const openai = require('openai');
openai.apiKey = "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";

app.post('/chatgpt', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await openai.Completion.create({
        engine: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 0.5,
    });

    res.json({ text: response.choices[0].text });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
}

});

const verifyToken = (req, res, next) => {
  const token = req.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token missing' });
  }
  console.log("s");

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    req.userid = decoded.userid;
    next();
  });
};

app.post('/addcart', async (req, res) => {
  const { pname, price, qty } = req.body;
  const userEmail = req.headers.authorization && req.headers.authorization.split(' ')[1];
  try {
    // Verify the JWT token
    const decoded = jwt.verify(userEmail, 'your-secret-key');

    // Find the user by email
    const user = await profile.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(202).json({ message: 'Please Sign in properly' });
    }

    // Check if the product is already in the cart
    const existingProduct = user.cart.find(item => item.pname === pname);

    if (existingProduct) {
      return res.status(201).json({ message: 'Product already in the cart' });
    }

    // Add the item to the cart
    user.cart.push({ pname, price, quant: qty });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/getcart', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }

  try {
    // Verify the token and extract user email
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace 'yourSecretKey' with your actual secret key
    const userEmail = decodedToken.userId;

    // Find the user in the database using the email
    const user = await profile.findOne({ _id: userEmail  });

    if (!user) {
      return res.status(202).json({ message: 'Please sign in properly' });
    }

    // Retrieve the user's cart products
    const cartProducts = user.cart || [];

    res.status(200).json({ products: cartProducts });
  } catch (error) {
    console.error('Error fetching cart:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/upqty', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }
  
  try {
    // Verify the token and extract user email
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace 'yourSecretKey' with your actual secret key
    const userEmail = decodedToken.userId;
    
    const { pname, e } = req.query;
    
    const user = await profile.findOne({ _id: userEmail });
    
    if (!user) {
      return res.status(202).json({ message: 'Please sign in properly' });
    }
    
    const cartProducts = user.cart || [];
    
    // Find the product in the cart by pname
    const productToUpdate = cartProducts.find(product => product.pname === pname);
    
    if (productToUpdate) {
      // Retrieve the product details from the prodsche schema
      const productDetails = await product.findOne({ pname });
      
      if (!productDetails) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Check if e is less than the quantity in the product schema and greater than or equal to 1
      console.log("hi",productDetails);
      if (e <= productDetails.quant && e >= 1) {
        // Update the quantity in the cart
        productToUpdate.quant = e;
        // Save the changes to the user document
        await user.save();

        return res.status(200).json({ message: 'Cart updated successfully', products: user.cart });
      } else {
        return res.status(400).json({ message: 'Quantity cannot be increased beyond the available stock' });
      }
    } else {
      return res.status(404).json({ message: 'Product not found in the cart' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/rem', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }
  
  // Verify the token and extract user email
  try {
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace 'yourSecretKey' with your actual secret key
    const userEmail = decodedToken.userId;
    const { pname } = req.query;
    const user = await profile.findOne({ _id: userEmail });
    
    if (!user) {
      return res.status(202).json({ message: 'Please sign in properly' });
    }
    
    const cartProducts = user.cart || [];
    
    // Remove the product with the specified pname from the cart
    const updatedCart = cartProducts.filter(product => product.pname !== pname);
    
    // Update the user's cart with the modified cart
    user.cart = updatedCart;
    console.log(user);

    // Save the changes to the user document
    await user.save();

    res.status(200).json({ message: 'Product removed from the cart', cart: updatedCart });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/checkout', async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not provided' });
  }
  
  
  try {
    const decodedToken = jwt.verify(token, 'your-secret-key'); // Replace 'yourSecretKey' with your actual secret key
    const userEmail = decodedToken.userId;
    const user = await profile.findOne({ _id: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalPrice = user.cart.reduce((acc, product) => acc + product.price * product.quant, 0);

    for (const product1 of user.cart) {
      const existingProduct = await product.findOne({ pname: product1.pname });

      if (existingProduct) {
        existingProduct.quant -= product1.quant;
        await existingProduct.save();

        // Update quantity in all user carts
        const allUsers = await profile.find();
        for (const currentUser of allUsers) {
          const cartToUpdate = currentUser.cart.find(cartProduct => cartProduct.pname === product1.pname);
          if (cartToUpdate) {
            if (cartToUpdate.quant > existingProduct.quant) {
              cartToUpdate.quant = existingProduct.quant;
            }
          }
        }
        await Promise.all(allUsers.map(user => user.save()));
      }
    }

    user.cart = [];
    await user.save();

    // Save the total price to the 'total' schema
    await tota.findOneAndUpdate({}, { price: totalPrice });

    return res.status(200).json({ totalPrice });
  } catch (error) {
    console.error('Error during checkout:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/getRole', extractTokenMiddleware, (req, res) => {
  res.json({ role: req.role });
});

app.post('/cartcount', extractEmailMiddleware, async (req, res) => {
  const userEmail = req.userid;

  try {
    const user = await profile.findOne({ _id: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the count of items in the cart array
    const cartCount = user.cart.length;

    res.json({ cartCount });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/",(req,res)=>{
    res.send("hello");
});


app.listen(2001);