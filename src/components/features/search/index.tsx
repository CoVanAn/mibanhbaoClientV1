"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { assets } from "@/src/assets/assets";
import { productAPI } from "@/src/apiRequests/product";
import "./Search.scss";

const ProductSearch = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: searchedProducts, isFetching: isSearching } = useQuery({
    queryKey: ["navbar-product-search", debouncedSearchText],
    queryFn: async () => {
      const result = await productAPI.getList({
        page: 1,
        limit: 6,
        search: debouncedSearchText,
      });
      return result.data;
    },
    enabled: debouncedSearchText.length > 0,
    staleTime: 60 * 1000,
  });

  const showSearchResult = searchOpen && debouncedSearchText.length > 0;
  const products = useMemo(() => searchedProducts ?? [], [searchedProducts]);

  const handleProductSelect = (slug: string) => {
    setSearchOpen(false);
    setSearchText("");
    setDebouncedSearchText("");
    router.push(`/${slug}`);
  };

  return (
    <div className="search-wrapper" ref={searchWrapperRef}>
      <button
        type="button"
        className="nav-icon nav-icon-btn"
        onClick={() => setSearchOpen((prev) => !prev)}
        aria-label="Mở tìm kiếm"
      >
        <img src={assets.search_icon} alt="Tìm kiếm" />
      </button>

      {searchOpen && (
        <div className="search-popover">
          <input
            type="text"
            className="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm theo tên sản phẩm..."
            autoFocus
          />

          {showSearchResult && (
            <div className="search-result-list">
              {isSearching && (
                <div className="search-result-item search-result-empty">
                  Đang tìm kiếm...
                </div>
              )}

              {!isSearching && products.length === 0 && (
                <div className="search-result-item search-result-empty">
                  Không tìm thấy sản phẩm
                </div>
              )}

              {!isSearching &&
                products.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    className="search-result-item"
                    onClick={() => handleProductSelect(product.slug)}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="search-result-image"
                      />
                    ) : (
                      <div className="search-result-image search-result-image-placeholder" />
                    )}
                    <span className="search-result-name">{product.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
