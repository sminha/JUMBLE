import { PurchaseRecord, CATEGORY_LABEL } from '@jumble/shared';
import { cn } from '@/utils/cn';
import { formatPrice, formatDate } from '@/utils/format';
import receiptIcon from '@/assets/receipt-icon.svg';
import UnstyledButton from './UnstyledButton';
import Checkbox from './Checkbox';

interface PurchaseRowProps {
  record: PurchaseRecord;
}

const TD_CELL_STYLE = 'py-[1.6rem] text-center align-middle';
const TEXT_BUTTON_STYLE = 'text-secondary-5';

export default function PurchaseRow({ record }: PurchaseRowProps) {
  return (
    <tr className="text-gray-8 font-14-r">
      <td
        className={cn(
          TD_CELL_STYLE,
          'border-r-gray-1 sticky left-0 z-10 border-r-1 bg-white pr-[0.2rem] pl-[1rem]',
        )}
      >
        <Checkbox isChecked={false} onChange={() => {}} />
      </td>
      <td className={TD_CELL_STYLE}>
        <UnstyledButton className={TEXT_BUTTON_STYLE}>{record.purchaseNo}</UnstyledButton>
      </td>
      <td className={TD_CELL_STYLE}>
        <UnstyledButton className={TEXT_BUTTON_STYLE}>{record.productNo}</UnstyledButton>
      </td>
      <td className={TD_CELL_STYLE}>{formatDate(record.purchasedAt)}</td>
      <td className={TD_CELL_STYLE}>{record.vendor}</td>
      <td className={TD_CELL_STYLE}>{record.product}</td>
      <td className={TD_CELL_STYLE}>
        {CATEGORY_LABEL.find((c) => c.value === record.category)?.label ?? record.category}
      </td>
      <td className={TD_CELL_STYLE}>{record.color || '-'}</td>
      <td className={TD_CELL_STYLE}>{record.size || '-'}</td>
      <td className={TD_CELL_STYLE}>{record.option || '-'}</td>
      <td className={TD_CELL_STYLE}>{formatPrice(record.price)}</td>
      <td className={TD_CELL_STYLE}>{record.quantity}</td>
      <td className={TD_CELL_STYLE}>{formatPrice(record.totalPrice)}</td>
      <td className={TD_CELL_STYLE}>
        <UnstyledButton className={TEXT_BUTTON_STYLE}>{record.backorderQuantity}</UnstyledButton>
      </td>
      <td className={TD_CELL_STYLE}>
        <UnstyledButton aria-label="영수증 조회">
          <img src={receiptIcon} alt="" aria-hidden="true" className="h-[1.6rem] w-[1.6rem]" />
        </UnstyledButton>
      </td>
    </tr>
  );
}
