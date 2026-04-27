import { SetStateAction } from 'react';
import { Draft } from '@jumble/shared';

interface UsePaginationArgs {
  setParams: React.Dispatch<SetStateAction<Draft>>;
  totalPages: number;
}

export const usePagination = ({ setParams, totalPages }: UsePaginationArgs) => {
  const handleClickPrev = () => {
    setParams((prev) => ({
      ...prev,
      page: prev.page !== 1 ? prev.page - 1 : 1,
    }));
  };

  const handleClickNext = () => {
    setParams((prev) => ({
      ...prev,
      page: prev.page !== totalPages ? prev.page + 1 : totalPages,
    }));
  };

  const handleClickFirst = () => {
    setParams((prev) => ({ ...prev, page: 1 }));
  };

  const handleClickLast = () => {
    setParams((prev) => ({ ...prev, page: totalPages }));
  };

  const handleClickPagination = (page: number) => {
    setParams((prev) => ({ ...prev, page: page }));
  };

  return {
    handleClickPrev,
    handleClickNext,
    handleClickFirst,
    handleClickLast,
    handleClickPagination,
  };
};
