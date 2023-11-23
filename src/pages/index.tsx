import Sensors from "@/components/Sensors";

// import dynamic from "next/dynamic";
// const MyMap = dynamic(() => import("@/components/MyMap"), { ssr: false });

export default function Home() {
  return (
    <main>
      <div className='container flex justify-center items-center'>
        <a href='https://wa.me/15550517359' target='_blank'>
          Open
        </a>
        <a href='sms:+4917641317141' target='_blank'>
          SMS
        </a>
      </div>
    </main>
  );
}
