const Product = require('../models/models');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .select('name price star img masp')
            .sort({ createdAt: -1 });
        
        res.json(products);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .select('name price star img masp')
            .sort({ star: -1, rateCount: -1 })  // Sắp xếp theo star và rateCount
            .limit(10);  // Giới hạn 10 sản phẩm
        
        res.json(products);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getNewProducts = async (req, res) => {
    try {
        const newProducts = await Product.find({})
            .select('name company img price star rateCount promo masp')
            .sort({ _id: -1 }) // Sắp xếp theo _id để lấy sản phẩm mới nhất
            .limit(10);
            
        res.json(newProducts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getInstallmentProducts = async (req, res) => {
    try {
        const installmentProducts = await Product.find({
            'promo.name': 'tragop' // Lọc sản phẩm có promo.name là 'tragop'
        })
        .select('name company img price star rateCount promo masp')
        .sort({ price: -1 }) // Sắp xếp theo giá giảm dần
        .limit(10);
            
        res.json(installmentProducts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getShockingProducts = async (req, res) => {
    try {
        const shockingProducts = await Product.find({
            'promo.name': 'giareonline' // Lọc sản phẩm có promo.name là 'giareonline'
        })
        .select('name company img price star rateCount promo masp')
        .sort({ 'promo.value': 1 }) // Sắp xếp theo giá khuyến mãi tăng dần
        .limit(10);
        
        res.json(shockingProducts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getBigDiscountProducts = async (req, res) => {
    try {
        const bigDiscountProducts = await Product.find({
            'promo.name': 'giamgia' // Lọc sản phẩm có promo.name là 'giamgia'
        })
        .select('name company img price star rateCount promo masp')
        .sort({ 'promo.value': -1 }) // Sắp xếp theo giá trị giảm giá giảm dần
        .limit(10);
        
        res.json(bigDiscountProducts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getCheapProducts = async (req, res) => {
    try {
        const maxPrice = 3000000; // Giá tối đa 3 triệu
        const cheapProducts = await Product.find({
            price: { $regex: /^\d+(\.\d{3})*$/ } // Đảm bảo price là string chứa số
        })
        .select('name company img price star rateCount promo masp')
        .sort({ price: 1 }) // Sắp xếp theo giá tăng dần
        .limit(10);

        // Lọc và chuyển đổi giá từ string sang number để so sánh
        const filteredProducts = cheapProducts.filter(product => {
            const priceNumber = parseFloat(product.price.replace(/\./g, ''));
            return priceNumber <= maxPrice;
        });
        
        res.json(filteredProducts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { query } = req.query; // Lấy query từ URL parameter
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Tìm kiếm không phân biệt hoa thường và một phần của tên
        const products = await Product.find({
            name: { $regex: query, $options: 'i' }
        })
        .select('name company img price star rateCount promo masp')
        
        res.json(products);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getProductsByCompany = async (req, res) => {
    try {
        const { company } = req.params;
        
        if (!company) {
            return res.status(400).json({ message: 'Company name is required' });
        }

        // Tìm kiếm các sản phẩm có company match với param
        const products = await Product.find({
            company: { $regex: company, $options: 'i' }
        })
        .select('name company img price star rateCount promo masp')
        
        res.json(products);

    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: error.message });
    }
};

const getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID is required' 
            });
        }

        const product = await Product.findOne({ masp: id })
            .select('name company img price star rateCount promo detail masp');

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        // Cấu trúc lại response để include tất cả thông tin cần thiết
        const productDetail = {
            success: true,
            product: {
                id: product.masp,
                name: product.name,
                company: product.company,
                image: product.img,
                price: product.price,
                star: product.star,
                rateCount: product.rateCount,
                promotion: product.promo,
                specifications: {
                    screen: product.detail.screen,
                    os: product.detail.os,
                    camara: product.detail.camara,
                    camaraFront: product.detail.camaraFront,
                    cpu: product.detail.cpu,
                    ram: product.detail.ram,
                    rom: product.detail.rom,
                    microUSB: product.detail.microUSB,
                    battery: product.detail.battery
                }
            }
        };

        res.json(productDetail);

    } catch (error) {
        console.error('Error in getProductDetail:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching product details',
            error: error.message 
        });
    }
};

module.exports = {
    getProducts,
    getFeaturedProducts,
    getNewProducts,
    getInstallmentProducts,
    getShockingProducts,
    getBigDiscountProducts,
    getCheapProducts,
    searchProducts,
    getProductsByCompany,
    getProductDetail
};
