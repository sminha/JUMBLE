import {
  Control,
  useWatch,
  Controller,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import { type Purchase, DEFAULT_PRODUCT, type Category, CATEGORY } from '@jumble/shared';
import Input from '@/components/Input';
import DropDown from '@/components/Dropdown';
import DeleteButton from '@/components/DeleteButton';
import { STATUS } from '@/constants/status';
import { formatPrice } from '@/utils/format';
import { ValueLabel } from '@/types/value-label';
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
  // TODO: purchaseSchema items -> products
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const products = useWatch({ control, name: 'items' });

  const totalPrice = formatPrice(
    products.reduce((sum, product) => sum + (product?.price || 0) * (product.quantity || 0), 0),
  );
  const totalQuantity = products.reduce((sum, product) => sum + (product.quantity || 0), 0);
  const totalBackorderQuantity = products.reduce(
    (sum, product) => sum + (product.backorderQuantity || 0),
    0,
  );

  return (
    <>
      <div className="flex gap-[0.8rem]">
        {/* <h2 className="title-16-m w-[9.4rem] shrink-0">상품목록</h2> */}
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
                item={products[index] ?? field}
                index={index}
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
    </>
  );
}

interface ProductRowProps {
  item: Purchase['items'][number];
  index: number;
  hasProductId: boolean;
  isEditing: boolean;
  register: UseFormRegister<Purchase>;
  control: Control<Purchase>;
  errors: FieldErrors<Purchase>;
  remove: (index: number) => void;
}

const OPTIONS_LABEL: ValueLabel<Category>[] = [
  { value: CATEGORY.TOP, label: '상의' },
  { value: CATEGORY.OUTER, label: '아우터' },
  { value: CATEGORY.BOTTOM, label: '하의' },
  { value: CATEGORY.SET, label: '세트' },
  { value: CATEGORY.BAG, label: '가방' },
  { value: CATEGORY.SHOES, label: '신발' },
  { value: CATEGORY.JEWELRY, label: '주얼리' },
  { value: CATEGORY.ACCESSORY, label: '악세서리' },
  { value: CATEGORY.ETC, label: '기타' },
];

const TD_CELL_STYLE = 'px-[0.8rem] py-[0.6rem]';
const TD_TEXT_STYLE = 'font-14-r text-gray-6 flex justify-center';

function ProductRow({
  item,
  index,
  hasProductId,
  isEditing,
  register,
  control,
  errors,
  remove,
}: ProductRowProps) {
  return (
    <tr>
      {/* 상품사입번호 */}
      {hasProductId && <td className={TD_TEXT_STYLE}>{item.productNo}</td>}

      {/* 상품명 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`items.${index}.name`)}
            status={errors.items?.[index]?.name ? STATUS.ERROR : STATUS.DEFAULT}
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{item.name}</span>
        )}
      </td>

      {/* 구분 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Controller
            control={control}
            name={`items.${index}.category`}
            render={({ field }) => (
              <DropDown
                options={OPTIONS_LABEL}
                value={field.value}
                onChange={field.onChange}
                placeholder="선택"
                status={errors.items?.[index]?.category ? STATUS.ERROR : STATUS.DEFAULT}
              />
            )}
          />
        ) : (
          <span className={TD_TEXT_STYLE}>
            {OPTIONS_LABEL.find((o) => o.value === item.category)?.label ?? item.category}
          </span>
        )}
      </td>

      {/* 컬러 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input {...register(`items.${index}.color`)} />
        ) : (
          <span className={TD_TEXT_STYLE}>{item.color}</span>
        )}
      </td>

      {/* 사이즈 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input {...register(`items.${index}.size`)} />
        ) : (
          <span className={TD_TEXT_STYLE}>{item.size}</span>
        )}
      </td>

      {/* 기타옵션 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input {...register(`items.${index}.option`)} />
        ) : (
          <span className={TD_TEXT_STYLE}>{item.option ?? '-'}</span>
        )}
      </td>

      {/* 단가 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`items.${index}.price`, { valueAsNumber: true })}
            status={errors.items?.[index]?.price ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{formatPrice(item.price)}</span>
        )}
      </td>

      {/* 수량 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            status={errors.items?.[index]?.quantity ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{item.quantity}</span>
        )}
      </td>

      {/* 금액합계 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            disabled
            value={formatPrice((item?.price || 0) * (item?.quantity || 0))}
            className="bg-gray-1 cursor-not-allowed text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>
            {formatPrice((item?.price || 0) * (item?.quantity || 0))}
          </span>
        )}
      </td>

      {/* 미송수량 */}
      <td className={TD_CELL_STYLE}>
        {isEditing ? (
          <Input
            {...register(`items.${index}.backorderQuantity`, {
              valueAsNumber: true,
            })}
            status={errors.items?.[index]?.backorderQuantity ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-center"
          />
        ) : (
          <span className={TD_TEXT_STYLE}>{item.backorderQuantity}</span>
        )}
      </td>

      {/* 삭제 버튼 */}
      {isEditing && <DeleteButton onClick={() => remove(index)} />}
      {/* 
      <td className="text-center">
        {isEditing ? (
        <DeleteButton onClick={() => remove(index)} />

        ) : (

        )}
      </td> */}
    </tr>
  );
}
