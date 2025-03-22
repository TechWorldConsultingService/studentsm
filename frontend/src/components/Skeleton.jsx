import { Skeleton } from "antd";

export default function SkeletonLoader() {
  return (
    <div className="sms-skeleton-wrappersss">
      {/* <aside className="sms-skeleton-aside h-screen bg-[#ece2f7]"></aside>
      <header className="sms-skeleton-header bg-[#7e22ce] h-[52px]"></header> */}
      <main className="sms-skeleton-mains mx-8 mt-16">
        <Skeleton active paragraph />
        <Skeleton active paragraph className="mt-8" />
        <Skeleton active paragraph className="mt-8" />
      </main>
    </div>
  );
}
