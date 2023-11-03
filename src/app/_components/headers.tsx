'use client'
import Image from "next/image";
import { useState } from 'react'
import arrowIcon from "../../assets/icon/arrow.svg"

const Header = () => {
  const [location, setLocation] = useState('laporan')
  
  return (
    <header className="h-20 flex justify-end items-center gap-2 px-3 bg-white ">
      <div className="cursor-pointer p-2 select-none">Dashboard</div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer select-none">
        <p>Master</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer select-none text-neutral-900">
        <p>Pembelian</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer select-none">
        <p>Konsinyasi</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer select-none">
        <p>Laporan</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer select-none">
        <p>Informasi</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
    </header>
  );
};

export default Header