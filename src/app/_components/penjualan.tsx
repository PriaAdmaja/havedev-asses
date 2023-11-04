"use client";
import Image from "next/image";
import React, { useState, useEffect, forwardRef } from "react";
import axios, { AxiosResponse } from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [dateStartOpen, setDateStartOpen] = useState(false);
  const [dateEndOpen, setDateEndOpen] = useState(false);

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

  interface CustomDateInputProps {
    value: string;
    onClick: () => void;
  }

  const CustomDateInput = forwardRef<HTMLButtonElement, CustomDateInputProps>(
    ({ value, onClick }, ref) => (
      <button onClick={onClick} ref={ref}>
        {value}
      </button>
    )
  );

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 70,
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
        <div className="grid grid-cols-5 w-full py-2 px-4 border-b border-b-solid border-b-borderPrimary">
          <div className="flex justify-start items-center gap-2 col-span-1">
            <button type="button" onClick={() => setExpanded(!expanded)}>
              <Image
                src={dropdownImg}
                alt="dropdown"
                className={`${
                  expanded ? "rotate-180" : ""
                } transition ease-in-out duration-300`}
              />
            </button>

            <p className="text-left">{date}</p>
          </div>
          <div className="col-span-1">
            <button type="button">
              <Image src={exportClrImg} alt="export" />
            </button>
          </div>
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
        {({ registerChild, measure }: CellMeasurerChildProps) => (
          <div
            ref={(element) => {
              if (element) {
                registerChild && registerChild(element);
              }
            }}
          >
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
                        className={`opacity-0`}
                      />
                      <p className="text-left">{d.sale_code}</p>
                    </div>
                    <p className="col-span-1 px-4">{d.customer.name}</p>
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
    <main className="p-3 bg-[#eaeaea] h-screen ">
      <section className="p-4 bg-white rounded-lg h-full overflow-y-hidden">
        <section className="flex justify-between items-center mb-2">
          <p className="font-medium text-base">Laporan Penjualan</p>
          <div className="flex justify-center items-end gap-2">
            <div>
              <p>Tanggal</p>
              <div className="flex justify-between items-center w-[280px] p-2 rounded border-solid border border-borderSecondary">
                <div className="relative">
                  <button
                    type="button"
                    className="text-sm text-black font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      setDateStartOpen(!dateStartOpen);
                    }}
                  >
                    {dateStart === null
                      ? "Tanggal Mulai"
                      : dayjs(dateStart).format("DD/MM/YYYY")}
                  </button>
                  <div className={`absolute z-50 ${dateStartOpen ? 'block' : 'hidden'}`}>
                    <DatePicker
                      selected={dateStart === null ? new Date() : dateStart}
                      onChange={(e) => {
                        setDateStart(e);
                        setDateStartOpen(!dateStartOpen);
                      }}
                      inline
                    />
                  </div>
                </div>
                <Image src={arrowRight} alt="arrow" className="w-4" />
                <div className="relative">
                  <button
                    type="button"
                    className="text-sm text-black font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      setDateEndOpen(!dateEndOpen);
                    }}
                  >
                    {dateStart === null
                      ? "Tanggal Berakhir"
                      : dayjs(dateEnd).format("DD/MM/YYYY")}
                  </button>
                  <div className={`absolute z-50 ${dateEndOpen ? 'block' : 'hidden'} right-0`}>
                    <DatePicker
                      selected={dateEnd === null ? new Date() : dateEnd}
                      onChange={(e) => {
                        setDateEnd(e);
                        setDateEndOpen(!dateEndOpen);
                      }}
                      inline
                    />
                  </div>
                </div>
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
        <table className="w-full h-5/6">
          <thead className="bg-primary text-white ">
            <tr className="grid grid-cols-5">
              <td className="py-2 px-4 col-span-2 text-left">Nota Penjualan</td>

              <td className="py-2 px-4 col-span-1">Customer</td>

              <td className="py-2 px-4 text-right col-span-2">Total (Rp)</td>
            </tr>
          </thead>
          <AutoSizer>
            {({ height, width }) => (
              <List
                rowRenderer={rowRenderer}
                deferredMeasurementCache={cache}
                height={height}
                rowHeight={cache.rowHeight}
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
