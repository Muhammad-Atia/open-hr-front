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
    } else if (data.data?.length > 0) {
      // إذا لم يوجد كاش، استخدم البيانات القادمة من props
      setLocalData(data.data);
      localStorage.setItem(name, JSON.stringify(data.data));
    }
    // eslint-disable-next-line
  }, []);

  // تحديث الكاش عند تغير البيانات
  useEffect(() => {
    if (data.data?.length > 0) {
      setLocalData(data.data);
      localStorage.setItem(name, JSON.stringify(data.data));
    }
  }, [data.data, name]);

  return {
    localData,
    setLocalData, // مفيد لو أردت تحديث الكاش يدويًا
  };
};

export default useLocalCacheHook;
