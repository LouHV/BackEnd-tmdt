import './modalUpdateCoupon.css';
import React, { useState } from 'react';

const ModalUpdateCoupon = ({ onClose, updateCoupons, setUpdateCoupons, handleUpdate }) => {
    const [couponData, setCouponData] = useState(updateCoupons);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Thực hiện xử lý cập nhật thông tin người dùng ở đây
        // Ví dụ: Gửi dữ liệu đến API hoặc thực hiện các hành động cập nhật khác
        handleUpdate(couponData);
        onClose();
    };
    const hsd = Math.round(Math.round(new Date(couponData.expiry).getTime() / 24 / 60 / 60 / 1000) - Math.round(new Date(couponData.start_date).getTime() / 24 / 60 / 60 / 1000))
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCouponData({ ...couponData, [name]: value });
        setUpdateCoupons({ ...couponData, [name]: value }); // Cập nhật state ở ngoài component
    };

    return (
        <div className="modal">
            <form className="modal-content" on onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h1>Update Coupon</h1>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="name_coupon">Name Coupon:</label>
                        <input type="text" id="name_coupon" name="name_coupon" value={couponData.name_coupon} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="discount">Discount:</label>
                        <input type="text" id="discount" name="discount" value={couponData.discount} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input type="text" id="quantity" name="quantity" value={couponData.quantity} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="start_date">Start Day:</label>
                        <input type="text" id="start_date" name="start_date" value={couponData.start_date} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiry">Expiry:(số nguyên dương)</label>
                        <input type="number" id="expiry" name="expiry" value={hsd} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="submit-btn" onClick={handleUpdate}>Update</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ModalUpdateCoupon;
