import { FieldErrors, UseFormRegister, Control, Controller } from 'react-hook-form';
import { Purchase, Category, CATEGORY } from '@jumble/shared';
import Input from '@/components/Input';
import DropDown from '@/components/Dropdown';
import DeleteButton from '@/components/DeleteButton';
import { formatPrice } from '@/utils/format';
import { STATUS } from '@/constants/status';
import { ValueLabel } from '@/types/value-label';

interface ProductRowProps {
  index: number;
  product: Purchase['products'][number];
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

export default function ProductRow({
  index,
  product,
  register,
  control,
  errors,
  remove,
}: ProductRowProps) {
  return (
    <tr>
      {/* 상품명 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`products.${index}.name`)}
          status={errors.products?.[index]?.name ? STATUS.ERROR : STATUS.DEFAULT}
        />
      </td>

      {/* 구분 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Controller
          control={control}
          name={`products.${index}.category`}
          render={({ field }) => (
            <DropDown
              options={OPTIONS_LABEL}
              value={field.value}
              onChange={field.onChange}
              placeholder="선택"
              status={errors.products?.[index]?.category ? STATUS.ERROR : STATUS.DEFAULT}
            />
          )}
        />
      </td>

      {/* 컬러 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input {...register(`products.${index}.color`)} />
      </td>

      {/* 사이즈 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input {...register(`products.${index}.size`)} />
      </td>

      {/* 기타옵션 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input {...register(`products.${index}.option`)} />
      </td>

      {/* 단가 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`products.${index}.price`, { valueAsNumber: true })}
          status={errors.products?.[index]?.price ? STATUS.ERROR : STATUS.DEFAULT}
          className="text-center"
        />
      </td>

      {/* 수량 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`products.${index}.quantity`, { valueAsNumber: true })}
          status={errors.products?.[index]?.quantity ? STATUS.ERROR : STATUS.DEFAULT}
          className="text-center"
        />
      </td>

      {/* 금액합계 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          disabled
          value={formatPrice((product?.price || 0) * (product?.quantity || 0))}
          className="bg-gray-1 cursor-not-allowed text-center"
        />
      </td>

      {/* 미송수량 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`products.${index}.backorderQuantity`, {
            valueAsNumber: true,
          })}
          status={errors.products?.[index]?.backorderQuantity ? STATUS.ERROR : STATUS.DEFAULT}
          className="text-center"
        />
      </td>

      {/* 삭제 버튼 */}
      <td className="text-center">
        <DeleteButton onClick={() => remove(index)} />
      </td>
    </tr>
  );
}
