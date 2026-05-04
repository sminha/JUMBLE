import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Purchase, purchaseSchema, DEFAULT_PURCHASE, DEFAULT_PRODUCT } from '@jumble/shared';
import { cn } from '@/utils/cn';
import { PATHS } from '@/router';
import { STATUS } from '@/constants/status';
import { Input, Header, Button, ProductTable, useToast } from '@/components';
import ProductCard from '@/pages/purchases/new/components/ProductCard';
import UploadButton from '@/pages/purchases/new/components/UploadButton';
import { useCreatePurchase, useImageUpload } from '@/pages/purchases/new/apis';

const TABLE_HEADERS: { label: string; width: string }[] = [
  { label: '상품명', width: 'w-[25.5rem]' },
  { label: '구분', width: 'w-[10.9rem]' },
  { label: '컬러', width: 'w-[9.6rem]' },
  { label: '사이즈', width: 'w-[9.6rem]' },
  { label: '기타옵션', width: 'w-[25.5rem]' },
  { label: '단가', width: 'w-[9.6rem]' },
  { label: '수량', width: 'w-[6rem]' },
  { label: '금액합계', width: 'w-[9.6rem]' },
  { label: '미송수량', width: 'w-[6rem]' },
  { label: '', width: 'w-[4rem]' },
];

export default function PurchaseNew() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
    () => {
      toast.error('입력하지 않은 항목이 있습니다.');
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

      <div className="hidden items-center justify-between px-[clamp(2rem,calc(11vw-5.4rem),6.4rem)] py-[1.7rem] sm:flex">
        <h1 className="title-18-m text-gray-9">사입 내역 추가</h1>
        <UploadButton id="upload-desktop" onUpload={handleImageUpload} isLoading={isImageUploading}>
          {isImageUploading ? '분석 중...' : '영수증으로 입력하기'}
        </UploadButton>
      </div>

      <form onSubmit={handleSave}>
        <section className="mx-[clamp(2rem,calc(11vw-5.4rem),6.4rem)] my-[2rem] flex flex-col gap-[2.4rem] rounded-[1.6rem] bg-white px-[2rem] py-[2.4rem] sm:mt-0 sm:px-[3.8rem] sm:py-[3rem]">
          {/* 사입일시 */}
          <div className="flex flex-col gap-[0.8rem] sm:w-[48rem] sm:flex-row sm:items-center">
            <h2 className="text-gray-9 text-[1.4rem] leading-[1.4] font-medium sm:w-[9.4rem] sm:shrink-0 sm:text-[1.6rem]">
              사입일시
            </h2>
            <Input
              type="datetime-local"
              {...register('purchasedAt')}
              status={errors.purchasedAt ? STATUS.ERROR : STATUS.DEFAULT}
            />
          </div>

          {/* 거래처명 */}
          <div className="flex flex-col gap-[0.8rem] sm:w-[48rem] sm:flex-row sm:items-center">
            <h2 className="text-gray-9 text-[1.4rem] leading-[1.4] font-medium sm:w-[9.4rem] sm:shrink-0 sm:text-[1.6rem]">
              거래처명
            </h2>
            <Input {...register('vendor')} status={errors.vendor ? STATUS.ERROR : STATUS.DEFAULT} />
          </div>

          {/* 상품목록 - JS 조건부 렌더링으로 이중 등록 방지 */}
          {isMobile ? (
            <div className="flex flex-col gap-[1.6rem]">
              <div className="flex items-center justify-between">
                <h2 className="title-14-m text-gray-9">상품목록</h2>
                <Button size="small" variant="white" onClick={() => append(DEFAULT_PRODUCT)}>
                  + 상품 추가하기
                </Button>
              </div>
              <div className="flex flex-col gap-[1.2rem]">
                {fields.map((field, index) => (
                  <ProductCard
                    key={field.id}
                    index={index}
                    count={fields.length}
                    register={register}
                    control={control}
                    errors={errors}
                    remove={remove}
                  />
                ))}
              </div>
            </div>
          ) : (
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
          )}
        </section>

        {/* 추가하기 버튼 */}
        <div
          className={
            isMobile
              ? 'border-gray-1 sticky bottom-0 z-10 border-t bg-white px-8 py-[1.6rem] sm:hidden'
              : 'hidden justify-center py-[3.2rem] sm:flex'
          }
        >
          <Button
            type="submit"
            size="large"
            variant="primary"
            className={isMobile ? 'w-full py-[1.4rem]' : ''}
          >
            추가하기
          </Button>
        </div>
      </form>

      {/* 모바일 - 영수증 입력 버튼 */}
      <div className="fixed right-[2rem] bottom-[8.8rem] z-10 sm:hidden">
        <UploadButton
          id="upload-fab"
          onUpload={handleImageUpload}
          isLoading={isImageUploading}
          className={cn(
            'flex min-w-0 items-center gap-[0.6rem] rounded-full px-[2rem] py-[1.4rem] shadow-lg',
            isImageUploading && 'cursor-not-allowed',
          )}
        >
          <Camera size={16} strokeWidth={2} />
          <span className="font-12-m">{isImageUploading ? '분석 중...' : '영수증 입력'}</span>
        </UploadButton>
      </div>
    </main>
  );
}
