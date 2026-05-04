import { useState } from 'react';
import { PurchaseRecord, CATEGORY_LABEL_NEW } from '@jumble/shared';
import { formatPrice, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';
import Checkbox from '@/pages/purchases/list/components/Checkbox';
import KebabMenu from '@/pages/purchases/list/components/KebabMenu';
import UnstyledButton from '@/pages/purchases/list/components/UnstyledButton';

interface PurchaseCardProps {
  record: PurchaseRecord;
  isSelected: boolean;
  onToggle: () => void;
  onBackorderModalOpenChange: (purchaseId: string, productId: string) => void;
  onReceiptModalOpenChange: (purchaseId: string | null) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TEXT_FIELD_STYLE = 'font-12-r text-gray-8';
const BUTTON_FIELD_STYLE = 'font-12-r text-secondary-5';

export default function PurchaseCard({
  record,
  isSelected,
  onToggle,
  onBackorderModalOpenChange,
  onReceiptModalOpenChange,
  onEdit,
  onDelete,
}: PurchaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        'border-gray-2 flex flex-col rounded-[1.2rem] border transition-colors duration-200',
        isSelected ? 'bg-selected' : 'bg-white',
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-[1.6rem] py-[1.2rem]">
        <div className="flex items-center gap-[1rem]">
          <Checkbox isChecked={isSelected} onChange={onToggle} />
          <span className="font-14-sb text-gray-8">{record.product}</span>
        </div>
        <div className="flex items-center gap-[0.8rem]">
          {record.backorderQuantity > 0 && (
            <span className="font-12-m bg-error/10 text-error rounded-[0.4rem] px-[0.6rem] py-[0.2rem]">
              미송 대기
            </span>
          )}
          <KebabMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {/* 기본 필드 */}
      <div className="border-gray-1 border-t">
        <Row label="사입일시">
          <span className={TEXT_FIELD_STYLE}>{formatDate(record.purchasedAt)}</span>
        </Row>
        <Row label="거래처명">
          <span className={TEXT_FIELD_STYLE}>{record.vendor}</span>
        </Row>
        <Row label="단가">
          <span className={TEXT_FIELD_STYLE}>{formatPrice(record.price)}원</span>
        </Row>
        <Row label="수량">
          <span className={TEXT_FIELD_STYLE}>{record.quantity}개</span>
        </Row>
      </div>

      {/* 상세 필드 */}
      {isExpanded && (
        <>
          <Row label="구분">
            <span className={TEXT_FIELD_STYLE}>{CATEGORY_LABEL_NEW[record.category]}</span>
          </Row>
          <Row label="컬러">
            <span className={TEXT_FIELD_STYLE}>{record.color || '-'}</span>
          </Row>
          <Row label="사이즈">
            <span className={TEXT_FIELD_STYLE}>{record.size || '-'}</span>
          </Row>
          <Row label="기타옵션">
            <span className={TEXT_FIELD_STYLE}>{record.option || '-'}</span>
          </Row>
          <Row label="금액합계">
            <span className={TEXT_FIELD_STYLE}>{formatPrice(record.totalPrice)}원</span>
          </Row>
          <Row label="미송수량">
            <UnstyledButton
              className={BUTTON_FIELD_STYLE}
              onClick={() => onBackorderModalOpenChange(record.purchaseId, record.productId)}
            >
              {record.backorderQuantity}개
            </UnstyledButton>
          </Row>
          {record.receipt && (
            <Row label="영수증">
              <UnstyledButton
                className={BUTTON_FIELD_STYLE}
                onClick={() => onReceiptModalOpenChange(record.purchaseId)}
              >
                영수증 보기 →
              </UnstyledButton>
            </Row>
          )}
        </>
      )}

      {/* 더보기/접기 버튼 */}
      <UnstyledButton
        className="font-12-r text-secondary-5 w-full py-[0.9rem] text-center"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? '접기' : '더보기'}
      </UnstyledButton>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-gray-1 flex items-center border-b px-[1.6rem] py-[0.9rem]">
      <span className="font-12-r text-gray-4 w-[7rem] shrink-0">{label}</span>
      {children}
    </div>
  );
}
