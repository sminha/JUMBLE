import {
  Control,
  useWatch,
  Controller,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import { type Purchase, DEFAULT_PRODUCT, CATEGORY_LABEL } from '@jumble/shared';
import Input from '@/components/Input';
import DropDown from '@/components/Dropdown';
import DeleteButton from '@/components/DeleteButton';
import { STATUS } from '@/constants/status';
import { formatPrice } from '@/utils/format';
import Button from './Button';

interface ProductTableProps {
  headers: { label: string; width: string }[];
  hasProductId: boolean;
  isEditing: boolean;
  register: UseFormRegister<Purchase>;
  control: Control<Purchase>;
  errors: FieldErrors<Purchase>;
}

export default function ProductTable({
  headers,
  hasProductId,
  isEditing,
  register,
  control,
  errors,
}: ProductTableProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'products' });
  const products = useWatch({ control, name: 'products' });

  const totalPrice = formatPrice(
    products.reduce((sum, product) => sum + (product?.price || 0) * (product.quantity || 0), 0),
  );
  const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
  const totalBackorderQuantity = products.reduce(
    (sum, product) => sum + (product.backorderQuantity || 0),
    0,
  );

  return (
    <div>
      <div className="flex gap-[0.8rem]">
        <table className="w-full table-fixed">
          <colgroup>
            {headers.map(({ label, width }) => (
              <col key={label} className={width} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-gray-1">
              {headers.map((header) => (
                <th key={header.label} className="font-14-m text-gray-5 py-[1.6rem]">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <ProductRow
                key={field.id}
                product={products[index] ?? field}
                index={index}
                count={fields.length}
                hasProductId={hasProductId}
                isEditing={isEditing}
                register={register}
                control={control}
                errors={errors}
                remove={remove}
              />
            ))}
            <tr className="border-t-gray-3 text-gray-9 font-14-m border-t-1">
              {hasProductId && <td />}
              <td className="py-[1.6rem] text-center">{products.length}건</td>
              <td colSpan={5} />
              <td className="py-[1.6rem] text-center">{totalQuantity}개</td>
              <td className="py-[1.6rem] text-center">{totalPrice}원</td>
              <td className="py-[1.6rem] text-center">{totalBackorderQuantity}개</td>
              <td className="py-[1.6rem] text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
      {isEditing && (
        <div className="flex justify-center">
          <Button size="medium" variant="white" onClick={() => append(DEFAULT_PRODUCT)}>
            상품 추가하기
          </Button>
        </div>
      )}
    </div>
  );
}

interface ProductRowProps {
  product: Purchase['products'][number];
  index: number;
  count: number;
  hasProductId: boolean;
  isEditing: boolean;
  register: UseFormRegister<Purchase>;
  control: Control<Purchase>;
  errors: FieldErrors<Purchase>;
  remove: (index: number) => void;
}

const TD_CELL_STYLE = 'px-[0.8rem] py-[0.6rem]';
const TD_TEXT_STYLE = 'font-14-r text-gray-6 flex justify-center';

function ProductRow({
  product,
  index,
  count,
  hasProductId,
  isEditing,
  register,
  control,
  errors,
  remove,
}: ProductRowProps) {
  const handleRemove = () => {
    if (count === 1) {
      // TODO: 토스트 띄우기
      return;
    }

    remove(index);
  };

  return (
    <tr>
      {/* 상품사입번호 */}
      {hasProductId && <td className={TD_TEXT_STYLE}>{product.productNo}</td>}

      {/* 상품명 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`products.${index}.name`)}
            status={errors.products?.[index]?.name ? STATUS.ERROR : STATUS.DEFAULT}
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{product.name}</span>
        )}
      </td>

      {/* 구분 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Controller
            control={control}
            name={`products.${index}.category`}
            render={({ field }) => (
              <DropDown
                options={CATEGORY_LABEL}
                value={field.value}
                onChange={field.onChange}
                placeholder="선택"
                status={errors.products?.[index]?.category ? STATUS.ERROR : STATUS.DEFAULT}
              />
            )}
          />
        ) : (
          <span className={TD_TEXT_STYLE}>
            {CATEGORY_LABEL.find((c) => c.value === product.category)?.label ?? product.category}
          </span>
        )}
      </td>

      {/* 컬러 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input {...register(`products.${index}.color`)} />
        ) : (
          <span className={TD_TEXT_STYLE}>{product.color}</span>
        )}
      </td>

      {/* 사이즈 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input {...register(`products.${index}.size`)} />
        ) : (
          <span className={TD_TEXT_STYLE}>{product.size}</span>
        )}
      </td>

      {/* 기타옵션 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input {...register(`products.${index}.option`)} />
        ) : (
          <span className={TD_TEXT_STYLE}>{product.option ?? '-'}</span>
        )}
      </td>

      {/* 단가 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`products.${index}.price`, { valueAsNumber: true })}
            status={errors.products?.[index]?.price ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{formatPrice(product.price)}</span>
        )}
      </td>

      {/* 수량 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`products.${index}.quantity`, { valueAsNumber: true })}
            status={errors.products?.[index]?.quantity ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{product.quantity}</span>
        )}
      </td>

      {/* 금액합계 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            disabled
            value={formatPrice((product?.price || 0) * (product?.quantity || 0))}
            className="bg-gray-1 cursor-not-allowed text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>
            {formatPrice((product?.price || 0) * (product?.quantity || 0))}
          </span>
        )}
      </td>

      {/* 미송수량 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`products.${index}.backorderQuantity`, {
              valueAsNumber: true,
            })}
            status={errors.products?.[index]?.backorderQuantity ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{product.backorderQuantity}</span>
        )}
      </td>

      {/* 삭제 버튼 */}
      {isEditing && (
        <td>
          <DeleteButton onClick={handleRemove} />
        </td>
      )}
    </tr>
  );
}
