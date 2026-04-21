import { useNavigate, useLocation } from 'react-router';
import { PurchaseRecord, CATEGORY_LABEL_NEW } from '@jumble/shared';
import { PATHS } from '@/router';
import { cn } from '@/utils/cn';
import { formatPrice, formatDate } from '@/utils/format';
import receiptIcon from '@/assets/receipt-icon.svg';
import UnstyledButton from './UnstyledButton';
import Checkbox from './Checkbox';
interface PurchaseRowProps {
  record: PurchaseRecord;
  isSelected: boolean;
  onToggle: () => void;
  onBackorderModalOpenChange: (purchaseId: string, productId: string) => void;
  onReceiptModalOpenChange: (purchaseId: string | null) => void;
}

const TD_CELL_STYLE = (isSelected: boolean) =>
  `py-[1.6rem] text-center align-middle transition-color duration-300 ease-in-out ${isSelected ? 'bg-selected' : 'bg-white'}`;
const TEXT_BUTTON_STYLE = 'text-secondary-5';

export default function PurchaseRow({
  record,
  isSelected,
  onToggle,
  onBackorderModalOpenChange,
  onReceiptModalOpenChange,
}: PurchaseRowProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePurchaseModalOpen = (purchaseId: string) => {
    navigate(`${PATHS.PURCHASES}/${purchaseId}`, {
      state: { background: location },
    });
  };
  const handleProductModalOpen = (purchaseId: string, productId: string) => {
    navigate(`${PATHS.PURCHASES}/${purchaseId}/products/${productId}`, {
      state: { background: location },
    });
  };

  return (
    <tr className="text-gray-8 font-14-r">
      <td className={cn(TD_CELL_STYLE(isSelected), 'sticky left-0 z-10 pr-[0.2rem] pl-[1rem]')}>
        <Checkbox isChecked={isSelected} onChange={onToggle} />
      </td>
      <td className={TD_CELL_STYLE(isSelected)}>
        <UnstyledButton
          aria-label="사입내역 상세조회"
          className={TEXT_BUTTON_STYLE}
          onClick={() => handlePurchaseModalOpen(record.purchaseId)}
        >
          {record.purchaseNo}
        </UnstyledButton>
      </td>
      <td className={TD_CELL_STYLE(isSelected)}>
        <UnstyledButton
          aria-label="상품 사입내역 상세조회"
          className={TEXT_BUTTON_STYLE}
          onClick={() => handleProductModalOpen(record.purchaseId, record.productId)}
        >
          {record.productNo}
        </UnstyledButton>
      </td>
      <td className={TD_CELL_STYLE(isSelected)}>{formatDate(record.purchasedAt)}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{record.vendor}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{record.product}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{CATEGORY_LABEL_NEW[record.category]}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{record.color || '-'}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{record.size || '-'}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{record.option || '-'}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{formatPrice(record.price)}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{record.quantity}</td>
      <td className={TD_CELL_STYLE(isSelected)}>{formatPrice(record.totalPrice)}</td>
      <td className={TD_CELL_STYLE(isSelected)}>
        <UnstyledButton
          aria-label="미송수량 조회"
          className={TEXT_BUTTON_STYLE}
          onClick={() => onBackorderModalOpenChange(record.purchaseId, record.productId)}
        >
          {record.backorderQuantity}
        </UnstyledButton>
      </td>
      <td className={TD_CELL_STYLE(isSelected)}>
        {record.receipt && (
          <UnstyledButton
            aria-label="영수증 조회"
            onClick={() => onReceiptModalOpenChange(record.purchaseId)}
          >
            <img src={receiptIcon} alt="" aria-hidden="true" className="h-[1.6rem] w-[1.6rem]" />
          </UnstyledButton>
        )}
      </td>
    </tr>
  );
}
