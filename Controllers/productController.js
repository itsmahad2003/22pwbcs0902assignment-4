
import ProductModel from "../Models/ProductCollection.js"

export const addProduct = async (req, res) => {
    const {name, category, discription, dialradius, price, image} = req.body;
    
    try {
      // Create a new instance of the Product model and populate it with the data
      const newProduct = new ProductModel({
            name,
            category,
            discription,
            dialradius,
            price,
            image: req.file.path
      });
  
      // Save the new product to the database
      const savedProduct = await newProduct.save();
  
      // Send a success response
      res.json({ Response: true, message: 'Product added successfully'});
      console.log('Product added successfully');
    } catch (error) {
      // Handle any errors and send an error response
      console.error(error);
      res.status(500).json({ message: 'Failed to add product' });
    }
  };

export const getProducts = async (req, res) =>
{
    try {
        const productData = await ProductModel.find();
        res.json(productData);
    } catch (error) {
        console.log("Not found any data..");
    }    
}

export const getProductByCategory = async (req, res) => {
  const {category} = req.body;
  console.log(category)
  try {
    const menProducts = await ProductModel.find();
    const filteredProducts =menProducts.filter((product)=> product.category===category)
    console.log(filteredProducts)
    res.json(filteredProducts)
  } catch (error) {
    console.log("No data found...");
  }
};


export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.log('Error retrieving product details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) =>{
  const { productId } = req.params;
  try {
    await ProductModel.findByIdAndDelete(productId);
  } catch (error) {
    console.log(error);
  }
};

export const UpdateProduct = async (req, res) => {
  console.log(req.body);
  try {
    const {id} = req.params;
    const {name, category, discription, dialradius, price} = req.body;

    console.log(id);
    console.log(price);
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
      name, 
      category, 
      discription, 
      dialradius, 
      price
    }, {new: true});
    console.log(updatedProduct);
    if(updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.json("Product Not found");
    }
  } catch (error) {
    console.log(error);
  }
}
