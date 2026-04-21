import { useNavigate } from 'react-router';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form';
import { Purchase, purchaseSchema, DEFAULT_PURCHASE } from '@jumble/shared';
import { Input, Header, Button, ProductTable, useToast } from '@/components';
import { STATUS } from '@/constants/status';
import UploadButton from './components/UploadButton';
import { useCreatePurchase, useImageUpload } from './apis';
import { PATHS } from '@/router';

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

export default function PurchaseNew() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Purchase>({
    resolver: standardSchemaResolver(purchaseSchema),
    defaultValues: DEFAULT_PURCHASE,
  });
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'products',
  });

  const { mutate, isPending: isImageUploading } = useImageUpload({
    setValue: (name, value) => setValue(name, value, { shouldValidate: true }),
    replace: (data) => {
      replace(data);
      trigger('products');
    },
  });
  const { mutate: handleCreatePurchase } = useCreatePurchase();

  const handleImageUpload = (file: File) => {
    mutate(file, {
      onError: () => toast.error('영수증 분석에 실패했습니다.'),
    });
  };
  const handleSave = handleSubmit(
    (data: Purchase) => {
      handleCreatePurchase(data, {
        onSuccess: () => {
          toast.success('사입내역이 추가되었습니다.');
          navigate(PATHS.PURCHASE_LIST);
        },
        onError: () => {
          toast.error('사입내역 추가에 실패했습니다.');
        },
      });
    },
    (errors: FieldErrors<Purchase>) => {
      if (Object.keys(errors).length !== 0) {
        toast.error('입력하지 않은 항목이 있습니다.');
      }
    },
  );

  return (
    <main>
      {isImageUploading && (
        <div className="bg-overlay fixed inset-0 z-20 flex items-center justify-center">
          <div className="border-t-primary-3 border-gray-2 h-8 w-8 animate-spin rounded-full border-3"></div>
        </div>
      )}
      <Header />
      <div className="flex items-center justify-between px-[7.2rem] py-[2.6rem]">
        <h1 className="title-18-m text-gray-9">사입 내역 추가</h1>
        <UploadButton onUpload={handleImageUpload} isLoading={isImageUploading}>
          {isImageUploading ? '분석 중...' : '영수증으로 입력하기'}
        </UploadButton>
      </div>
      <form onSubmit={handleSave}>
        <section className="mx-[6.4rem] flex flex-col gap-[2.4rem] rounded-[1.6rem] bg-white px-[3.8rem] py-[3rem]">
          {/* 사입일시 */}
          <div className="flex w-[48rem] items-center gap-[0.8rem]">
            <h2 className="title-16-m w-[9.4rem] shrink-0">사입일시</h2>
            <Input
              type="datetime-local"
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
            <ProductTable
              headers={TABLE_HEADERS}
              hasProductId={false}
              isEditing={true}
              register={register}
              control={control}
              errors={errors}
              fields={fields}
              append={append}
              remove={remove}
            />
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
