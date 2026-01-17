"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import VariantSelector from "./VariantSelector";
import styles from "./page.module.scss";

type Thumbnail = {
  id: string;
  url: string;
};

type ProductHeroProps = {
  categoryLabel: string;
  name: string;
  description?: string;
  defaultImage?: string;
  thumbnails: Thumbnail[];
  variants: Array<{
    id: string;
    name?: string;
    price?: number | null;
    quantity?: number | null;
  }>;
  isFeatured?: boolean;
  isActive?: boolean;
};

const ProductHero = ({
  categoryLabel,
  name,
  description,
  defaultImage,
  thumbnails,
  variants,
  isFeatured,
  isActive,
}: ProductHeroProps) => {
  const initialImage = useMemo(
    () => defaultImage || thumbnails[0]?.url || "",
    [defaultImage, thumbnails]
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
      <div className={styles.heroInfo}>
        <p className={styles.categoryTag}>{categoryLabel}</p>
        <h1>{name}</h1>
        <div className={styles.heroBadges}>
          {isFeatured && <span className={styles.badge}>Nổi bật</span>}
          {isActive && <span className={styles.badgeActive}>Đang bán</span>}
        </div>
        <p className={styles.description}>{description}</p>
        <VariantSelector variants={variants} />
        <div className={styles.ctaGroup}>
          <Link href="/products" className={styles.secondaryButton}>
            Xem danh mục
          </Link>
        </div>
      </div>
      <div className={styles.heroMedia}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
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
                alt={name}
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
              alt={name}
              className={styles.imagePreview}
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductHero;
