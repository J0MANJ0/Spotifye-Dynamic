'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export function useNavigationHistory() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPath =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const isNavigatingRef = useRef(false); // tracks programmatic navigation

  // Update history stack whenever route changes
  useEffect(() => {
    setHistoryStack((prev) => {
      if (isNavigatingRef.current) return prev;

      const existingIndex = prev.indexOf(currentPath);

      if (existingIndex !== -1) {
        setCurrentIndex(existingIndex);
        return prev;
      }

      const newStack = [...prev.slice(0, currentIndex + 1), currentPath];

      setCurrentIndex(newStack.length - 1);
      return newStack;
    });
  }, [currentPath]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopstate = () => {
      const newPath =
        window.location.pathname +
        (window.location.search ? window.location.search : '');

      setHistoryStack((prev) => {
        const existingIndex = prev.indexOf(newPath);
        if (existingIndex !== -1) {
          setCurrentIndex(existingIndex);
          return prev;
        }

        // external or direct navigation (e.g. refresh)
        const newStack = [...prev, newPath];
        setCurrentIndex(newStack.length - 1);
        return newStack;
      });
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, []);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < historyStack.length - 1;

  const goBack = () => {
    if (!canGoBack) return;
    isNavigatingRef.current = true;
    router.push(historyStack[currentIndex - 1]);
    setCurrentIndex((i) => i - 1);
    setTimeout(() => (isNavigatingRef.current = false), 50);
  };

  const goForward = () => {
    if (!canGoForward) return;
    isNavigatingRef.current = true;
    router.push(historyStack[currentIndex + 1]);
    setCurrentIndex((i) => i + 1);
    setTimeout(() => (isNavigatingRef.current = false), 50);
  };

  return {
    historyStack,
    currentIndex,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    pathname,
    router,
  };
}
