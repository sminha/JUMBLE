import { useNavigate } from 'react-router';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useFieldArray, useForm } from 'react-hook-form';
import { Purchase, purchaseSchema, DEFAULT_PURCHASE } from '@jumble/shared';
import Input from '@/components/Input';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { STATUS } from '@/constants/status';
import UploadButton from './components/UploadButton';
import ProductTable from '@/components/ProductTable';
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
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Purchase>({
    resolver: standardSchemaResolver(purchaseSchema),
    defaultValues: DEFAULT_PURCHASE,
  });
  const { replace } = useFieldArray({
    control,
    name: 'products',
  });

  const { mutate: handleImageUpload, isPending: isImageUploading } = useImageUpload({
    setValue,
    replace,
  });
  const { mutate: handleCreatePurchase } = useCreatePurchase();

  const handleSave = handleSubmit((data) => {
    handleCreatePurchase(data, {
      onSuccess: () => {
        // TODO: 추후 토스트 추가
        navigate(PATHS.PURCHASE_LIST);
      },
      onError: () => {
        // TODO: 추후 토스트로 변경
        alert('사입내역 추가에 실패했습니다. 다시 시도해주세요.');
      },
    });
  });

  return (
    <main>
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
