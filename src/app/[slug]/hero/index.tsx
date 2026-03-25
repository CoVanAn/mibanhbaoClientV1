"use client";

import { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { ProductDetailContext } from "../content";
import VariantSelector from "../variant";
import styles from "./Hero.module.scss";

const EMPTY_ARRAY: never[] = [];

export default function ProductHero() {
  const context = useContext(ProductDetailContext);
  const product = context?.product;
  const categoryLabel = context?.categoryLabel ?? "";
  const thumbnails = context?.thumbnails ?? EMPTY_ARRAY;
  const variants = context?.variants ?? EMPTY_ARRAY;
  const defaultImage = context?.mainImage ?? "";

  const availableImages = useMemo(
    () =>
      [defaultImage, ...thumbnails.map((thumbnail) => thumbnail.url)].filter(
        Boolean,
      ),
    [defaultImage, thumbnails],
  );
  const [selectedImage, setSelectedImage] = useState("");

  const displayImage = useMemo(() => {
    if (selectedImage && availableImages.includes(selectedImage)) {
      return selectedImage;
    }
    return availableImages[0] || "";
  }, [selectedImage, availableImages]);

  const sortedThumbnails = thumbnails.filter((image) => image.url);

  const [showPreview, setShowPreview] = useState(false);

  if (!context || !product) return null;

  const handleThumbnailClick = (url: string) => {
    if (url) {
      setSelectedImage(url);
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
          <Image
            src={displayImage}
            alt={product.name}
            className={styles.heroImage}
            width={800}
            height={800}
            unoptimized
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
              <Image
                src={image.url}
                alt={product.name}
                className={styles.thumbnail}
                width={120}
                height={120}
                unoptimized
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
            <Image
              src={displayImage}
              alt={product.name}
              className={styles.imagePreview}
              width={1200}
              height={1200}
              unoptimized
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
