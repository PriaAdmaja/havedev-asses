"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import {
  List,
  ListRowProps,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Table,
  Column,
} from "react-virtualized";
import "react-virtualized/styles.css";
import dayjs from "dayjs";
import _ from "lodash";

import arrowRight from "../../assets/icon/arrow-right.svg";
import dateImg from "../../assets/icon/date.svg";
import exportImg from "../../assets/icon/export.svg";
import dropdownImg from "../../assets/icon/dropdown.svg";
import exportClrImg from "../../assets/icon/exportColor.svg";
import { CellMeasurerChildProps } from "react-virtualized/dist/es/CellMeasurer";

const Penjualan = () => {
  const [data, setData] = useState<AxiosResponse | null>(null);

  useEffect(() => {
    const url: string = process.env["NEXT_PUBLIC_BE_API"] as string;
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const dataByDate = _(data?.data)
    .groupBy("date")
    .map((data, date) => ({ data: data, date: date }))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .value();
  console.log(dataByDate);

  const showDataByDate = dataByDate
    .map((d) => ({
      date: d.date,
      total: d.data.map((datum) => datum.total).reduce((a, b) => a + b),
    }))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

  if (data === null) {
    return (
      <div className="h-screen flex justify-center items-center animate-pulse text-xl bg-[#eaeaea] font-bold">
        Loading
      </div>
    );
  }

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });

  const Collapsible = ({
    children,
    onChange,
    date,
    total,
  }: {
    children: React.ReactNode;
    date: string;
    total: string;
    onChange: () => void;
  }) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      onChange && onChange();
    }, [expanded, onChange]);

    return (
      <>
        <div
          className="grid grid-cols-5 w-full py-2 px-4 cursor-pointer border-b border-b-solid border-b-borderPrimary"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex justify-start items-center gap-2 col-span-1">
            <Image
              src={dropdownImg}
              alt="dropdown"
              className={`${
                expanded ? "rotate-180" : ""
              } transition ease-in-out duration-300`}
            />
            <p className="text-left">{date}</p>
          </div>
          <button type="button" className="col-span-1">
            <Image src={exportClrImg} alt="export" />
          </button>
          <p className="col-span-3 text-right">{total}</p>
        </div>
        {expanded && <>{children}</>}
      </>
    );
  };

  const rowRenderer = ({ index, key, parent }: ListRowProps) => {
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
        className="flex justify-between py-2 px-4 border-b border-b-solid border-b-borderPrimary"
      >
        {({ registerChild, measure }) => (
          <div ref={registerChild}>
            <Collapsible
              onChange={measure}
              date={dayjs(showDataByDate[index].date).format("DD MMMM YYYY")}
              total={Number(showDataByDate[index].total)
                .toLocaleString()
                .replace(/,/g, ".")}
            >
              {dataByDate[index].data.map((d, i) => {
                return (
                  <div
                    key={i}
                    className="grid grid-cols-5 py-2 px-4 border-b border-b-solid border-b-borderPrimary"
                  >
                    <div className="flex justify-start items-center gap-2 col-span-2">
                      <Image
                        src={dropdownImg}
                        alt="dropdown"
                        className={`hidden`}
                      />
                      <p className="text-left">{d.sale_code}</p>
                    </div>
                    <p className="col-span-1">{d.customer.name}</p>
                    <p className="col-span-2 text-right">
                      {Number(d.total).toLocaleString().replace(/,/g, ".")}
                    </p>
                  </div>
                );
              })}
            </Collapsible>
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <main className="p-3 bg-[#eaeaea] h-screen">
      <section className="p-4 bg-white rounded-lg h-full">
        <section className="flex justify-between items-center mb-2">
          <p className="font-medium text-base">Laporan Penjualan</p>
          <div className="flex justify-center items-end gap-2">
            <div>
              <p>Tanggal</p>
              <div className="flex justify-between items-center w-[280px] p-2 rounded border-solid border border-borderSecondary">
                <p className="text-sm text-black font-medium">Tanggal Mulai</p>
                <Image src={arrowRight} alt="arrow" className="w-4" />
                <p className="text-sm text-black font-medium">
                  Tanggal Berakhir
                </p>
                <Image src={dateImg} alt="date" className="w-3" />
              </div>
            </div>
            <button
              type="button"
              className="bg-btnPrimary rounded p-2 flex justify-center items-center gap-2"
            >
              <Image src={exportImg} alt="export" />
              <p className="text-white text-base">Export</p>
            </button>
          </div>
        </section>
        <table className="w-full">
          <thead className="bg-primary text-white ">
            <tr className="grid grid-cols-5">
              <td className="py-2 px-4 col-span-2 text-left">Nota Penjualan</td>

              <td className="py-2 px-4 col-span-1">Customer</td>

              <td className="py-2 px-4 text-right col-span-2">Total (Rp)</td>
            </tr>
          </thead>
          <AutoSizer>
            {({ width }) => (
              <List
                rowRenderer={rowRenderer}
                height={500}
                rowHeight={50}
                rowCount={dataByDate.length}
                width={width}
              />
            )}
          </AutoSizer>
        </table>
      </section>
    </main>
  );
};

export default Penjualan;
