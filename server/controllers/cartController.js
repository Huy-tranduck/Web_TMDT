const { User, Product } = require('../models/models');

// Get cart
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.productId');
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        const formattedCart = user.cart.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            img: item.productId.img, 
            price: item.productId.price,
            quantity: item.quantity
        }));

        res.json({ cart: formattedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add to cart
const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id).populate('cart.productId');
        
        const existingProduct = user.cart.find(item => 
            item.productId._id.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            user.cart.push({ productId, quantity: 1 });
        }

        await user.save();
        await user.populate('cart.productId');

        const formattedCart = user.cart.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            img: item.productId.img,
            price: item.productId.price,
            quantity: item.quantity
        }));

        res.json({ cart: formattedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Decrease quantity
const decreaseQuantity = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id).populate('cart.productId');

        const existingProduct = user.cart.find(item => 
            item.productId._id.toString() === productId
        );

        if (!existingProduct) {
            return res.status(404).json({ 
                success: false,
                message: 'Sản phẩm không có trong giỏ hàng' 
            });
        }

        if (existingProduct.quantity > 1) {
            existingProduct.quantity -= 1;
            await user.save();
        } else {
            // Nếu số lượng = 1, xóa sản phẩm khỏi giỏ
            user.cart = user.cart.filter(item => 
                item.productId._id.toString() !== productId
            );
            await user.save();
        }

        await user.populate('cart.productId');
        
        const formattedCart = user.cart.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            img: item.productId.img,
            price: item.productId.price,
            quantity: item.quantity
        }));

        res.json({ 
            success: true,
            cart: formattedCart 
        });

    } catch (error) {
        console.error('Error in decreaseQuantity:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Remove item completely
const removeItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false, 
                message: 'productId is required'
            });
        }

        // Tìm user và xóa sản phẩm khỏi giỏ hàng
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { productId } } },
            { new: true }
        ).populate('cart.productId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Format cart data cho response
        const formattedCart = user.cart.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            img: item.productId.img, 
            price: item.productId.price,
            quantity: item.quantity
        }));

        res.json({
            success: true,
            cart: formattedCart
        });

    } catch (error) {
        console.error('Error in removeItem:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove selected items
const removeSelectedItems = async (req, res) => {
    try {
        const { selectedProductIds } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(selectedProductIds) || selectedProductIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Danh sách sản phẩm không hợp lệ'
            });
        }

        // Update cart by removing selected products
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { productId: { $in: selectedProductIds } } } },
            { new: true }
        ).populate('cart.productId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Format cart data for response
        const formattedCart = user.cart.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            img: item.productId.img,
            price: item.productId.price,
            quantity: item.quantity
        }));

        res.json({
            success: true,
            cart: formattedCart
        });

    } catch (error) {
        console.error('Error removing selected items:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart, 
    decreaseQuantity,
    removeItem,
    removeSelectedItems
};