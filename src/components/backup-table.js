
// Ignore this file... Refined code is present in table.js

import React, { useState, useEffect } from "react";
import TableData from "../data/user.json";
import "../App.css";

const PAGE_SIZE = 5;
const MAX_PAGE_NUMBER = 3;
const TABLE_DATA = TableData;

const Table = () => {
    const [currentPageData, setCurrentPageData] = useState([]);
    const [pageNumber, setPage] = useState();
    const [totalPages, setTotalPage] = useState(1);
    const [pageArray, setPageArray] = useState([]);
    const [maxpaginationSet, setMaxpaginationSet] = useState();
    const [paginationSet, setPaginationSet] = useState(1);
    const [pageNumberTobeShown, setPageNumberTobeShown] = useState([]);
    const [isNextSetClicked, setIsNextSetClicked] = useState(false);
    const [isPreviousSetClicked, setIsPreviousSetClicked] = useState(false);

    useEffect(() => {
        const length = Math.ceil(TABLE_DATA.length / PAGE_SIZE);
        let currentData;
        let maxPage;
        let pages = [];
        if (length > 1) {
            currentData = TABLE_DATA.slice(0, PAGE_SIZE);
            for (let i = 0; i < length - 2; i++) {
                pages.push(i + 2);
            }
            maxPage = Math.ceil(pages.length / MAX_PAGE_NUMBER);
            setTotalPage(length);
            setPage(1);
            setPageArray(pages);
            setMaxpaginationSet(maxPage);
            getSelectedPagedata(1, pages, length, 1, false, false);
        } else {
            currentData = TABLE_DATA;
            setCurrentPageData(currentData);
        }
    }, []);

    const loadPreviousSet = (e) => {
        if (paginationSet === 1) {
            e.preventDefault();
        } else {
            let pageSet = paginationSet;
            const firstElement = pageNumberTobeShown[0];
            setIsNextSetClicked(false);
            setIsPreviousSetClicked(true);
            const pageNum = firstElement - 1;
            setPaginationSet(paginationSet - 1);
            getSelectedPagedata(
                pageNum,
                pageArray,
                totalPages,
                pageSet - 1,
                true,
                false
            );
        }
    };

    const loadNextSet = (e) => {
        if (paginationSet === maxpaginationSet) {
            e.preventDefault();
        } else {
            let pageSet = paginationSet;
            const lastElement = pageNumberTobeShown[pageNumberTobeShown.length - 1];
            setIsNextSetClicked(true);
            setIsPreviousSetClicked(false);
            const pageNum = lastElement + 1;
            setPaginationSet(paginationSet + 1);
            getSelectedPagedata(
                pageNum,
                pageArray,
                totalPages,
                pageSet + 1,
                false,
                true
            );
        }
    };

    const getSelectedPagedata = (
        pageNum,
        pages,
        length,
        set,
        isPrevClicked,
        isNextClicked
    ) => {
        setPage(pageNum);
        let currentPageData = [];
        let pageNumtoShown = [];

        currentPageData = TABLE_DATA.slice(
            (pageNum - 1) * PAGE_SIZE,
            (pageNum - 1) * PAGE_SIZE + PAGE_SIZE
        );
        setCurrentPageData(currentPageData);
        const pagePresent = pageNumberTobeShown?.find(
            (element) => element === pageNum
        );
        if (!pagePresent && pageNum !== length && pageNum !== 1) {
            if (isNextClicked) {
                pageNumtoShown = pages.slice(pageNum - 2, MAX_PAGE_NUMBER * set);
            } else if (isPrevClicked) {
                pageNumtoShown = pages.slice(MAX_PAGE_NUMBER * (set - 1), pageNum - 1);
            }
            setPageNumberTobeShown(pageNumtoShown);
        } else if (pageNum === length) {
            const pageset = length / MAX_PAGE_NUMBER;
            const pageSetApproximate = Math.floor(pageset);
            if (pageSetApproximate !== 1) {
                setPaginationSet(pageSetApproximate);
                pageNumtoShown = pages.slice(
                    MAX_PAGE_NUMBER * (pageSetApproximate - 1),
                    pageNum - 1
                );
            }
            setPageNumberTobeShown(pageNumtoShown);
        } else if (pageNum === 1) {
            pageNumtoShown = pages.slice(pageNum - 1, MAX_PAGE_NUMBER * 1);
            setPaginationSet(1);
            setPageNumberTobeShown(pageNumtoShown);
        }
    };

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Email</td>
                        <td>IsActive</td>
                    </tr>
                </thead>
                <tbody>
                    {currentPageData.map((data, i) => (
                        <tr key={i}>
                            <td>{data.name}</td>
                            <td>{data.email}</td>
                            <td>{data.isActive}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 && <div className="pagination-container">
                <a className={
                    paginationSet === 1
                        ? "disabled chevron"
                        : "chevron"
                } onClick={(e) => loadPreviousSet(e)}>
                    Prev
                </a>
                <span
                    className={
                        pageNumber === 1 ? "highligted-page page-numbers" : "page-numbers"
                    }
                    onClick={() =>
                        getSelectedPagedata(
                            1,
                            pageArray,
                            totalPages,
                            paginationSet,
                            isPreviousSetClicked,
                            isNextSetClicked
                        )
                    }
                >
                    1
                </span>
                {paginationSet !== 1 && <span className="dots">...</span>}
                <span className="number-cotainer">
                    {pageNumberTobeShown.map((x, i) => (
                        <span
                            key={i}
                            onClick={() =>
                                getSelectedPagedata(
                                    x,
                                    pageArray,
                                    totalPages,
                                    paginationSet,
                                    isPreviousSetClicked,
                                    isNextSetClicked
                                )
                            }
                            className={
                                pageNumber === x
                                    ? "highligted-page page-numbers"
                                    : "page-numbers"
                            }
                        >
                            {x}
                        </span>
                    ))}
                </span>
                {paginationSet !== maxpaginationSet && (
                    <span className="dots">...</span>
                )}
                <span
                    className={
                        pageNumber === totalPages
                            ? "highligted-page page-numbers"
                            : "page-numbers"
                    }
                    onClick={() =>
                        getSelectedPagedata(
                            totalPages,
                            pageArray,
                            totalPages,
                            paginationSet,
                            isPreviousSetClicked,
                            isNextSetClicked
                        )
                    }
                >
                    {totalPages}
                </span>
                <a className={
                    paginationSet === maxpaginationSet
                        ? "disabled chevron"
                        : "chevron"
                } onClick={(e) => loadNextSet(e)}>
                    Next
                </a>
            </div>}

        </div>
    );
};

export default Table;
