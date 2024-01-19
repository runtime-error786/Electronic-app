let {profile} = require("./Models");
let jwt = require("jsonwebtoken");

const signoutMiddleware = async (req, res, next) => {
  try {
    // Assuming you are passing the token in the headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Remove the token from the user's tokens array in the profile schema
    const user = await profile.findOne({ tokens: { $in: [token] } });
    if (user) {
      user.tokens = user.tokens.filter(t => t !== token);
      await user.save();
    }

    // Send a successful response
    res.status(200).json({ message: 'User successfully signed out' });
  } catch (error) {
    console.error('Error during sign-out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  const extractEmailMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Assuming the token is sent in the Authorization header
   
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your-secret-key');
      req.userid = decoded.userId;
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  const extractTokenMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("hello1");

    if (!token) {
      req.role = 'guest'; // Set the default role for guests

    } else {
      try {
        const decoded = jwt.verify(token, 'your-secret-key'); // Replace 'your-secret-key' with your actual secret key
        const userId = decoded.userId; // Extract the user ID from the decoded token
        // Find the user in the profile schema using the ID
        const user = await profile.findById(userId);
  
        if (user) {
          req.role = user.role; // Set the role from the user profile

        } else {
          req.role = 'guest'; // Set the default role for guests if user is not found

        }
  
      } catch (error) {
        console.error('Error decoding JWT:', error);
        req.role = 'guest'; // Set the default role for guests in case of token decoding errors

      }
    }
  
    next();
  };
  
  module.exports = {signoutMiddleware,extractEmailMiddleware,extractTokenMiddleware};