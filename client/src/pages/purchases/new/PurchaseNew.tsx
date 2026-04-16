import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Product, Purchase, purchaseSchema } from '@jumble/shared';
import { formatPrice } from '@/utils/format';
import Input from '@/components/Input';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { STATUS } from '@/constants/status';
import ProductRow from './components/ProductRow';
import UploadButton from './components/UploadButton';
import { useCreatePurchase, useImageUpload } from './apis';

const TABLE_HEADERS: { label: string; width: string }[] = [
  { label: '상품명', width: '' },
  { label: '구분', width: 'w-[10.9rem]' },
  { label: '컬러', width: 'w-[9.6rem]' },
  { label: '사이즈', width: 'w-[9.6rem]' },
  { label: '기타옵션', width: '' },
  { label: '단가', width: 'w-[9.6rem]' },
  { label: '수량', width: 'w-[6rem]' },
  { label: '금액합계', width: 'w-[9.6rem]' },
  { label: '미송수량', width: 'w-[6rem]' },
  { label: '', width: 'w-[4rem]' },
];

const DEFAULT_ITEMS: Product = {
  name: '',
  category: '' as unknown as Category,
  color: '',
  size: '',
  option: '',
  price: undefined as unknown as number,
  quantity: undefined as unknown as number,
  backorderQuantity: undefined as unknown as number,
};

export default function PurchaseNew() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Purchase>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      purchasedAt: '',
      vendor: '',
      items: [DEFAULT_ITEMS],
    },
  });
  const items = useWatch({ control, name: 'items' });
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'items',
  });

  const totalPrice = formatPrice(
    items.reduce((sum, item) => sum + (item?.price || 0) * (item.quantity || 0), 0),
  );
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalBackorderQuantity = items.reduce(
    (sum, item) => sum + (item.backorderQuantity || 0),
    0,
  );

  const { mutate: handleImageUpload, isPending: isImageUploading } = useImageUpload({
    setValue,
    replace,
  });
  const { mutate: handleCreatePurchase } = useCreatePurchase();

  return (
    <main>
      <Header />
      <div className="flex items-center justify-between px-[7.2rem] py-[2.6rem]">
        <h1 className="title-18-m text-gray-9">사입 내역 추가</h1>
        <UploadButton onUpload={handleImageUpload} isLoading={isImageUploading}>
          {isImageUploading ? '분석 중...' : '영수증으로 입력하기'}
        </UploadButton>
      </div>
      <form onSubmit={handleSubmit((data) => handleCreatePurchase(data))}>
        <section className="mx-[6.4rem] flex flex-col gap-[2.4rem] rounded-[1.6rem] bg-white px-[3.8rem] py-[3rem]">
          {/* 사입일시 */}
          <div className="flex w-[48rem] items-center gap-[0.8rem]">
            <h2 className="title-16-m w-[9.4rem] shrink-0">사입일시</h2>
            <Input
              type="date"
              {...register('purchasedAt')}
              status={errors.purchasedAt ? STATUS.ERROR : STATUS.DEFAULT}
            />
          </div>

          {/* 거래처명 */}
          <div className="flex w-[48rem] items-center gap-[0.8rem]">
            <h2 className="title-16-m w-[9.4rem] shrink-0">거래처명</h2>
            <Input {...register('vendor')} status={errors.vendor ? STATUS.ERROR : STATUS.DEFAULT} />
          </div>

          {/* 상품목록 */}
          <div className="flex gap-[0.8rem]">
            <h2 className="title-16-m w-[9.4rem] shrink-0">상품목록</h2>
            <table className="w-full table-fixed">
              <colgroup>
                {TABLE_HEADERS.map(({ label, width }) => (
                  <col key={label} className={width} />
                ))}
              </colgroup>
              <thead>
                <tr className="bg-gray-1">
                  {TABLE_HEADERS.map((header) => (
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
                    index={index}
                    item={items[index]}
                    register={register}
                    control={control}
                    errors={errors}
                    remove={remove}
                  />
                ))}
                <tr className="border-t-gray-3 text-gray-9 font-14-m border-t-1">
                  <td className="py-[1.6rem] text-center">{items.length}건</td>
                  <td colSpan={5} />
                  <td className="py-[1.6rem] text-center">{totalQuantity}개</td>
                  <td className="py-[1.6rem] text-center">{totalPrice}원</td>
                  <td className="py-[1.6rem] text-center">{totalBackorderQuantity}개</td>
                  <td className="py-[1.6rem] text-center"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            <Button size="medium" variant="white" onClick={() => append(DEFAULT_ITEMS)}>
              상품 추가하기
            </Button>
          </div>
        </section>

        {/* 추가하기 버튼 */}
        <div className="flex justify-center py-[3.2rem]">
          <Button type="submit" size="large" variant="primary">
            추가하기
          </Button>
        </div>
      </form>
    </main>
  );
}
