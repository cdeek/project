
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <div className='flex'>
        <div className='p-5 w-full md:max-w-[1140px]'>{children}</div>
      </div>
    </section>
  );
};

export default MainLayout;

