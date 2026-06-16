import { useState, useEffect } from 'react';

const DEFAULT_DELAY = 300;

/**
 * 값의 변경을 delay(기본 300ms)만큼 지연시킨다.
 * 검색 입력처럼 빠른 변경에서 불필요한 API 호출을 방지한다.
 *
 * @param {any} value - 디바운싱할 값
 * @param {number} delay - 지연 시간(ms)
 * @returns {any} 디바운싱된 값
 */
const useDebounce = (value, delay = DEFAULT_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
