const { User } = require('../models/models');
const { Product } = require('../models/models');

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const existingItem = user.cart.find(item => item.productId._id.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1; // Mặc định tăng 1
        } else {
            user.cart.push({ productId, quantity: 1 }); // Thêm mới với số lượng 1
        }

        await user.save();
        await user.populate('cart.productId');

        const formattedCart = user.cart.map(item => {
            const product = item.productId;
            return {
                id: product._id,
                name: product.name,
                company: product.company,
                img: product.img,
                price: product.price,
                quantity: item.quantity,
                promo: product.promo,
                detail: product.detail,
                star: product.star,
                rateCount: product.rateCount,
                masp: product.masp
            };
        });

        res.status(200).json({ message: 'Đã thêm 1 sản phẩm vào giỏ hàng', cart: formattedCart });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
    }
};


// Lấy giỏ hàng của người dùng
const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        // Tìm người dùng và populate thông tin sản phẩm trong giỏ hàng
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Định dạng lại dữ liệu giỏ hàng để trả về
        const formattedCart = user.cart.map(item => {
            const product = item.productId;
            return {
                id: product._id,
                name: product.name,
                company: product.company,
                img: product.img,
                price: product.price,
                quantity: item.quantity,
                promo: product.promo,
                detail: product.detail,
                star: product.star,
                rateCount: product.rateCount,
                masp: product.masp
            };
        });

        res.status(200).json({ cart: formattedCart });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng', error: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const existingItem = user.cart.find(item => item.productId._id.toString() === productId);
        if (!existingItem) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }

        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1; // Giảm số lượng 1
        } else {
            // Nếu chỉ còn 1 → xóa khỏi giỏ luôn
            user.cart = user.cart.filter(item => item.productId._id.toString() !== productId);
        }

        await user.save();
        await user.populate('cart.productId');

        const formattedCart = user.cart.map(item => {
            const product = item.productId;
            return {
                id: product._id,
                name: product.name,
                company: product.company,
                img: product.img,
                price: product.price,
                quantity: item.quantity,
                promo: product.promo,
                detail: product.detail,
                star: product.star,
                rateCount: product.rateCount,
                masp: product.masp
            };
        });

        res.status(200).json({ message: 'Đã xóa 1 sản phẩm khỏi giỏ hàng', cart: formattedCart });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
// const updateCartQuantity = async (req, res) => {
//     const userId = req.user.id;
//     const { productId, quantity } = req.body;

//     try {
//         const user = await User.findById(userId).populate('cart.productId');
//         if (!user) {
//             return res.status(404).json({ message: 'Người dùng không tồn tại' });
//         }

//         const existingItem = user.cart.find(item => item.productId._id.toString() === productId);
//         if (!existingItem) {
//             return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
//         }

//         existingItem.quantity = quantity;
//         await user.save();
//         await user.populate('cart.productId');

//         const formattedCart = user.cart.map(item => {
//             const product = item.productId;
//             return {
//                 id: product._id,
//                 name: product.name,
//                 company: product.company,
//                 img: product.img,
//                 price: product.price,
//                 quantity: item.quantity,
//                 promo: product.promo,
//                 detail: product.detail,
//                 star: product.star,
//                 rateCount: product.rateCount,
//                 masp: product.masp
//             };
//         });

//         res.status(200).json({ message: 'Cập nhật số lượng thành công', cart: formattedCart });
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi cập nhật số lượng', error: error.message });
//     }
// };


const updateCartQuantity = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const existingItem = user.cart.find(item => item.productId._id.toString() === productId);
        if (!existingItem) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }

        // Xoá mặt hàng khỏi giỏ
        user.cart = user.cart.filter(item => item.productId._id.toString() !== productId);

        await user.save();
        await user.populate('cart.productId');

        const formattedCart = user.cart.map(item => {
            const product = item.productId;
            return {
                id: product._id,
                name: product.name,
                company: product.company,
                img: product.img,
                price: product.price,
                quantity: item.quantity,
                promo: product.promo,
                detail: product.detail,
                star: product.star,
                rateCount: product.rateCount,
                masp: product.masp
            };
        });

        res.status(200).json({ message: 'Đã xoá sản phẩm khỏi giỏ hàng', cart: formattedCart });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xoá sản phẩm', error: error.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart, updateCartQuantity };