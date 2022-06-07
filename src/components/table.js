import React, { useState, useEffect } from "react";
import TableData from "../data/user.json";
import "../App.css";

// Number of elements per page
const PAGE_SIZE = 5;

// number of pages visible to user in pagination section ex.4 means 2,3,4,5
// Page and 1 and Last is visble by default.
const MAX_PAGE_NUMBER = 4;

const Table = () => {
  const [values, setValues] = useState({
    data: TableData,
    currentPageNumber: 0,
    currentPageData: [],
    totalPages: 1,
    pageArray: [],
    currentPaginationSet: 1,
    maximumPaginationSet: 1,
    pageNumberTobeShown: [],
    isNextSetClicked: false,
    isPreviousSetClicked: false,
  });

  useEffect(() => {
    let currentData;
    let maxPage;
    let pagesArray = [];
    const { data } = values;
    const length = Math.ceil(data.length / PAGE_SIZE);

    //If page length is more than 1
    if (length > 1) {
      currentData = data.slice(0, PAGE_SIZE);
      for (let i = 0; i < length - 2; i++) {
        pagesArray.push(i + 2);
      }
      maxPage = Math.ceil(pagesArray.length / MAX_PAGE_NUMBER);
      setValues({
        ...values,
        totalPages: length,
        pageArray: pagesArray,
        maximumPaginationSet: maxPage,
        currentPageNumber: 1,
      });
    }

    // If page length is 1
    else {
      setValues({ ...values, currentPageData: data });
    }
  }, []);

  const setPageNumber = (pageNumber) => {
    setValues({ ...values, currentPageNumber: pageNumber });
  };

  useEffect(() => {
    if (values.currentPageNumber > 0) {
      getSelectedPagedata();
    }
  }, [values.currentPageNumber]);

  const getSelectedPagedata = () => {
    const {
      data,
      totalPages,
      pageArray,
      currentPaginationSet,
      pageNumberTobeShown,
      isPreviousSetClicked,
      isNextSetClicked,
      currentPageNumber,
    } = values;
    let currentData = [];
    let pageNumtoShown = pageNumberTobeShown;
    let currentPageSet = currentPaginationSet;

    // get current page data
    currentData = data.slice(
      (currentPageNumber - 1) * PAGE_SIZE,
      (currentPageNumber - 1) * PAGE_SIZE + PAGE_SIZE
    );

    const pagePresent = pageNumberTobeShown?.find(
      (element) => element === currentPageNumber
    );
    if (!pagePresent) {
      if (isNextSetClicked === true) {
        pageNumtoShown = pageArray.slice(
          currentPageNumber - 2,
          MAX_PAGE_NUMBER * currentPaginationSet
        );
      } else if (isPreviousSetClicked) {
        pageNumtoShown = pageArray.slice(
          MAX_PAGE_NUMBER * (currentPaginationSet - 1),
          currentPageNumber - 1
        );
      } else if (currentPageNumber === totalPages) {
        const pageset = totalPages / MAX_PAGE_NUMBER;
        const pageSetRounded = Math.floor(pageset);
        if (pageSetRounded !== 1) {
          currentPageSet = pageSetRounded;
          pageNumtoShown = pageArray.slice(
            MAX_PAGE_NUMBER * (pageSetRounded - 1),
            currentPageNumber - 1
          );
        }
      } else {
        pageNumtoShown = pageArray.slice(
          currentPageNumber - 1,
          MAX_PAGE_NUMBER * 1
        );
        currentPageSet = 1;
      }
    }
    setValues({
      ...values,
      pageNumberTobeShown: pageNumtoShown,
      currentPaginationSet: currentPageSet,
      currentPageData: currentData,
      isPreviousSetClicked: false,
      isNextSetClicked: false,
    });
  };

  const loadPreviousSet = (e) => {
    const { currentPaginationSet, pageNumberTobeShown } = values;
    if (currentPaginationSet === 1) {
      e.preventDefault();
    } else {
      const firstElement = pageNumberTobeShown[0];
      const pageNum = firstElement - 1;
      setValues({
        ...values,
        isPreviousSetClicked: true,
        isNextSetClicked: false,
        currentPaginationSet: currentPaginationSet - 1,
        currentPageNumber: pageNum,
      });
    }
  };

  const loadNextSet = (e) => {
    const { currentPaginationSet, maximumPaginationSet, pageNumberTobeShown } =
      values;
    if (currentPaginationSet === maximumPaginationSet) {
      e.preventDefault();
    } else {
      const lastElement = pageNumberTobeShown[pageNumberTobeShown.length - 1];
      const pageNum = lastElement + 1;
      setValues({
        ...values,
        isPreviousSetClicked: false,
        isNextSetClicked: true,
        currentPaginationSet: currentPaginationSet + 1,
        currentPageNumber: pageNum,
      });
    }
  };
  const {
    currentPageData,
    totalPages,
    currentPaginationSet,
    maximumPaginationSet,
    currentPageNumber,
    pageNumberTobeShown,
  } = values;
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
      {totalPages > 1 && (
        <div className="pagination-container">
          <a
            className={
              currentPaginationSet === 1 ? "disabled chevron" : "chevron"
            }
            onClick={(e) => loadPreviousSet(e)}
          >
            Prev Set
          </a>
          <span
            className={
              currentPageNumber === 1
                ? "highligted-page page-numbers"
                : "page-numbers"
            }
            onClick={() => setPageNumber(1)}
          >
            1
          </span>
          {currentPaginationSet !== 1 && <span className="dots">...</span>}
          <span className="number-cotainer">
            {pageNumberTobeShown.map((x, i) => (
              <span
                key={i}
                onClick={() => setPageNumber(x)}
                className={
                  currentPageNumber === x
                    ? "highligted-page page-numbers"
                    : "page-numbers"
                }
              >
                {x}
              </span>
            ))}
          </span>
          {currentPaginationSet !== maximumPaginationSet && (
            <span className="dots">...</span>
          )}
          <span
            className={
              currentPageNumber === totalPages
                ? "highligted-page page-numbers"
                : "page-numbers"
            }
            onClick={() => setPageNumber(totalPages)}
          >
            {totalPages}
          </span>
          <a
            className={
              currentPaginationSet === maximumPaginationSet
                ? "disabled chevron"
                : "chevron"
            }
            onClick={(e) => loadNextSet(e)}
          >
            Next Set
          </a>
        </div>
      )}
    </div>
  );
};

export default Table;
