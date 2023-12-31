import { useState, useCallback } from "react";

export function useSingleExecution(callback) {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeOnce = useCallback(
    async (...args) => {
      if (!isExecuting) {
        // 실행 중인 상태로 설정
        setIsExecuting(true);

        try {
          // 콜백 실행
          await callback(...args);
        } finally {
          // 실행 완료 후 상태 초기화
          setIsExecuting(false);
        }
      }
    },
    [callback, isExecuting]
  );

  return { isExecuting, executeOnce };
}
