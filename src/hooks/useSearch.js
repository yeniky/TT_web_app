import { useState, useEffect } from "react";

const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const setData = (data) => {
    setInitialData(data);
  };

  useEffect(() => {
    if (searchQuery) {
      const filteredData = initialData.filter((item) =>
        Object.keys(item).some(
          (key) =>
            item[key] &&
            item[key]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
      setTableData(filteredData);
    } else {
      setTableData(initialData);
    }
  }, [searchQuery, initialData]);

  return { searchQuery, tableData, handleSearchChange, setData };
};

export default useSearch;
