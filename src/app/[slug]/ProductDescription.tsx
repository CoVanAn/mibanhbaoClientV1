import styles from "./page.module.scss";

type ProductDescriptionSectionProps = {
  description?: string;
  content?: string;
};

const ProductDescriptionSection = ({
  description,
  content,
}: ProductDescriptionSectionProps) => (
  <section className={styles.detailPanel}>
    <h2>Giới thiệu sản phẩm</h2>
    {content ? (
      <div
        className={styles.richText}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    ) : (
      <p>{description}</p>
    )}
  </section>
);

export default ProductDescriptionSection;
