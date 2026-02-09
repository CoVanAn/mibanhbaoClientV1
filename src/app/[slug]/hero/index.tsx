"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { ProductDetailContext } from "../content";
import VariantSelector from "../variant";
import styles from "./Hero.module.scss";

export default function ProductHero() {
  const context = useContext(ProductDetailContext);
  if (!context) return null;

  const {
    product,
    categoryLabel,
    thumbnails,
    variants,
    mainImage: defaultImage,
  } = context;

  const initialImage = useMemo(
    () => defaultImage || thumbnails[0]?.url || "",
    [defaultImage, thumbnails],
  );
  const [mainImage, setMainImage] = useState(initialImage);

  useEffect(() => {
    const nextImage = defaultImage || thumbnails[0]?.url || "";
    if (nextImage) {
      setMainImage((current) => (current === nextImage ? current : nextImage));
    }
  }, [defaultImage, thumbnails]);

  const displayImage = mainImage || "";

  const sortedThumbnails = thumbnails.filter((image) => image.url);

  const [showPreview, setShowPreview] = useState(false);

  const handleThumbnailClick = (url: string) => {
    if (url) {
      setMainImage(url);
    }
  };

  const openPreview = () => {
    if (displayImage) {
      setShowPreview(true);
    }
  };

  const closePreview = () => setShowPreview(false);

  return (
    <section className={styles.hero}>
      <div className={styles.heroMedia}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className={styles.heroImage}
            loading="lazy"
            onClick={openPreview}
          />
        ) : (
          <div className={styles.heroPlaceholder}>Hình ảnh đang cập nhật</div>
        )}
        <div className={styles.thumbnails}>
          {sortedThumbnails.map((image) => (
            <button
              key={image.id}
              type="button"
              className={`${styles.thumbnailButton} ${
                displayImage === image.url ? styles.thumbnailActive : ""
              }`}
              onClick={() => handleThumbnailClick(image.url)}
            >
              <img
                src={image.url}
                alt={product.name}
                className={styles.thumbnail}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
      {showPreview && (
        <div className={styles.imagePreviewOverlay} onClick={closePreview}>
          <div
            className={styles.imagePreviewContent}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.imagePreviewClose}
              onClick={closePreview}
            >
              ×
            </button>
            <img
              src={displayImage}
              alt={product.name}
              className={styles.imagePreview}
              loading="lazy"
            />
          </div>
        </div>
      )}
      <div className={styles.heroInfo}>
        <p className={styles.categoryTag}>{categoryLabel}</p>
        <h1>{product.name}</h1>
        <div className={styles.heroBadges}>
          {product.isFeatured && <span className={styles.badge}>Nổi bật</span>}
          {product.isActive && (
            <span className={styles.badgeActive}>Đang bán</span>
          )}
        </div>
        <p className={styles.description}>{product.description}</p>
        <VariantSelector variants={variants} productId={product.id} />
        <div className={styles.ctaGroup}></div>
      </div>
    </section>
  );
}
