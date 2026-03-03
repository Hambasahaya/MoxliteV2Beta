/**
 * Smart Lazy Loading System
 * Defers non-critical component loading until needed
 */

import dynamic from "next/dynamic";
import React from "react";

const DEFAULT_LOADING_SKELETON = (
  <div className="animate-pulse bg-gray-200 h-48 rounded-lg" />
);

const DEFAULT_LAZY_FALLBACK = (
  <div className="h-40 bg-gray-100 rounded animate-pulse" />
);

/**
 * Create lazy component with custom loading fallback
 */
export const createLazyComponent = (
  componentImport: () => Promise<{ default: any }>,
  fallback?: React.ReactNode
) => {
  const Component = dynamic(componentImport, {
    loading: () => fallback || DEFAULT_LOADING_SKELETON,
    ssr: false, // Disable SSR for heavy components
  });

  return Component;
};

/**
 * Intersection Observer based lazy loading
 * Load content only when visible
 */
interface IntersectionLazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

export const IntersectionLazyLoad: React.FC<IntersectionLazyLoadProps> = ({
  children,
  fallback,
  rootMargin = "200px",
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const displayFallback = fallback || DEFAULT_LAZY_FALLBACK;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : displayFallback}
    </div>
  );
};

/**
 * Lazy load images with blur placeholder
 */
export const LazyImage = ({
  src,
  alt,
  blurDataUrl,
  className = "",
}: {
  src: string;
  alt: string;
  blurDataUrl?: string;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(blurDataUrl || "");
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          setImageSrc(src);
          observer.unobserve(img);
        }
      });
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      className={`${className} ${
        isLoaded ? "opacity-100" : "opacity-75 blur-sm"
      } transition-all duration-300`}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

/**
 * Virtual scrolling for long lists
 * Only render visible items
 */
interface VirtualListProps {
  items: any[];
  itemHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  containerHeight?: number;
}

export const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  renderItem,
  containerHeight = 600,
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleItems + 1, items.length);
  const visibleRange = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={ref}
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: items.length * itemHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleRange.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Progressive image loading with blurhash or color
 */
export const ProgressiveImage = ({
  src,
  placeholder,
  alt,
  className = "",
}: {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
}) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? "" : "blur-lg"} transition-all`}
    />
  );
};

/**
 * Debounce hook - delay execution
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Throttle hook - limit execution frequency
 */
export const useThrottle = <T,>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastUpdated = React.useRef<number>(Date.now());

  React.useEffect(() => {
    const now = Date.now();
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const handler = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(handler);
    }
  }, [value, interval]);

  return throttledValue;
};
