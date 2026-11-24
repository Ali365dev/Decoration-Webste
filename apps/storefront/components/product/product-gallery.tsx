"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useRef, type RefObject } from "react";

export function ProductGallery({
  productName,
  photos,
  index,
  onIndexChange,
  onZoom,
  galleryRef,
}: {
  productName: string;
  photos: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onZoom: () => void;
  galleryRef: RefObject<HTMLDivElement | null>;
}) {
  const touchStart = useRef<number | null>(null);
  const move = (direction: -1 | 1) => {
    onIndexChange((index + direction + photos.length) % photos.length);
  };

  return (
    <div className="product-gallery" ref={galleryRef}>
      <div
        className="product-main-image"
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = event.changedTouches[0]?.clientX;
          if (delta !== undefined && Math.abs(delta - touchStart.current) > 45) move(delta < touchStart.current ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <div className="product-main-image-motion">
          {photos[index] ? (
            <Image
              src={photos[index]}
              alt={productName}
              fill
              priority
              sizes="(min-width: 1000px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        {photos.length > 1 ? (
          <>
            <button className="gallery-arrow gallery-arrow-left" type="button" aria-label="Previous image" onClick={() => move(-1)}>
              <ChevronLeft size={20} />
            </button>
            <button className="gallery-arrow gallery-arrow-right" type="button" aria-label="Next image" onClick={() => move(1)}>
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}
        <button className="gallery-zoom" type="button" aria-label="Zoom image" onClick={onZoom}>
          <Maximize2 size={18} strokeWidth={1.5} />
        </button>
      </div>
      {photos.length > 1 ? (
        <div className="product-thumbnails" aria-label="Product images">
          {photos.map((photo, photoIndex) => (
            <button
              key={photo}
              type="button"
              aria-label={`Show image ${photoIndex + 1}`}
              aria-pressed={index === photoIndex}
              onClick={() => onIndexChange(photoIndex)}
              className={index === photoIndex ? "thumbnail-active" : ""}
            >
              <Image src={photo} alt="" fill sizes="90px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      {photos.length > 1 ? (
        <div className="product-gallery-pagination" aria-label="Choose product image">
          {photos.map((photo, photoIndex) => (
            <button key={photo} type="button" aria-label={`Show image ${photoIndex + 1}`} aria-current={index === photoIndex ? "true" : undefined} onClick={() => onIndexChange(photoIndex)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
