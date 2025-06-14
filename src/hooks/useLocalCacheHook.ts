import { useEffect, useState } from "react";

interface Data<T> {
  data: T[];
}

const useLocalCacheHook = <T>(data: Data<T>, name: string) => {
  const [localData, setLocalData] = useState<T[]>([]);

  // تحميل البيانات من localStorage عند أول تحميل
  useEffect(() => {
    const storedData = localStorage.getItem(name);
    if (storedData) {
      setLocalData(JSON.parse(storedData));
    }
    // لا تضع else هنا، حتى لا تمنع التحديث من useEffect الثاني
    // eslint-disable-next-line
  }, [name]);

  // تحديث الكاش عند تغير البيانات (دائمًا إذا data.data فيها بيانات)
  useEffect(() => {
    if (Array.isArray(data.data) && data.data.length > 0) {
      setLocalData(data.data);
      localStorage.setItem(name, JSON.stringify(data.data));
    }
  }, [name, JSON.stringify(data.data)]);

  return {
    localData,
    setLocalData, // لو حبيت تحدث الكاش يدويًا
  };
};

export default useLocalCacheHook;
