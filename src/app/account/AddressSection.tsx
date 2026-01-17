"use client";

import { FormEvent, ChangeEvent } from "react";
import { Address, AddressForm, StatusMessage } from "./types";

type AddressSectionProps = {
  addressForm: AddressForm;
  handleAddressChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAddressSubmit: (event: FormEvent<HTMLFormElement>) => void;
  addressMessage: StatusMessage | null;
  isAddressSaving: boolean;
  resetAddressForm: () => void;
  editingAddressId: string | null;
  addresses: Address[];
  addressesLoading: boolean;
  handleEditAddress: (address: Address) => void;
  handleDeleteAddress: (id: string) => void;
};

const AddressSection = ({
  addressForm,
  handleAddressChange,
  handleAddressSubmit,
  addressMessage,
  isAddressSaving,
  resetAddressForm,
  editingAddressId,
  addresses,
  addressesLoading,
  handleEditAddress,
  handleDeleteAddress,
}: AddressSectionProps) => (
  <section className="account-card account-addresses" id="address-section">
    <div className="account-card-header">
      <div>
        <h2>Địa chỉ giao hàng</h2>
        <p>Thêm nhiều địa chỉ để chọn khi bạn tạo đơn mới.</p>
      </div>
      <button type="button" className="text-button" onClick={resetAddressForm}>
        {editingAddressId ? "Thêm địa chỉ khác" : "Thêm địa chỉ mới"}
      </button>
    </div>

    {addressMessage && (
      <p className={`account-status ${addressMessage.type}`}>
        {addressMessage.text}
      </p>
    )}

    <form
      className="account-form account-address-form"
      onSubmit={handleAddressSubmit}
    >
      <div className="account-form-grid">
        <label>
          <span>Người nhận</span>
          <input
            name="name"
            value={addressForm.name}
            onChange={handleAddressChange}
            placeholder="Tên người nhận"
          />
        </label>
        <label>
          <span>Điện thoại</span>
          <input
            name="phone"
            value={addressForm.phone}
            onChange={handleAddressChange}
            placeholder="0912345678"
          />
        </label>
        <label>
          <span>Công ty (tùy chọn)</span>
          <input
            name="company"
            value={addressForm.company}
            onChange={handleAddressChange}
            placeholder="Tên công ty, nếu có"
          />
        </label>
        <label>
          <span>Địa chỉ chi tiết</span>
          <input
            name="addressLine"
            value={addressForm.addressLine}
            onChange={handleAddressChange}
            placeholder="Số nhà, đường, phường"
          />
        </label>
        <label>
          <span>Tỉnh/Thành phố</span>
          <input
            name="province"
            value={addressForm.province}
            onChange={handleAddressChange}
            placeholder="TP. Hồ Chí Minh"
          />
        </label>
        <label>
          <span>Quận/Huyện</span>
          <input
            name="district"
            value={addressForm.district}
            onChange={handleAddressChange}
            placeholder="Quận 1"
          />
        </label>
        <label>
          <span>Phường/Xã</span>
          <input
            name="ward"
            value={addressForm.ward}
            onChange={handleAddressChange}
            placeholder="Phường Bến Nghé"
          />
        </label>
      </div>

      <div className="account-form-actions">
        <button type="submit" className="primary" disabled={isAddressSaving}>
          {isAddressSaving
            ? "Đang lưu..."
            : editingAddressId
            ? "Cập nhật địa chỉ"
            : "Lưu địa chỉ"}
        </button>
        {editingAddressId && (
          <button
            type="button"
            className="text-button"
            onClick={resetAddressForm}
          >
            Hủy chỉnh sửa
          </button>
        )}
      </div>
    </form>

    <div className="address-list">
      {addressesLoading ? (
        <p className="account-status info">Đang tải danh sách địa chỉ…</p>
      ) : addresses.length > 0 ? (
        <ul>
          {addresses.map((address) => (
            <li key={address.id} className="address-item">
              <div>
                <p className="address-meta">
                  <strong>{address.name}</strong> · {address.phone}
                </p>
                {address.company && (
                  <p className="address-company">{address.company}</p>
                )}
                <p className="address-line">
                  {address.addressLine}, {address.ward}, {address.district},{" "}
                  {address.province}
                </p>
              </div>
              <div className="address-actions">
                <button type="button" onClick={() => handleEditAddress(address)}>
                  Sửa
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="account-status info">Bạn chưa thêm địa chỉ nào.</p>
      )}
    </div>
  </section>
);

export default AddressSection;
