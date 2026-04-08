"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { assets } from "@/src/assets/assets";
import { productAPI } from "@/src/apiRequests/product";
import styles from "./Search.module.scss";

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
    <div className={styles.searchWrapper} ref={searchWrapperRef}>
      <button
        type="button"
        className={styles.navIconBtn}
        onClick={() => setSearchOpen((prev) => !prev)}
        aria-label="Mở tìm kiếm"
      >
        <Image src={assets.search_icon} alt="Tìm kiếm" width={22} height={22} />
      </button>

      {searchOpen && (
        <div className={styles.searchPopover}>
          <input
            type="text"
            className={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Tìm theo tên sản phẩm..."
            autoFocus
          />

          {showSearchResult && (
            <div className={styles.searchResultList}>
              {isSearching && (
                <div
                  className={`${styles.searchResultItem} ${styles.searchResultEmpty}`}
                >
                  Đang tìm kiếm...
                </div>
              )}

              {!isSearching && products.length === 0 && (
                <div
                  className={`${styles.searchResultItem} ${styles.searchResultEmpty}`}
                >
                  Không tìm thấy sản phẩm
                </div>
              )}

              {!isSearching &&
                products.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    className={styles.searchResultItem}
                    onClick={() => handleProductSelect(product.slug)}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        className={styles.searchResultImage}
                        width={56}
                        height={56}
                        unoptimized
                      />
                    ) : (
                      <div
                        className={`${styles.searchResultImage} ${styles.searchResultImagePlaceholder}`}
                      />
                    )}
                    <span className={styles.searchResultName}>
                      {product.name}
                    </span>
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
