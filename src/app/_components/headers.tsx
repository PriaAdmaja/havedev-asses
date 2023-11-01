import Image from "next/image";
import arrowIcon from "../../assets/icon/arrow.svg"

const Header = () => {
  return (
    <header className="h-20 flex justify-end items-center gap-2 px-3 bg-white">
      <div className="cursor-pointer">Dashboard</div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer">
        <p>Master</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer">
        <p>Pembelian</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer">
        <p>Konsinyasi</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer">
        <p>Laporan</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
      <div className="flex justify-center items-center p-2 gap-2 cursor-pointer">
        <p>Informasi</p>
        <Image src={arrowIcon} alt="arrow" />
      </div>
    </header>
  );
};

export default Header