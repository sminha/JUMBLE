import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Purchase, Category, CATEGORY } from '@jumble/shared';
import Input from '@/components/Input';
import DropDown from '@/components/Dropdown';
import DeleteButton from '@/components/DeleteButton';
import { formatPrice } from '@/utils/format';
import { STATUS } from '@/constants/status';

interface ItemRowProps {
  index: number;
  item: Purchase['items'][number];
  register: UseFormRegister<Purchase>;
  errors: FieldErrors<Purchase>;
  remove: (index: number) => void;
}

const OPTIONS: { value: Category; label: string }[] = [
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

export default function ItemRow({ index, item, register, errors, remove }: ItemRowProps) {
  return (
    <tr>
      {/* 상품명 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`items.${index}.name`)}
          status={errors.items?.[index]?.name ? STATUS.ERROR : STATUS.DEFAULT}
        />
      </td>

      {/* 구분 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <DropDown
          {...register(`items.${index}.category`)}
          options={OPTIONS}
          placeholder="선택"
          defaultValue=""
          status={errors.items?.[index]?.category ? STATUS.ERROR : STATUS.DEFAULT}
        />
      </td>

      {/* 컬러 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input {...register(`items.${index}.color`)} />
      </td>

      {/* 사이즈 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input {...register(`items.${index}.size`)} />
      </td>

      {/* 기타옵션 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input {...register(`items.${index}.option`)} />
      </td>

      {/* 단가 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`items.${index}.price`, { valueAsNumber: true })}
          status={errors.items?.[index]?.price ? STATUS.ERROR : STATUS.DEFAULT}
          className="text-center"
        />
      </td>

      {/* 수량 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          status={errors.items?.[index]?.quantity ? STATUS.ERROR : STATUS.DEFAULT}
          className="text-center"
        />
      </td>

      {/* 금액합계 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          disabled
          value={formatPrice((item?.price || 0) * (item?.quantity || 0))}
          className="bg-gray-1 cursor-not-allowed text-center"
        />
      </td>

      {/* 미송수량 */}
      <td className="px-[0.8rem] py-[0.6rem]">
        <Input
          {...register(`items.${index}.backorderQuantity`, { valueAsNumber: true })}
          status={errors.items?.[index]?.backorderQuantity ? STATUS.ERROR : STATUS.DEFAULT}
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
