import { Control, Controller, FieldErrors, UseFormRegister, useWatch } from 'react-hook-form';
import { type Purchase, CATEGORY_LABEL } from '@jumble/shared';
import { STATUS } from '@/constants/status';
import { formatPrice } from '@/utils/format';
import { useToast, Input, Dropdown, DeleteButton } from '@/components';

interface ProductCardProps {
  index: number;
  count: number;
  register: UseFormRegister<Purchase>;
  control: Control<Purchase>;
  errors: FieldErrors<Purchase>;
  remove: (index: number) => void;
}

export default function ProductCard({
  index,
  count,
  register,
  control,
  errors,
  remove,
}: ProductCardProps) {
  const { toast } = useToast();
  const product = useWatch({ control, name: `products.${index}` });

  const handleRemove = () => {
    if (count === 1) {
      toast.error('최소 1개 이상의 상품을 등록해주세요.');
      return;
    }
    remove(index);
  };

  const totalPrice = formatPrice((product?.price || 0) * (product?.quantity || 0));

  return (
    <div className="border-gray-2 relative flex flex-col gap-[1.2rem] rounded-[1.2rem] border bg-white p-[1.6rem]">
      <DeleteButton onClick={handleRemove} className="absolute top-[1.2rem] right-[1.2rem]" />
      <Field label="상품명">
        <Input
          {...register(`products.${index}.name`)}
          status={errors.products?.[index]?.name ? STATUS.ERROR : STATUS.DEFAULT}
        />
      </Field>
      <div className="grid grid-cols-2 gap-x-[0.8rem] gap-y-[1.2rem]">
        <Field label="구분">
          <Controller
            control={control}
            name={`products.${index}.category`}
            render={({ field }) => (
              <Dropdown
                options={CATEGORY_LABEL}
                value={field.value}
                onChange={field.onChange}
                placeholder="선택"
                status={errors.products?.[index]?.category ? STATUS.ERROR : STATUS.DEFAULT}
              />
            )}
          />
        </Field>
        <Field label="컬러">
          <Input {...register(`products.${index}.color`)} />
        </Field>
        <Field label="사이즈">
          <Input {...register(`products.${index}.size`)} />
        </Field>
        <Field label="기타옵션">
          <Input {...register(`products.${index}.option`)} />
        </Field>
        <Field label="단가">
          <Input
            numeric
            placeholder="0"
            {...register(`products.${index}.price`, {
              setValueAs: (value: string) => Number(value),
            })}
            status={errors.products?.[index]?.price ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-right"
          />
        </Field>
        <Field label="수량">
          <Input
            numeric
            placeholder="0"
            {...register(`products.${index}.quantity`, {
              setValueAs: (value: string) => Number(value),
            })}
            status={errors.products?.[index]?.quantity ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-right"
          />
        </Field>
        <Field label="금액합계">
          <Input disabled value={totalPrice} className="text-right" />
        </Field>
        <Field label="미송수량">
          <Input
            numeric
            placeholder="0"
            {...register(`products.${index}.backorderQuantity`, {
              setValueAs: (value: string) => Number(value),
            })}
            status={errors.products?.[index]?.backorderQuantity ? STATUS.ERROR : STATUS.DEFAULT}
            className="text-right"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-[0.4rem]">
      <span className="font-12-m text-gray-5">{label}</span>
      {children}
    </label>
  );
}
