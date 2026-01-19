"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useStore from "@/src/store/useStore";
import {
  Address,
  AddressForm,
  StatusMessage,
  addressFormSchema,
} from "./types";
import {
  deleteAddress,
  fetchAddresses,
  saveAddress,
} from "@/src/queries/account";

const initialAddressForm: AddressForm = {
  name: "",
  phone: "",
  company: "",
  addressLine: "",
  province: "",
  district: "",
  ward: "",
};

const AddressSection = () => {
  const token = useStore((state: any) => state.token);
  const url = useStore((state: any) => state.url);
  const [addressForm, setAddressForm] =
    useState<AddressForm>(initialAddressForm);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressMessage, setAddressMessage] = useState<StatusMessage | null>(
    null,
  );
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);

  const loadAddresses = async () => {
    if (!token) return;
    setAddressesLoading(true);
    try {
      const data = await fetchAddresses(token, url);
      setAddresses(data);
      setAddressMessage(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Lỗi khi tải địa chỉ";
      setAddressMessage({ type: "error", text: message });
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadAddresses();
  }, [token, url]);

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetAddressForm = () => {
    setAddressForm(initialAddressForm);
    setEditingAddressId(null);
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = addressFormSchema.safeParse(addressForm);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Vui lòng kiểm tra thông tin";
      setAddressMessage({ type: "error", text: message });
      return;
    }
    setIsAddressSaving(true);
    try {
      await saveAddress(token, url, parsed.data, editingAddressId ?? undefined);
      setAddressMessage({
        type: "success",
        text: editingAddressId
          ? "Địa chỉ đã được cập nhật"
          : "Địa chỉ đã được thêm",
      });
      resetAddressForm();
      await loadAddresses();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu địa chỉ";
      setAddressMessage({ type: "error", text: message });
    } finally {
      setIsAddressSaving(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      name: address.name ?? "",
      phone: address.phone ?? "",
      company: address.company ?? "",
      addressLine: address.addressLine ?? "",
      province: address.province ?? "",
      district: address.district ?? "",
      ward: address.ward ?? "",
    });
    setEditingAddressId(address.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) return;
    try {
      await deleteAddress(token, url, id);
      setAddressMessage({ type: "success", text: "Địa chỉ đã được xóa" });
      await loadAddresses();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa địa chỉ";
      setAddressMessage({ type: "error", text: message });
    }
  };

  if (!token) return null;

  return (
    <section className="account-card account-addresses" id="address-section">
      <div className="account-card-header">
        <div>
          <h2>Địa chỉ giao hàng</h2>
          <p>Thêm nhiều địa chỉ để chọn khi bạn tạo đơn mới.</p>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={resetAddressForm}
        >
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
                  <button
                    type="button"
                    onClick={() => handleEditAddress(address)}
                  >
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
};

export default AddressSection;
